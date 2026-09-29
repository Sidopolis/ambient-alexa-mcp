# Developer Friction Log — Amazon Developer Hackathon 2026
**Project:** Aura+ (Alexa+ Model Context Protocol & AWS Bedrock Agent)  
**Track:** Alexa+ (Primary Track) | **Mini-Challenges:** AWS Builder & Open Source  
**Author:** Sidhant Patro  

---

### Friction Entry #1: MCP Spec (2025-11-25) Streamable HTTP Session Binding
* **Task Attempted:** Implementing self-hosted Streamable HTTP transport conforming to the late 2025 MCP specification.
* **Steps Taken:**
  1. Configured an SSE endpoint (`/sse`) to serve Server-Sent Events for client streaming.
  2. Attempted to send JSON-RPC 2.0 messages from the client to `/messages` without explicit session header persistence.
* **Expected Result:** The server would seamlessly associate bidirectional SSE streams and POST requests across tab reconnects.
* **Actual Result:** Standard HTTP POST endpoints lacked automatic session association without query parameter binding (`/messages?sessionId=...`), leading to orphaned SSE listeners on page reloads.
* **Severity Rating:** **Medium**
* **Workaround Used:** Generated unique cryptographically random session IDs upon SSE handshake (`event: endpoint`), transmitted in the initial handshake payload, and required clients to append `?sessionId=` to all subsequent `/messages` JSON-RPC calls.
* **Actionable Suggestion for Amazon DevRel Team:** Provide a standard reference Express/FastAPI middleware for Streamable HTTP in the Amazon Devices Builder Tools repository that handles automatic session cookie binding and reconnection buffering out-of-the-box.

---

### Friction Entry #2: AWS Bedrock Runtime Tool-Calling Schema Normalization
* **Task Attempted:** Passing Model Context Protocol (MCP) tool schemas directly to `@aws-sdk/client-bedrock-runtime` for Anthropic Claude 3.5 Sonnet / Amazon Nova.
* **Steps Taken:**
  1. Defined MCP tools with standard JSON Schema format (`inputSchema: { type: "object", properties: ... }`).
  2. Passed tool definitions directly into the Bedrock `InvokeModelCommand` payload.
* **Expected Result:** Direct compatibility between MCP `inputSchema` and Bedrock's `input_schema` parameter.
* **Actual Result:** Claude on Bedrock requires `input_schema` (snake_case) with specific required field constraints, whereas MCP TypeScript SDK uses `inputSchema` (camelCase). Uncaught schema mismatches caused HTTP 400 Bad Request from Bedrock Runtime.
* **Severity Rating:** **High**
* **Workaround Used:** Built a normalization adapter in `server/src/bedrock/client.js` that maps MCP tool definitions to Bedrock-compliant schemas prior to dispatch.
* **Actionable Suggestion for Amazon DevRel Team:** Publish an official Amazon Bedrock ➔ MCP converter package (`@aws/bedrock-mcp-adapter`) to eliminate manual boilerplate when connecting Bedrock agents to self-hosted MCP servers.

---

### Friction Entry #3: Real-Time Interactive Card State Synchronization (MCP Apps)
* **Task Attempted:** Rendering interactive UI components (MCP Apps spec) on the simulated Alexa+ screen where user button clicks update smart home state.
* **Steps Taken:**
  1. Rendered dynamic device cards (e.g. Living Room Lights, Thermostat).
  2. Dispatched direct toggle actions from cards back to the backend.
* **Expected Result:** Instant two-way synchronization between client card buttons and MCP memory store.
* **Actual Result:** When tools execute asynchronously via Bedrock, the frontend required a mechanism to stream state updates without full-page reloads.
* **Severity Rating:** **Low**
* **Workaround Used:** Implemented an event-driven architecture using the active SSE connection (`event: tool_execution`), triggering instant reactive UI card re-renders whenever the backend executes a tool.
* **Actionable Suggestion for Amazon DevRel Team:** Standardize a client-side SDK for Alexa+ web experiences that auto-subscribes to tool execution events and updates UI card components natively.

---

### Summary of Developer Experience (DX)
* **What Worked Well:** The open-standard nature of Model Context Protocol (MCP) allows tremendous flexibility. Integrating AWS Bedrock runtime with Claude 3.5 Sonnet enables nuanced multi-step planning and tool calling.
* **What Needs Work:** More beginner-friendly starter templates for Streamable HTTP servers and standard documentation on bridging Bedrock LLMs to MCP tool schemas.
* **Would I Build With These Again?:** **Yes.** The combination of MCP and Alexa+ represents the future of proactive, agentic ambient computing.
