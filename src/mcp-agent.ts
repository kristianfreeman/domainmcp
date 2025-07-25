import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

interface DnsResponse {
	Status: number;
	TC: boolean;
	RD: boolean;
	RA: boolean;
	AD: boolean;
	CD: boolean;
	Question: Array<{
		name: string;
		type: number;
	}>;
	Answer?: Array<{
		name: string;
		type: number;
		TTL: number;
		data: string;
	}>;
	Authority?: Array<{
		name: string;
		type: number;
		TTL: number;
		data: string;
	}>;
}

export class DomainCheckerMCP extends McpAgent {
	server = new McpServer({
		name: "Domain Availability Checker",
		version: "1.0.0",
	});

	async init() {
		// Domain availability check tool
		this.server.tool(
			"check_domain",
			{ domain: z.string().describe("The domain name to check (e.g., example.com)") },
			async ({ domain }) => {
				try {
					// Validate domain format
					const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?(\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?)*$/;
					if (!domainRegex.test(domain)) {
						return {
							content: [{
								type: "text",
								text: `Invalid domain format: ${domain}`
							}]
						};
					}

					// Query DNS over HTTPS
					const url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=A`;
					const response = await fetch(url, {
						headers: {
							'Accept': 'application/dns-json'
						}
					});

					if (!response.ok) {
						return {
							content: [{
								type: "text",
								text: `DNS query failed: ${response.status} ${response.statusText}`
							}]
						};
					}

					const data: DnsResponse = await response.json();

					// Interpret DNS status codes
					// Status 0 (NOERROR) = Domain exists and has records
					// Status 3 (NXDOMAIN) = Domain does not exist
					if (data.Status === 0) {
						const hasRecords = data.Answer && data.Answer.length > 0;
						return {
							content: [{
								type: "text",
								text: `Domain: ${domain}\nStatus: REGISTERED\nDNS Records: ${hasRecords ? 'Yes' : 'No records found'}\n\nThe domain is registered and exists in the DNS system.`
							}]
						};
					} else if (data.Status === 3) {
						return {
							content: [{
								type: "text",
								text: `Domain: ${domain}\nStatus: AVAILABLE\n\nThe domain does not exist in the DNS system and may be available for registration.\n\nNote: This indicates DNS non-existence only. Always verify availability with a domain registrar.`
							}]
						};
					} else {
						return {
							content: [{
								type: "text",
								text: `Domain: ${domain}\nDNS Status Code: ${data.Status}\n\nUnexpected DNS response code. Please try again or check the domain manually.`
							}]
						};
					}
				} catch (error) {
					return {
						content: [{
							type: "text",
							text: `Error checking domain: ${error instanceof Error ? error.message : 'Unknown error'}`
						}]
					};
				}
			}
		);

		// Bulk domain check tool
		this.server.tool(
			"check_domains_bulk",
			{ 
				domains: z.array(z.string()).describe("Array of domain names to check")
			},
			async ({ domains }) => {
				const results: string[] = [];
				
				for (const domain of domains) {
					try {
						const url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=A`;
						const response = await fetch(url, {
							headers: {
								'Accept': 'application/dns-json'
							}
						});

						if (!response.ok) {
							results.push(`${domain}: Error - DNS query failed`);
							continue;
						}

						const data: DnsResponse = await response.json();
						
						if (data.Status === 0) {
							results.push(`${domain}: REGISTERED`);
						} else if (data.Status === 3) {
							results.push(`${domain}: AVAILABLE`);
						} else {
							results.push(`${domain}: Unknown status (${data.Status})`);
						}
					} catch (error) {
						results.push(`${domain}: Error - ${error instanceof Error ? error.message : 'Unknown error'}`);
					}
				}

				return {
					content: [{
						type: "text",
						text: `Domain Availability Check Results:\n\n${results.join('\n')}\n\nNote: AVAILABLE status indicates DNS non-existence only. Always verify with a domain registrar.`
					}]
				};
			}
		);
	}
}