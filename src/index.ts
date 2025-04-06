import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const MEIGEN_API_BASE = "https://meigen.doodlenote.net/api/json.php";

// Create server instance
const server = new McpServer({
    name: "meigen-mcp",
    version: "1.0.0",
    capabilities: {
        resources: {},
        tools: {},
    },
});

// Register meigen tools
server.tool(
    "get-meigen",
    "Get meigen",
    { count: z.number().min(1).max(10).default(1).describe("Number of meigen to get") },
    async ({ count }) => {
        const response = await fetch(`${MEIGEN_API_BASE}?c=${count}`);
        const meigenData = await response.json();

        if (!meigenData) {
            return {
                content: [
                    {
                        type: "text",
                        text: "Failed to retrieve meigen data",
                    },
                ],
            };
        }

        return {
            content: [
                {
                    type: "text",
                    // autherは、apiがtypoしてるので、しょうがなくそのまま
                    text: meigenData.meigen + " by" + meigenData.auther,
                },
            ],
        };
    },
);

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Meigen MCP Server running on stdio");
}

main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});