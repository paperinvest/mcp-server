# Paper MCP Server

Official Model Context Protocol (MCP) server for Paper's trading platform. This enables AI assistants like Claude to interact with Paper's API using natural language.

## Installation

This package is automatically installed when you configure Claude Desktop. No manual installation is required.

## Configuration

Add this to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "paper-invest": {
      "command": "npx",
      "args": ["@paperinvest/mcp-server"],
      "env": {
        "PAPER_INVEST_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

## Getting Started

1. Sign up at [app.paperinvest.io](https://app.paperinvest.io)
2. Generate an API key from your account settings
3. Add the configuration above with your API key
4. Restart Claude Desktop

## Available Tools

The MCP server provides access to:

- **Account Management**: Create and manage trading accounts
- **Portfolio Operations**: View and manage portfolios
- **Trading**: Place, modify, and cancel orders
- **Market Data**: Get real-time quotes and market information
- **Positions**: View current holdings and P&L
- **Activity Tracking**: Monitor trading activity and day trades

## Example Usage

Once configured, you can ask Claude:

- "Show me my current positions"
- "Get a quote for AAPL"
- "Place a market order for 100 shares of TSLA"
- "What's my portfolio value?"
- "Cancel all my open orders"

## Documentation

Full documentation available at [docs.paperinvest.io](https://docs.paperinvest.io)

## License

MIT © Paper Invest, Inc.

## Support

For support, visit [paperinvest.io](https://paperinvest.io) or email support@paperinvest.io