#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';

interface GenerateToolConfig {
  collectionId: string;
  requestId: string;
  config: {
    language: 'javascript' | 'typescript';
    agentFramework: 'openai' | 'mistral' | 'gemini' | 'anthropic' | 'langchain' | 'autogen';
  };
}

class PostmanToolsServer {
  private server: Server;
  private axiosInstance;
  private API_KEY: string;

  constructor() {
    const apiKey = process.env.POSTMAN_API_KEY;
    if (!apiKey) {
      throw new Error('POSTMAN_API_KEY environment variable is required');
    }
    this.API_KEY = apiKey;

    this.server = new Server(
      {
        name: 'postman-tools-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.axiosInstance = axios.create({
      baseURL: 'https://api.getpostman.com',
      headers: {
        'X-API-Key': this.API_KEY,
        'Content-Type': 'application/json',
      },
    });

    this.setupToolHandlers();
    
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'generate_ai_tool',
          description: 'Generate code for an AI agent tool using a Postman collection and request',
          inputSchema: {
            type: 'object',
            properties: {
              collectionId: {
                type: 'string',
                description: 'The Public API Network collection ID',
              },
              requestId: {
                type: 'string',
                description: 'The public request ID',
              },
              language: {
                type: 'string',
                enum: ['javascript', 'typescript'],
                description: 'Programming language to use',
              },
              agentFramework: {
                type: 'string',
                enum: ['openai', 'mistral', 'gemini', 'anthropic', 'langchain', 'autogen'],
                description: 'AI agent framework to use',
              },
            },
            required: ['collectionId', 'requestId', 'language', 'agentFramework'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      switch (request.params.name) {
        case 'generate_ai_tool':
          return this.handleGenerateTool(request.params.arguments);
        default:
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Unknown tool: ${request.params.name}`
          );
      }
    });
  }

  private async handleGenerateTool(args: any): Promise<any> {
    if (!args?.collectionId || !args?.requestId || !args?.language || !args?.agentFramework) {
      throw new McpError(
        ErrorCode.InvalidParams,
        'Missing required parameters: collectionId, requestId, language, agentFramework'
      );
    }

    try {
      const response = await this.axiosInstance.post('/postbot/generations/tool', {
        collectionId: args.collectionId,
        requestId: args.requestId,
        config: {
          language: args.language,
          agentFramework: args.agentFramework,
        },
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          content: [
            {
              type: 'text',
              text: `Error generating tool: ${error.response?.data?.error || error.message}`,
            },
          ],
          isError: true,
        };
      }
      throw error;
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Postman Tools MCP server running on stdio');
  }
}

const server = new PostmanToolsServer();
server.run().catch(console.error);
