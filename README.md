# Domain Availability Checker MCP Server

This MCP (Model Context Protocol) server provides tools for checking domain availability using DNS over HTTPS. It runs on Cloudflare Workers at [domainmcp.dev](https://domainmcp.dev). 

## Get Started

### Quick Deploy

1. Clone this repository:
```bash
git clone https://github.com/yourusername/domainmcp.git
cd domainmcp
```

2. Install dependencies:
```bash
npm install
```

3. Deploy to Cloudflare Workers:
```bash
npm run deploy
```

The MCP server will be available at:
- Production: `https://domainmcp.dev/sse`
- Development: `http://localhost:8787/sse`

## Available Tools

This MCP server provides two tools for checking domain availability:

### 1. `check_domain`
Checks the availability of a single domain by querying DNS over HTTPS.

**Parameters:**
- `domain` (string): The domain name to check (e.g., "example.com")

**Returns:**
- Domain status (REGISTERED or AVAILABLE)
- DNS records information (if registered)
- Availability note

### 2. `check_domains_bulk`
Checks the availability of multiple domains in a single request.

**Parameters:**
- `domains` (array of strings): Array of domain names to check

**Returns:**
- Status for each domain (REGISTERED, AVAILABLE, or error)

## How It Works

The server uses Cloudflare's DNS over HTTPS service to check domain availability:
- **Status 0 (NOERROR)**: Domain exists and is registered
- **Status 3 (NXDOMAIN)**: Domain does not exist in DNS (potentially available)

**Note:** DNS non-existence doesn't guarantee a domain is available for registration. Always verify with a domain registrar before attempting to register. 

## Connect to Cloudflare AI Playground

You can connect to your MCP server from the Cloudflare AI Playground:

1. Go to https://playground.ai.cloudflare.com/
2. Enter the MCP server URL: `https://domainmcp.dev/sse`
3. You can now use the domain checking tools directly from the playground!

## Connect Claude Desktop to your MCP server

You can also connect to your remote MCP server from local MCP clients, by using the [mcp-remote proxy](https://www.npmjs.com/package/mcp-remote). 

To connect to your MCP server from Claude Desktop, follow [Anthropic's Quickstart](https://modelcontextprotocol.io/quickstart/user) and within Claude Desktop go to Settings > Developer > Edit Config.

Update with this configuration:

```json
{
  "mcpServers": {
    "domain-checker": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://domainmcp.dev/sse"
      ]
    }
  }
}
```

For local development, use `http://localhost:8787/sse` instead.

Restart Claude and you should see the tools become available. 
