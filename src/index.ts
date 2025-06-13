#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import axios, { AxiosInstance } from 'axios';

const API_URL = process.env.PAPER_INVEST_API_URL || 'https://api.paperinvest.io/v1';
const API_KEY = process.env.PAPER_INVEST_API_KEY;

if (!API_KEY) {
  console.error('Error: PAPER_INVEST_API_KEY environment variable is required');
  process.exit(1);
}

// Token cache for JWT authentication
const tokenCache: { token?: string; expiry?: Date } = {};

// Get JWT token from API key
async function getAuthToken(apiKey: string): Promise<string> {
  // Check cache first
  if (tokenCache.token && tokenCache.expiry && new Date() < tokenCache.expiry) {
    return tokenCache.token;
  }

  try {
    const response = await axios.post(`${API_URL}/auth/token`, { apiKey });
    const token = response.data.token;
    
    // Parse JWT expiry
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      tokenCache.expiry = new Date(payload.exp * 1000);
    } catch {
      tokenCache.expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour default
    }
    
    tokenCache.token = token;
    return token;
  } catch (error: any) {
    throw new Error(`Authentication failed: ${error.message}`);
  }
}

// Create axios instance with auth interceptor
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth interceptor
api.interceptors.request.use(async (config) => {
  const token = await getAuthToken(API_KEY!);
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Create MCP server
const server = new Server({
  name: 'paper-invest',
  version: '1.0.0'
}, {
  capabilities: {
    tools: {}
  }
});

// Define all available tools based on actual API endpoints
const tools = [
  // === ACCOUNT MANAGEMENT ===
  {
    name: 'get_account',
    description: 'Get account details by ID',
    inputSchema: {
      type: 'object',
      properties: {
        accountId: { type: 'string', description: 'Account ID' }
      },
      required: ['accountId']
    }
  },
  {
    name: 'update_account',
    description: 'Update account details',
    inputSchema: {
      type: 'object',
      properties: {
        accountId: { type: 'string', description: 'Account ID' },
        name: { type: 'string', description: 'New account name' }
      },
      required: ['accountId']
    }
  },
  {
    name: 'freeze_account',
    description: 'Freeze a trading account',
    inputSchema: {
      type: 'object',
      properties: {
        accountId: { type: 'string', description: 'Account ID to freeze' }
      },
      required: ['accountId']
    }
  },

  // === PORTFOLIO OPERATIONS ===
  {
    name: 'create_portfolio',
    description: 'Create a new portfolio',
    inputSchema: {
      type: 'object',
      properties: {
        accountId: { type: 'string', description: 'Account ID' },
        name: { type: 'string', description: 'Portfolio name' },
        type: { type: 'string', description: 'Portfolio type (e.g., INDIVIDUAL, IRA)' }
      },
      required: ['accountId', 'name', 'type']
    }
  },
  {
    name: 'get_portfolio',
    description: 'Get portfolio details',
    inputSchema: {
      type: 'object',
      properties: {
        portfolioId: { type: 'string', description: 'Portfolio ID' }
      },
      required: ['portfolioId']
    }
  },
  {
    name: 'get_account_portfolios',
    description: 'Get all portfolios for an account',
    inputSchema: {
      type: 'object',
      properties: {
        accountId: { type: 'string', description: 'Account ID' }
      },
      required: ['accountId']
    }
  },
  {
    name: 'reset_portfolio',
    description: 'Reset portfolio to initial state',
    inputSchema: {
      type: 'object',
      properties: {
        portfolioId: { type: 'string', description: 'Portfolio ID to reset' }
      },
      required: ['portfolioId']
    }
  },

  // === POSITIONS ===
  {
    name: 'get_portfolio_equities',
    description: 'Get all equity positions in a portfolio',
    inputSchema: {
      type: 'object',
      properties: {
        portfolioId: { type: 'string', description: 'Portfolio ID' }
      },
      required: ['portfolioId']
    }
  },
  {
    name: 'get_portfolio_options',
    description: 'Get all option positions in a portfolio',
    inputSchema: {
      type: 'object',
      properties: {
        portfolioId: { type: 'string', description: 'Portfolio ID' }
      },
      required: ['portfolioId']
    }
  },

  // === TRADING ===
  {
    name: 'create_order',
    description: 'Create a new trading order',
    inputSchema: {
      type: 'object',
      properties: {
        portfolioId: { type: 'string', description: 'Portfolio ID' },
        symbol: { type: 'string', description: 'Stock symbol' },
        quantity: { type: 'number', description: 'Number of shares' },
        side: { 
          type: 'string', 
          enum: ['BUY_TO_OPEN', 'SELL_TO_CLOSE', 'SELL_TO_OPEN', 'BUY_TO_CLOSE'],
          description: 'Order side'
        },
        type: { 
          type: 'string', 
          enum: ['MARKET', 'LIMIT', 'STOP', 'STOP_LIMIT'],
          description: 'Order type'
        },
        timeInForce: {
          type: 'string',
          enum: ['DAY', 'GTC', 'IOC', 'FOK'],
          description: 'Time in force (default: DAY)'
        },
        limitPrice: { type: 'number', description: 'Limit price (for limit orders)' },
        stopPrice: { type: 'number', description: 'Stop price (for stop orders)' },
        assetClass: { type: 'string', description: 'Asset class (default: EQUITY)' },
        session: { type: 'string', description: 'Trading session (default: REGULAR)' }
      },
      required: ['portfolioId', 'symbol', 'quantity', 'side', 'type']
    }
  },
  {
    name: 'create_batch_orders',
    description: 'Create multiple orders at once',
    inputSchema: {
      type: 'object',
      properties: {
        orders: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              portfolioId: { type: 'string' },
              symbol: { type: 'string' },
              quantity: { type: 'number' },
              side: { type: 'string' },
              type: { type: 'string' }
            }
          },
          description: 'Array of order objects'
        }
      },
      required: ['orders']
    }
  },
  {
    name: 'get_order',
    description: 'Get order details by ID',
    inputSchema: {
      type: 'object',
      properties: {
        orderId: { type: 'string', description: 'Order ID' }
      },
      required: ['orderId']
    }
  },
  {
    name: 'cancel_order',
    description: 'Cancel an existing order',
    inputSchema: {
      type: 'object',
      properties: {
        orderId: { type: 'string', description: 'Order ID to cancel' }
      },
      required: ['orderId']
    }
  },
  {
    name: 'get_account_orders',
    description: 'Get orders for an account',
    inputSchema: {
      type: 'object',
      properties: {
        accountId: { type: 'string', description: 'Account ID' },
        page: { type: 'number', description: 'Page number (default: 1)' },
        limit: { type: 'number', description: 'Results per page (default: 10)' }
      },
      required: ['accountId']
    }
  },
  {
    name: 'cancel_all_account_orders',
    description: 'Cancel all orders for an account',
    inputSchema: {
      type: 'object',
      properties: {
        accountId: { type: 'string', description: 'Account ID' }
      },
      required: ['accountId']
    }
  },
  {
    name: 'get_today_filled_orders',
    description: 'Get all orders filled today',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number', description: 'Page number (default: 1)' },
        limit: { type: 'number', description: 'Results per page (default: 10)' }
      }
    }
  },

  // === MARKET DATA ===
  {
    name: 'get_quote',
    description: 'Get real-time quote for a symbol',
    inputSchema: {
      type: 'object',
      properties: {
        symbol: { type: 'string', description: 'Stock symbol' }
      },
      required: ['symbol']
    }
  },
  {
    name: 'get_batch_quotes',
    description: 'Get real-time quotes for multiple symbols',
    inputSchema: {
      type: 'object',
      properties: {
        symbols: { 
          type: 'array',
          items: { type: 'string' },
          description: 'Array of stock symbols'
        }
      },
      required: ['symbols']
    }
  },
  {
    name: 'get_market_hours',
    description: 'Get market hours for an exchange',
    inputSchema: {
      type: 'object',
      properties: {
        exchange: { type: 'string', description: 'Exchange name (optional)' }
      }
    }
  },
  {
    name: 'is_market_open',
    description: 'Check if market is open for a symbol',
    inputSchema: {
      type: 'object',
      properties: {
        symbol: { type: 'string', description: 'Stock symbol' }
      },
      required: ['symbol']
    }
  },

  // === ACTIVITY LOG ===
  {
    name: 'get_portfolio_activities',
    description: 'Get activity log for a portfolio',
    inputSchema: {
      type: 'object',
      properties: {
        portfolioId: { type: 'string', description: 'Portfolio ID' },
        page: { type: 'number', description: 'Page number (default: 1)' },
        limit: { type: 'number', description: 'Results per page (default: 20)' },
        category: { type: 'string', description: 'Filter by category (optional)' }
      },
      required: ['portfolioId']
    }
  },
  {
    name: 'get_day_trades',
    description: 'Get day trade activity for a portfolio',
    inputSchema: {
      type: 'object',
      properties: {
        portfolioId: { type: 'string', description: 'Portfolio ID' },
        page: { type: 'number', description: 'Page number (default: 1)' },
        limit: { type: 'number', description: 'Results per page (default: 50)' }
      },
      required: ['portfolioId']
    }
  },

  // === MARGIN TRADING ===
  {
    name: 'upgrade_to_margin',
    description: 'Upgrade portfolio to margin account',
    inputSchema: {
      type: 'object',
      properties: {
        portfolioId: { type: 'string', description: 'Portfolio ID' },
        marginAgreement: { type: 'boolean', description: 'User agrees to margin terms' }
      },
      required: ['portfolioId', 'marginAgreement']
    }
  }
];

