#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { WordPressService } from "./services/wordpress_service";
import { Post } from "./types";

// Create an MCP server
const server = new McpServer({
    name: "Wordpress Plugin",
    description: "A plugin for Wordpress",
    version: "1.0.0"
});

const WP_URL = process.env.WP_URL || "";
const WP_USERNAME = process.env.WP_USERNAME || "";
const WP_PASSWORD = process.env.WP_PASSWORD || "";

if (!WP_URL || !WP_USERNAME || !WP_PASSWORD) {
    console.error("Please set the WP_URL, WP_USERNAME and WP_PASSWORD environment variables.");
}

const wpService = new WordPressService(WP_URL, WP_USERNAME, WP_PASSWORD);

// Add an addition tool
server.tool("fetch_posts",
    {
        page: z.number().optional(),
        perPage: z.number().optional()
    },
    async ({ page, perPage }) => {
        try {
            // Fetch posts from Wordpress API
            const posts = await wpService.fetch_posts({ page, perPage });
            return {
                content: [{ type: "text", text: JSON.stringify(posts) }],
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
            return {
                content: [{ type: "text", text: "Error fetching posts" }],
            }
        }
    });


server.tool("fetch_categories", {},
    async () => {
        try {
            const categories = await wpService.fetch_categories();
            return {
                content: [{ type: "text", text: JSON.stringify(categories) }],
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            return {
                content: [{ type: "text", text: "Error fetching categories" }],
            }
        }
    });

server.tool("fetch_media", {},
    async () => {
        try {
            const media = await wpService.fetch_media();
            return {
                content: [{ type: "text", text: JSON.stringify(media) }],
            }
        } catch (error) {
            console.error("Error fetching media:", error);
            return {
                content: [{ type: "text", text: "Error fetching media" }],
            }
        }
    });

server.tool("create_post", {
    title: z.string(),
    content: z.string()
},
    async ({ title, content }) => {
        const post: Post = new Post(title, content);
        try {
            const result = await wpService.createPost(post);
            return {
                content: [{ type: "text", text: JSON.stringify(result) }],
            }
        } catch (error) {
            console.error("Error creating post:", error);
            return {
                content: [{ type: "text", text: "Error creating post" }],
            }
        }
    })

const startServer = async () => {
    try {
        console.log("Starting server...");
        const transport = new StdioServerTransport();
        await server.connect(transport);
        console.log("Server started!");
    } catch (error) {
        console.error("Error starting server:", error);
    }
}

startServer()