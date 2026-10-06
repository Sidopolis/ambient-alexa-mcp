/**
 * Ambient Self-Hosted Streamable HTTP Model Context Protocol (MCP) Server
 * Entry point for Alexa+ integrations and Simulated Web Experience.
 * Compliant with MCP Spec 2025-11-25+ & AWS Bedrock Runtime.
 */

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { toolDefinitions, handleToolExecution, memoryStore } from "./mcp/tools.js";
import { runAgentReasoning, getAvailableModels, BEDROCK_FALLBACK_CHAIN, defaultModelId } from "./bedrock/client.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Active Server-Sent Event (SSE) clients for Streamable HTTP transport
const sseClients = new Set();

/**
 * Broadcasts an event to all connected Streamable HTTP clients
 */
function broadcastMcpEvent(event, data) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(payload);
    } catch {
      sseClients.delete(client);
    }
  }
}

// -------------------------------------------------------------
// MCP STREAMABLE HTTP SPECIFICATION ENDPOINTS (Spec 2025-11-25+)
// -------------------------------------------------------------

/**
 * GET /sse - Streamable HTTP Event Stream
 * Establishes real-time SSE stream for session handshakes and tool executions
 */
app.get("/sse", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");

  const sessionId = `mcp-session-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  sseClients.add(res);

  // Send initial endpoint & handshake info according to MCP transport specification
  res.write(`event: endpoint\ndata: ${JSON.stringify({ endpoint: "/messages?sessionId=" + sessionId, sessionId })}\n\n`);

  broadcastMcpEvent("handshake", {
    protocolVersion: "2025-11-25",
    serverName: "Ambient-AlexaPlus-MCP",
    serverVersion: "1.0.0",
    capabilities: {
      tools: { listChanged: true },
      resources: { subscribe: true },
      prompts: { listChanged: false }
    }
  });

  req.on("close", () => {
    sseClients.delete(res);
  });
});

/**
 * POST /messages - JSON-RPC 2.0 message handler for MCP Streamable HTTP
 */
app.post("/messages", async (req, res) => {
  const { jsonrpc, id, method, params } = req.body;

  if (jsonrpc !== "2.0") {
    return res.status(400).json({ jsonrpc: "2.0", id, error: { code: -32600, message: "Invalid Request: jsonrpc must be '2.0'" } });
  }

  broadcastMcpEvent("jsonrpc_request", { method, id, params });

  try {
    switch (method) {
      case "initialize": {
        const result = {
          protocolVersion: "2025-11-25",
          capabilities: {
            tools: {},
            resources: {}
          },
          serverInfo: {
            name: "Ambient-AlexaPlus-MCP",
            version: "1.0.0"
          }
        };
        broadcastMcpEvent("jsonrpc_response", { id, result });
        return res.json({ jsonrpc: "2.0", id, result });
      }

      case "tools/list": {
        const result = { tools: toolDefinitions };
        broadcastMcpEvent("jsonrpc_response", { id, result });
        return res.json({ jsonrpc: "2.0", id, result });
      }

      case "tools/call": {
        const { name, arguments: args } = params;
        const result = await handleToolExecution(name, args);
        broadcastMcpEvent("tool_execution", { tool: name, input: args, result });
        return res.json({ jsonrpc: "2.0", id, result });
      }

      case "resources/list": {
        const result = {
          resources: [
            {
              uri: "alexa://user/profile",
              name: "User Smart Profile",
              description: "Preferences, home devices, and routine configuration",
              mimeType: "application/json"
            },
            {
              uri: "alexa://system/telemetry",
              name: "System Telemetry & Health",
              description: "Server uptime, active Streamable HTTP connections, and protocol health",
              mimeType: "application/json"
            }
          ]
        };
        broadcastMcpEvent("jsonrpc_response", { id, result });
        return res.json({ jsonrpc: "2.0", id, result });
      }

      case "resources/read": {
        const { uri } = params || {};
        if (uri === "alexa://user/profile") {
          const contents = [
            {
              uri,
              mimeType: "application/json",
              text: JSON.stringify(memoryStore, null, 2)
            }
          ];
          broadcastMcpEvent("jsonrpc_response", { id, result: { contents } });
          return res.json({ jsonrpc: "2.0", id, result: { contents } });
        } else if (uri === "alexa://system/telemetry") {
          const contents = [
            {
              uri,
              mimeType: "application/json",
              text: JSON.stringify({
                status: "healthy",
                uptimeSeconds: Math.floor(process.uptime()),
                activeSseConnections: sseClients.size,
                protocolVersion: "2025-11-25",
                transport: "Streamable HTTP"
              }, null, 2)
            }
          ];
          broadcastMcpEvent("jsonrpc_response", { id, result: { contents } });
          return res.json({ jsonrpc: "2.0", id, result: { contents } });
        }
        return res.status(404).json({
          jsonrpc: "2.0",
          id,
          error: { code: -32602, message: `Resource not found: ${uri}` }
        });
      }

      default:
        return res.status(404).json({
          jsonrpc: "2.0",
          id,
          error: { code: -32601, message: `Method not found: ${method}` }
        });
    }
  } catch (error) {
    res.status(500).json({
      jsonrpc: "2.0",
      id,
      error: { code: -32603, message: error.message }
    });
  }
});

// -------------------------------------------------------------
// ALEXA+ SIMULATOR & AGENT API ENDPOINTS
// -------------------------------------------------------------

/**
 * POST /api/agent/chat
 * High-level speech / text prompt processing using AWS Bedrock & MCP Tools
 * Supports multi-model quota fallback (Claude ➔ Nova ➔ Gemini ➔ Simulator)
 */
app.post("/api/agent/chat", async (req, res) => {
  const { prompt, preferredModel, simulateQuota } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Missing 'prompt' parameter in request body" });
  }

  try {
    broadcastMcpEvent("agent_processing_start", {
      prompt,
      preferredModel: preferredModel || "auto",
      simulateQuota: Boolean(simulateQuota),
      timestamp: new Date().toISOString()
    });

    const agentResult = await runAgentReasoning(prompt, [], { preferredModel, simulateQuota });

    if (agentResult.fallbackOccurred) {
      broadcastMcpEvent("model_fallback", {
        primaryModel: agentResult.primaryModel,
        activeModel: agentResult.model,
        fallbackChain: agentResult.fallbackChain,
        quotaStatus: agentResult.quotaStatus
      });
    }

    broadcastMcpEvent("agent_processing_complete", {
      prompt,
      model: agentResult.model,
      fallbackOccurred: agentResult.fallbackOccurred,
      toolCalled: agentResult.toolCalled,
      latencyMs: agentResult.latencyMs
    });

    res.json({
      success: true,
      data: agentResult,
      currentState: memoryStore
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/models - Returns list of available models and fallback configuration
 */
app.get("/api/models", (req, res) => {
  res.json({
    models: getAvailableModels(),
    defaultModel: defaultModelId,
    fallbackChain: BEDROCK_FALLBACK_CHAIN
  });
});

/**
 * GET /api/state - Live state inspection endpoint
 */
app.get("/api/state", (req, res) => {
  res.json({
    smartDevices: memoryStore.smartDevices,
    preferences: memoryStore.preferences,
    activeRoutines: memoryStore.activeRoutines,
    todoList: memoryStore.todoList,
    toolsAvailable: toolDefinitions.length
  });
});

/**
 * POST /api/device/toggle - Direct interactive trigger for UI cards
 */
app.post("/api/device/toggle", async (req, res) => {
  const { deviceId, action, value } = req.body;
  const result = await handleToolExecution("smart_home_control", { deviceId, action, value });
  broadcastMcpEvent("tool_execution", { tool: "smart_home_control", input: { deviceId, action, value }, result });
  res.json({ success: true, result, currentDevices: memoryStore.smartDevices });
});

// -------------------------------------------------------------
// STATIC CLIENT HOSTING (Zero Extra Dependencies Needed)
// -------------------------------------------------------------
const clientPath = path.join(__dirname, "../../client");
app.use(express.static(clientPath, {
  etag: false,
  maxAge: 0,
  setHeaders: (res) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
  }
}));

app.get("*", (req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n========================================================`);
  console.log(`🚀 Ambient Self-Hosted MCP Server & Alexa+ Simulator Running!`);
  console.log(`🌐 Web Experience URL:       http://localhost:${PORT}`);
  console.log(`📡 Streamable HTTP (SSE):    http://localhost:${PORT}/sse`);
  console.log(`💬 MCP JSON-RPC Messages:    http://localhost:${PORT}/messages`);
  console.log(`[Bedrock] Integration:       Configured (Spec 2025-11-25+)`);
  console.log(`========================================================\n`);
});

export default app;
