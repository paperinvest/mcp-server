# Paper MCP Server - PR Entry for modelcontextprotocol/servers

## Entry to Add

Add this entry to the server list in alphabetical order (after "Paddle" and before "Pagos"):

```markdown
<img height="12" width="12" src="https://app.paperinvest.io/favicon.svg" alt="Paper Logo" /> **[Paper](https://github.com/paperinvest/mcp-server)** - Realistic paper trading platform with market simulation, 22 broker emulations, and professional tools for risk-free trading practice. First trading platform with MCP integration.
```

## Full Context for PR

### Where to Add
The entry should be added in the main server list, alphabetically between:
- Paddle
- **Paper** (new entry)
- Pagos

### PR Title
```
Add Paper Trading Platform MCP Server
```

### PR Description
```markdown
## Description
This PR adds the Paper MCP server to the community servers list. Paper is a realistic paper trading platform that simulates actual market conditions and is the first trading platform with native MCP integration.

## What Paper Offers
- **Realistic Market Simulation**: NBBO matching, slippage, partial fills, and market dynamics
- **22 Broker Emulations**: Test strategies with exact broker rules and restrictions
- **Professional Tools**: Portfolio margin (SIMPLE/SPAN/TIMS), advanced order types
- **AI Trading**: Natural language trading through MCP-enabled AI assistants

## MCP Server Details
- **npm package**: `@paperinvest/mcp-server`
- **Repository**: https://github.com/paperinvest/mcp-server
- **Documentation**: https://docs.paperinvest.io/mcp-protocol
- **Company**: Paper Invest, Inc.
- **Website**: https://paperinvest.io

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

## Checklist
- [x] Server is functional and tested
- [x] Repository includes clear documentation
- [x] Entry follows alphabetical ordering
- [x] Description is concise and informative
- [x] Logo is properly sized (12x12)
```

## Notes for Submission

1. The entry uses Paper's favicon.svg as the logo
2. The description highlights Paper's unique features (realistic simulation, broker emulation, MCP integration)
3. The repository link points to https://github.com/paperinvest/mcp-server
4. The entry is kept concise while mentioning key differentiators

This entry positions Paper as a professional-grade paper trading platform with unique MCP capabilities, which should appeal to developers looking to build AI-driven trading applications.