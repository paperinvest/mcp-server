# PR for modelcontextprotocol/servers

## Title
Add Paper Trading Platform MCP Server

## Description
This PR adds the Paper MCP server to the community servers list. Paper is a realistic paper trading platform that simulates actual market conditions including slippage, partial fills, and broker-specific rules. The MCP integration enables AI assistants to execute trades, manage portfolios, and analyze markets through natural language.

## Changes
Add Paper to the Trading/Finance section in README.md (or create this section if it doesn't exist):

```markdown
### Trading & Finance
- **[Paper](https://github.com/paperinvest/mcp-server)** - Realistic paper trading platform with market simulation, 22 broker emulations, and professional tools for risk-free trading practice
```

## Server Details
- **npm package**: `@paperinvest/mcp-server`
- **Documentation**: https://docs.paperinvest.io/mcp-protocol
- **Company**: Paper Invest, Inc.
- **Website**: https://paperinvest.io

## Key Features
The Paper MCP server provides 23 tools across these categories:
- **Account Management**: Get account details, update settings, freeze accounts
- **Portfolio Management**: Create and manage multiple portfolios (cash, margin, IRA)
- **Trading**: Execute all order types (market, limit, stop, trailing, bracket), batch orders
- **Market Data**: Real-time quotes, market hours, trading status checks
- **Position Tracking**: Monitor equity and option positions
- **Activity Reporting**: Track trades, day trades, and portfolio activities
- **Margin Trading**: Upgrade portfolios to margin accounts

## What Makes Paper Unique
Unlike other paper trading platforms that give unrealistic instant fills at perfect prices, Paper simulates:
- Real market dynamics with NBBO matching and queue position
- Realistic slippage and market impact based on volume
- Partial fills for large orders
- Market halts, circuit breakers, and auction periods
- Accurate fee modeling (SEC, TAF, exchange fees)
- 22 different broker emulations with their exact rules and restrictions

## Installation
```json
{
  "mcpServers": {
    "paper": {
      "command": "npx",
      "args": ["@paperinvest/mcp-server"],
      "env": {
        "PAPER_INVEST_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

## Example Usage
Users can interact with Paper through natural language:
- "Buy 100 shares of Apple and set a stop loss 5% below"
- "Show me my portfolio performance today"
- "What's my day trading buying power?"
- "Cancel all my open orders"
- "Switch to Interactive Brokers rules and test my strategy"

## Getting Started
1. Sign up for free at https://app.paperinvest.io
2. Generate an API key from account settings
3. Configure the MCP server in Claude Desktop
4. Start paper trading with realistic market conditions