// Register tools with the server
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (!args) {
    throw new Error('No arguments provided');
  }

  try {
    let response;
    
    switch (name) {
      // === ACCOUNT MANAGEMENT ===
      case 'get_account':
        response = await api.get(`/accounts/${args.accountId}`);
        break;
        
      case 'update_account':
        response = await api.put(`/accounts/${args.accountId}`, {
          name: args.name
        });
        break;
        
      case 'freeze_account':
        response = await api.put(`/accounts/${args.accountId}/freeze`);
        break;

      // === PORTFOLIO OPERATIONS ===
      case 'create_portfolio':
        response = await api.post('/accounts/portfolios', args);
        break;
        
      case 'get_portfolio':
        response = await api.get(`/accounts/portfolios/${args.portfolioId}`);
        break;
        
      case 'get_account_portfolios':
        response = await api.get(`/accounts/${args.accountId}/portfolios`);
        break;
        
      case 'reset_portfolio':
        response = await api.post(`/accounts/portfolios/${args.portfolioId}/reset`);
        break;

      // === POSITIONS ===
      case 'get_portfolio_equities':
        response = await api.get(`/accounts/portfolios/${args.portfolioId}/equities`);
        break;
        
      case 'get_portfolio_options':
        response = await api.get(`/accounts/portfolios/${args.portfolioId}/options`);
        break;

      // === TRADING ===
      case 'create_order':
        response = await api.post('/orders', {
          ...args,
          assetClass: args.assetClass || 'EQUITY',
          session: args.session || 'REGULAR',
          timeInForce: args.timeInForce || 'DAY'
        });
        break;
        
      case 'create_batch_orders':
        response = await api.post('/orders/batch', args.orders);
        break;
        
      case 'get_order':
        response = await api.get(`/orders/${args.orderId}`);
        break;
        
      case 'cancel_order':
        response = await api.put(`/orders/${args.orderId}/cancel`);
        break;
        
      case 'get_account_orders':
        response = await api.get(`/orders/account/${args.accountId}`, {
          params: { 
            page: args.page || 1, 
            limit: args.limit || 10 
          }
        });
        break;
        
      case 'cancel_all_account_orders':
        response = await api.delete(`/orders/account/${args.accountId}`);
        break;
        
      case 'get_today_filled_orders':
        response = await api.get('/orders/filled/today', {
          params: {
            page: args.page || 1,
            limit: args.limit || 10
          }
        });
        break;

      // === MARKET DATA ===
      case 'get_quote':
        response = await api.get(`/market-data/quote/${args.symbol}`);
        break;
        
      case 'get_batch_quotes':
        response = await api.post('/market-data/quotes/batch', {
          symbols: args.symbols
        });
        break;
        
      case 'get_market_hours':
        if (args.exchange) {
          response = await api.get(`/market-data/market-hours/${args.exchange}`);
        } else {
          response = await api.get('/market-data/market-hours');
        }
        break;
        
      case 'is_market_open':
        response = await api.get(`/market-data/is-market-open/${args.symbol}`);
        break;

      // === ACTIVITY LOG ===
      case 'get_portfolio_activities':
        const params: any = {
          page: args.page || 1,
          limit: args.limit || 20
        };
        if (args.category) {
          params.category = args.category;
        }
        response = await api.get(`/activity-log/portfolio/${args.portfolioId}`, { params });
        break;
        
      case 'get_day_trades':
        response = await api.get(`/accounts/portfolios/${args.portfolioId}/day-trades`, {
          params: {
            page: args.page || 1,
            limit: args.limit || 50
          }
        });
        break;

      // === MARGIN TRADING ===
      case 'upgrade_to_margin':
        response = await api.put(`/accounts/portfolios/${args.portfolioId}/margin-upgrade`, {
          marginAgreement: args.marginAgreement
        });
        break;
        
      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2)
        }
      ]
    };
  } catch (error: any) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}\n${error.response?.data ? JSON.stringify(error.response.data) : ''}`
        }
      ],
      isError: true
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);