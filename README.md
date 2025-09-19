# Paper MCP Server (@paperinvest/mcp-server)

![npm version](https://img.shields.io/npm/v/%40paperinvest%2Fmcp-server.svg)
![npm downloads](https://img.shields.io/npm/dm/%40paperinvest%2Fmcp-server.svg)
![license](https://img.shields.io/npm/l/%40paperinvest%2Fmcp-server.svg)

Official Model Context Protocol (MCP) server for Paper's trading platform. Lets AI coding assistants (Cursor, Claude, etc.) interact with the Paper Trading API to fetch quotes, place paper orders, and inspect portfolios.

<a href="https://glama.ai/mcp/servers/@paperinvest/mcp-server">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@paperinvest/mcp-server/badge" alt="Paper Server MCP server" />
</a>

## Install

```bash
# Global install (recommended for CLI usage)
npm i -g @paperinvest/mcp-server

# Or run with npx
npx @paperinvest/mcp-server --help
```

Node.js 16+ recommended.

## Configure
Set your Paper API credentials via environment variables (shell or .env).

```bash
export PAPER_API_KEY=your_api_key
# Optional override
export PAPER_API_BASE_URL=https://api.paperinvest.io
```

## IDE Integrations

### Cursor
File: `~/.cursor/mcp.json`
```json
{
  "mcpServers": {
    "paper": {
      "command": "paper-mcp-server",
      "env": {
        "PAPER_API_KEY": "your_api_key"
      }
    }
  }
}
```

### Claude Desktop
macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`

Windows: `%APPDATA%\Claude\claude_desktop_config.json`
```json
{
  "mcpServers": {
    "paper": {
      "command": "paper-mcp-server",
      "env": {
        "PAPER_API_KEY": "your_api_key"
      }
    }
  }
}
```

## Tools Reference

- `paper.quote(symbol)` — Get real-time NBBO quote for a symbol
- `paper.quotesBatch(symbols[])` — Get quotes for multiple symbols in one request
- `paper.order({ ... })` — Place a simulated order (market/limit/stop, etc.)
- `paper.portfolio(id)` — Retrieve portfolio positions and P&L

See more tools and examples in the repository and on the MCP landing: https://paperinvest.io/mcp

## Examples

Configs and demo scripts are in `examples/`:

- `examples/.cursor/mcp.json` — Cursor integration
- `examples/claude/claude_desktop_config.json` — Claude integration
- `examples/scripts/get-quote.sh` — Example prompt to fetch a quote
- `examples/scripts/place-order.sh` — Example prompt to place an order

## Getting Started

1. Sign up at [app.paperinvest.io](https://app.paperinvest.io)
2. Generate an API key from your account settings
3. Add the configuration above with your API key
4. Restart Claude Desktop or Cursor

## Troubleshooting

- Ensure `paper-mcp-server` is in your PATH (`npm prefix -g` may help).
- Verify `PAPER_API_KEY` is set in the same environment as your client.
- Restart Cursor/Claude after changing config.
- Check connectivity to `https://api.paperinvest.io`.

## Links

- NPM: https://www.npmjs.com/package/@paperinvest/mcp-server
- GitHub: https://github.com/paperinvest/mcp-server
- MCP Landing: https://paperinvest.io/mcp
- API Docs: https://docs.paperinvest.io

## Support

For support, visit [paperinvest.io](https://paperinvest.io) or email support@paperinvest.io

## License

MIT © Paper Invest, Inc.