# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Domain Availability Checker MCP (Model Context Protocol) server that runs on Cloudflare Workers. It provides tools for checking domain availability using DNS over HTTPS.

## Development Commands

```bash
# Start development server
npm run dev
# or
npm start

# Deploy to Cloudflare Workers
npm run deploy

# Type checking
npm run type-check

# Code formatting (using Biome)
npm run format

# Linting and auto-fix
npm run lint:fix

# Generate Cloudflare types
npm run cf-typegen
```

## Architecture

This project uses the MCP (Model Context Protocol) framework on Cloudflare Workers with Durable Objects:

1. **Main Entry Point**: `src/index.ts`
   - Uses Hono framework for routing
   - Routes requests to `/` (landing page), `/sse`, `/sse/message`, and `/mcp` endpoints
   - Imports MCP agent and landing page from separate modules

2. **MCP Agent**: `src/mcp-agent.ts`
   - Contains the `DomainCheckerMCP` class that extends `McpAgent` from the "agents/mcp" package
   - Implements two MCP tools: `check_domain` and `check_domains_bulk`
   - Tools are defined in the `init()` method using `this.server.tool()`
   - Each tool uses Zod schemas for parameter validation
   - Returns content in MCP format: `{ content: [{ type: "text", text: "..." }] }`

3. **Landing Page**: `src/landing-page.ts`
   - Contains the HTML for the landing page with Tailwind CSS
   - Provides integration instructions for Claude Desktop, Claude Code, Cloudflare AI Playground, and local development
   - Uses JetBrains Mono font for developer aesthetics

4. **Cloudflare Workers Configuration**:
   - Uses Durable Objects (binding: `MCP_OBJECT`, class: `DomainCheckerMCP`)
   - Requires `nodejs_compat` compatibility flag
   - Configuration in `wrangler.jsonc`
   - Custom domain routing for domainmcp.dev

5. **Domain Checking Logic**:
   - Uses Cloudflare's DNS over HTTPS service (`https://cloudflare-dns.com/dns-query`)
   - Status 0 (NOERROR) = Domain is registered
   - Status 3 (NXDOMAIN) = Domain does not exist in DNS

## Code Style

- Uses Biome for formatting and linting
- 4 spaces indentation, 100 character line width
- TypeScript with strict mode enabled
- Follow existing patterns when adding new MCP tools

## Adding New MCP Tools

To add a new tool:
1. Define it in the `init()` method of the `DomainCheckerMCP` class in `src/mcp-agent.ts`
2. Use `this.server.tool(name, zodSchema, handler)`
3. Return responses in the format: `{ content: [{ type: "text", text: "..." }] }`
4. Handle errors gracefully and return user-friendly error messages

## Important Notes

- The project name in package.json is "remote-mcp-server-authless" but the Wrangler config uses "domainmcp"
- No authentication is required for this MCP server
- DNS checking only indicates DNS existence, not actual domain availability for registration