# Postman Tool Generation MCP Server

An MCP server that generates AI agent tools from Postman collections and requests. This server integrates with the Postman API to convert API endpoints into type-safe code that can be used with various AI frameworks.

Model Context Protocol (MCP) is a [new, standardized protocol](https://modelcontextprotocol.io/introduction) for managing context between large language models (LLMs) and external systems. In this repository, we provide an installer as well as an MCP Server for [Postman Tool Generation API](https://api.getpostman.com/postbot/generations/tool).

This lets you use [Claude Desktop](https://claude.ai/download), or any MCP Client like [Cline](https://github.com/cline/cline), to use natural language to accomplish things on your Postman account, e.g.:

* `Create an AI tool for:
collectionID: 12345-abcde
requestID: 67890-fghij
typescript
openai`

## Features

- Generate TypeScript/JavaScript code from Postman collections
- Support for multiple AI frameworks (OpenAI, Mistral, Gemini, Anthropic, LangChain, AutoGen)
- Type-safe code generation
- Error handling and response validation

## Demo

<div align="center">
  <a href="https://youtu.be/G1O9ECYRk1M" alt="Demonstrating the newly-released MCP server to explore Postman Tool Generation API">
    <img src="https://img.youtube.com/vi/G1O9ECYRk1M/maxresdefault.jpg" alt="Demonstrating the newly-released MCP server to explore Postman Tool Generation API" width="600"/>
  </a>
</div>

## Setup

1. Install dependencies:
```bash
npm install
```

2. Build the server:
```bash
npm run build
```

3. Configure the MCP settings by adding the following to your Claude settings file (`cline_mcp_settings.json`):
```json
{
  "mcpServers": {
    "postman-ai-tools": {
      "command": "node",
      "args": [
        "/path/to/postman-tool-generation-server/build/index.js"
      ],
      "env": {
        "POSTMAN_API_KEY": "your-postman-api-key"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

## Usage

The server provides a single tool called `generate_ai_tool` with the following parameters:

```typescript
{
  collectionId: string;    // The Public API Network collection ID
  requestId: string;       // The public request ID
  language: "javascript" | "typescript";  // Programming language to use
  agentFramework: "openai" | "mistral" | "gemini" | "anthropic" | "langchain" | "autogen";  // AI framework
}
```

### Example

```typescript
// Using the tool through MCP
const result = await use_mcp_tool({
  server_name: "postman-ai-tools",
  tool_name: "generate_ai_tool",
  arguments: {
    collectionId: "your-collection-id",
    requestId: "your-request-id",
    language: "typescript",
    agentFramework: "openai"
  }
});
```

### Generated Code

The tool generates type-safe code that includes:

- Type definitions for request/response
- Error handling
- API integration
- OpenAI function definitions
- Documentation and examples

## Development

1. Install dependencies:
```bash
npm install
```

2. Make changes to `src/index.ts`

3. Build the server:
```bash
npm run build
```

4. Restart the Claude app to load the updated server

## Environment Variables

- `POSTMAN_API_KEY`: Your Postman API key (required)

## Error Handling

The server includes comprehensive error handling for:
- Invalid parameters
- API failures
- JSON parsing errors
- Network issues

Error responses include detailed messages to help diagnose issues.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.