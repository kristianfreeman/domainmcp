import { Hono } from "hono";
import { DomainCheckerMCP } from "./mcp-agent";
import { landingPageHTML } from "./landing-page";

const app = new Hono<{ Bindings: Env }>();

// Landing page
app.get("/", (c) => {
	return c.html(landingPageHTML);
});

// MCP SSE endpoint
app.get("/sse", (c) => {
	return DomainCheckerMCP.serveSSE("/sse").fetch(c.req.raw, c.env, c.executionCtx);
});

app.post("/sse/message", (c) => {
	return DomainCheckerMCP.serveSSE("/sse").fetch(c.req.raw, c.env, c.executionCtx);
});

// MCP standard endpoint
app.all("/mcp", (c) => {
	return DomainCheckerMCP.serve("/mcp").fetch(c.req.raw, c.env, c.executionCtx);
});

// Export the Durable Object for Cloudflare Workers
export { DomainCheckerMCP };
export default app;