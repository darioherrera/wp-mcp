# WordPress MCP Server

**A Node.js server that connects to your WordPress site and exposes functionality via the Model Context Protocol (MCP).**

## Table of Contents

- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Available Tools (Endpoints)](#available-tools-endpoints)
  - [1. fetch_posts](#1-fetch_posts)
  - [2. fetch_categories](#2-fetch_categories)
  - [3. fetch_media](#3-fetch_media)
  - [4. create_post](#4-create_post)
  - [5. create_category](#5-create_category)
- [Error Handling](#error-handling)
- [Contributing](#contributing)
- [License](#license)

---

## Introduction

This project showcases how to build a **Model Context Protocol** (MCP) server that interacts with a WordPress website. It leverages:

The server listens for incoming requests through STDIO transport, executes the requested **tools** (endpoints), and returns results in JSON format.

---

## Installation

1. **Clone this repository** (or copy the relevant files into your own project):

   ```bash
   git clone https://github.com/yourorg/wordpress-mcp-server.git
   cd wordpress-mcp-server
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

   This will install:
   - `@modelcontextprotocol/sdk`
   - `zod`
   - any other dependencies defined in the `package.json`.

---

## Usage

1. **Set Environment Variables**:

   - **WP_URL** – The URL of your WordPress site (e.g., `https://example.com/wp-json` or `https://example.com` depending on your setup).
   - **WP_USERNAME** – The WordPress username.
   - **WP_PASSWORD** – The corresponding password or application password.

   Example:

   ```bash
   export WP_URL="https://your-wordpress.com"
   export WP_USERNAME="admin"
   export WP_PASSWORD="admin_password"
   ```

2. **Run the Server**:

   ```bash
   npm start
   ```
   or
   ```bash
   node index.js
   ```
   (Depending on how you have set up your entry point in `package.json`.)

   You should see console output indicating that the server has started.  
   ```plaintext
   Starting server...
   Server started!
   ```

3. **Connect to the MCP Server**:

   - The server uses the **StdIOServerTransport** by default. Typically, the MCP orchestrator (or any MCP-compatible client) will handle communication via STDIO. 
   - Refer to the [Model Context Protocol documentation](https://github.com/modelcontextprotocol/typescript-sdk) for instructions on how to link this server with your MCP client or orchestrator.

---

## Configuration

Aside from the environment variables, you can fine-tune the following aspects in the code (`index.js` or `server.js`):

- **Server Name and Description**: You can modify the parameters passed to the `McpServer` constructor:
  ```js
  const server = new McpServer({
      name: "Wordpress Plugin",
      description: "A plugin for Wordpress",
      version: "1.0.0"
  });
  ```
- **Tool Names and Descriptions**: Each “tool” (endpoint) includes a name, description, and input schema defined with `zod`.
- **Default Values** (e.g., post status, default pagination, etc.) in the `buildPostInput` / `buildCategoryInput` helper functions.

---

## Available Tools (Endpoints)

Below are the **tools** exposed by this MCP server. They can be called via the MCP client, orchestrator, or any code that interacts with the MCP over STDIO.

### 1. `fetch_posts`

**Name**: `fetch_posts`  
**Description**: Fetch posts from a WordPress blog.

- **Parameters**:
  - `page` (number, optional) – The page number to retrieve.
  - `perPage` (number, optional) – The number of posts per page.

**Returns**  
A JSON list of posts with their title, excerpt, content, slug, and date.

### 2. `fetch_categories`

**Name**: `fetch_categories`  
**Description**: Fetches all categories from the WordPress blog.

- **Parameters**: None
- **Returns**  
  A JSON list of categories with their corresponding information (ID, name, slug, etc.).

### 3. `fetch_media`

**Name**: `fetch_media`  
**Description**: Fetches all media items from the WordPress site.

- **Parameters**: None
- **Returns**  
  A JSON list of media items with relevant information (e.g., title, source URL, etc.).

### 4. `create_post`

**Name**: `create_post`  
**Description**: Creates a new post in WordPress.

- **Parameters**:
  - `title` (string) – Title of the post.
  - `content` (string) – Content/body of the post.
  - `categories` (array of numbers, optional) – Array of WordPress category IDs.
  - `tags` (array of numbers, optional) – Array of WordPress tag IDs.
  - `slug` (string, optional) – Custom slug for the post.
  - `status` (enum, optional) – Post status (`publish`, `draft`, or `pending`). Defaults to `draft`.

- **Returns**  
  A JSON object containing information about the newly created post (e.g., ID, link, status, etc.).

### 5. `create_category`

**Name**: `create_category`  
**Description**: Creates a category in WordPress.

- **Parameters**:
  - `name` (string) – Name of the new category.
  - `description` (string) – Description of the category.
  - `slug` (string, optional) – Custom slug for the category.
  - `parent` (number, optional) – Parent category ID.

- **Returns**  
  A JSON object containing information about the newly created category.

---

## Error Handling

Each tool wraps the WordPressService calls in a `try/catch` block. In case of an error:
- The code logs the error to the console.
- Responds with a JSON content object containing `"Error <action>..."`.
- Sets `isError` to `true` when relevant so the client/orchestrator can detect and handle errors accordingly.

Example error response:
```json
{
  "content": [
    {
      "type": "text",
      "text": "Error creating post"
    }
  ],
  "isError": true
}
```

---

## Contributing

1. **Fork** this repository.
2. **Create** a new branch with your feature or bug fix.
3. **Commit** your changes, including tests (if applicable).
4. **Open** a Pull Request describing your modifications.

All contributions are welcome! Please ensure your changes align with the [Model Context Protocol TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) best practices.

---