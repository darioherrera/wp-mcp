#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { WordPressService } from "./services/wordpress_service";
import { Category, CategoryInput, Post, PostInput } from "./types";


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
server.tool("fetch_posts", "Fetch posts from wordpress blog",
    {
        page: z.number().optional().describe("Page number to fetch"),
        perPage: z.number().optional().describe("Number of posts per page"),
    },
    async ({ page, perPage }) => {
        try {
            // Fetch posts from Wordpress API
            const posts = await wpService.fetch_posts({ page, perPage });
            return {
                content: posts.map((p: any) => ({
                    type: "text",
                    text: JSON.stringify({
                        title: p.title,
                        excerpt: p.excerpt,
                        content: p.content,
                        slug: p.slug,
                        date: p.date
                    })
                })),
                isError: false
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
            return {
                content: [{ type: "text", text: "Error fetching posts" }],
                isError: true //  
            }
        }
    });


server.tool("fetch_categories", "Fetches all categories from a wordpress blog", {},
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

server.tool("fetch_media", "Fetches all media from wodpress blog", {},
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

function buildPostInput(input: PostInput): Required<PostInput> {
    return {
        title: input.title,
        content: input.content,
        slug: input.slug ?? "",
        categories: input.categories ?? [],
        tags: input.tags ?? [],
        status: input.status ?? "draft"
    };
}

server.tool("create_post", "Creates a new posts in wordpress", {
    title: z.string().describe("Title of the post"),
    content: z.string().describe("Content of the post"),
    categories: z.array(z.number()).optional().describe("Array of category IDs"),
    tags: z.array(z.number()).optional().describe("Array of tag IDs"),
    slug: z.string().optional().describe("Slug of the post"),
    status: z.enum(["publish", "draft", "pending"]).optional().describe("Status of the post"),
},
    async (params) => {

        try {
            const input = buildPostInput(params);
            const result = await wpService.createPost(input);
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

function buildCategoryInput(input: CategoryInput): Required<CategoryInput> {
    return {
        name: input.name,
        description: input.description ?? "",
        slug: input.slug ?? "",
        parent: input.parent ?? 0
    };
}

server.tool("create_category", "Creates a category in wordpress", {
    name: z.string(),
    description: z.string(),
    slug: z.string().optional(),
    parent: z.number().optional(),
},
    async (params) => {
        try {
            const input = buildCategoryInput(params)
            const result = await wpService.createCategory(input);
            return {
                content: [{ type: "text", text: JSON.stringify(result) }],
            }
        } catch (error) {
            console.error("Error creating category:", error);
            return {
                content: [{ type: "text", text: "Error creating category" }],
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