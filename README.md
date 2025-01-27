# Postman Tool Generation MCP Server

An MCP server that generates AI agent tools from Postman collections and requests. This server integrates with the Postman API to convert API endpoints into type-safe code that can be used with various AI frameworks.

## Features

- Generate TypeScript/JavaScript code from Postman collections
- Support for multiple AI frameworks (OpenAI, Mistral, Gemini, Anthropic, LangChain, AutoGen)
- Type-safe code generation
- Error handling and response validation

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
