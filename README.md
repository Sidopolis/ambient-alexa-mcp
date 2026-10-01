# Aura+

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Hackathon: Amazon Developer 2026](https://img.shields.io/badge/Amazon%20Developer%20Hackathon-Alexa%2B%20Track-orange.svg)](https://amazonappdev2026.devpost.com/)
[![MCP Spec](https://img.shields.io/badge/MCP%20Spec-2025--11--25%20Streamable%20HTTP-brightgreen.svg)](https://modelcontextprotocol.io/)
[![AWS Bedrock](https://img.shields.io/badge/AWS-Bedrock%20Runtime-FF9900.svg)](https://aws.amazon.com/bedrock/)

> **Build, Ship, Shape: Amazon Developer Hackathon 2026**
> Primary Track: **Alexa+** (Self-Hosted MCP Server & Simulated Web Experience)
> Mini-Challenges: **AWS Builder** & **Open Source**

---

## What is Aura+?

Aura+ is a self-hosted MCP server and simulated Alexa+ agent that goes beyond traditional single-turn voice skills. Instead of "ask a question, get an answer," Aura+ can plan and execute multi-step tasks across your smart home, remember your preferences across sessions, and render interactive controls directly on screen.

It runs on the open **Streamable HTTP** transport (MCP Spec 2025-11-25+) and uses **AWS Bedrock** (Claude 3.5 Sonnet) for reasoning and tool selection. When Bedrock credentials aren't available, it falls back to a built-in intent engine so judges can test everything locally without AWS access.

---

## Architecture

```mermaid
graph TD
    User(["User Voice / Text Input"]) --> Client["Alexa+ Interface"]

    subgraph Transport["Streamable HTTP Transport"]
        Client <-->|"SSE Stream /sse"| MCP["MCP Server - Express/Node.js"]
        Client <-->|"JSON-RPC 2.0 /messages"| MCP
    end

    subgraph AWS["AWS Cloud"]
        MCP <-->|"Bedrock Runtime SDK"| Bedrock["Amazon Bedrock - Claude 3.5 Sonnet"]
    end

    subgraph Tools["MCP Tools"]
        MCP --> T1["smart_home_control"]
        MCP --> T2["execute_multi_step_routine"]
        MCP --> T3["manage_context_memory"]
        MCP --> T4["render_interactive_card"]
    end
```

---

## Key Features

**MCP Server**
- Full Streamable HTTP implementation with SSE (`/sse`) and JSON-RPC 2.0 (`/messages`)
- 4 registered tools: device control, multi-step routines, persistent memory, and visual card rendering
- MCP Resources for user profile (`alexa://user/profile`) and system telemetry (`alexa://system/telemetry`)

**AWS Bedrock Integration**
- Uses `@aws-sdk/client-bedrock-runtime` for autonomous planning and tool calling
- Built-in offline fallback so everything works without AWS credentials

**Web Interface (4 Views)**
- **Orchestrator Console** — command bar with voice input, one-click workflow chips, hierarchical agent plan tree, and expandable tool call disclosures showing JSON-RPC arguments and results
- **Execution Trace** — waterfall visualization of each span (model reasoning, tool execution, SSE broadcast) with a calibrated 0-480ms ruler
- **Power Grid & Telemetry** — interactive solar/load area chart with crosshair scrubber, Tesla Powerwall 3 battery tank, and multi-zone climate controller
- **Device Topology** — digital twin matrix showing all connected devices with live state and toggle controls

**Audio & Voice**
- Web Audio API chimes for wake and success feedback
- Browser SpeechRecognition for voice input
- SpeechSynthesis TTS for Alexa-style spoken responses

---

## Quick Start

**Prerequisites:** Node.js v18+, npm v9+

```bash
git clone https://github.com/Sidopolis/ambient-alexa-mcp.git
cd ambient-alexa-mcp
npm start
```

Open `http://localhost:3000` in your browser.

Run the test suite:
```bash
npm test
```
This runs 11 tests covering tool schema validation, execution engine, and intent parsing.

---

## AWS Bedrock Setup (Optional)

Create `server/.env`:
```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20240620-v1:0
PORT=3000
```
Restart the server. Aura+ detects the credentials and routes queries through Bedrock automatically.

Without this file, the built-in intent engine handles all requests locally.

---

## MCP Tools & Resources

### Tools (`tools/list` & `tools/call`)
| Tool | Parameters | What it does |
| :--- | :--- | :--- |
| `smart_home_control` | `deviceId`, `action`, `value` | Controls lights, thermostats, locks, speakers |
| `execute_multi_step_routine` | `routineName`, `steps[]` | Runs sequential multi-device routines |
| `manage_context_memory` | `operation`, `key`, `value` | Persists user preferences across sessions |
| `render_interactive_card` | `cardType`, `title`, `details` | Renders UI cards on the visual surface |

### Resources (`resources/list` & `resources/read`)
| URI | Type | Content |
| :--- | :--- | :--- |
| `alexa://user/profile` | `application/json` | Device topology, routines, and todo list |
| `alexa://system/telemetry` | `application/json` | Uptime, SSE connections, protocol health |

---

## Demo Video Script (3 Minutes)

| Time | What to show |
| :--- | :--- |
| 0:00 - 0:35 | The problem with single-turn voice skills. How Aura+ uses Streamable HTTP MCP + Bedrock to plan and execute autonomously. |
| 0:35 - 1:15 | Click "Activate Deep Focus routine" in the Orchestrator Console. Show the voice waveform, chime, agent plan tree, and tool call disclosures. |
| 1:15 - 1:50 | Switch to **Execution Trace**. Walk through the waterfall spans and timing ruler. |
| 1:50 - 2:25 | Switch to **Power Grid & Telemetry**. Scrub the solar chart, toggle Powerwall modes. Open **Device Topology** and toggle a device. |
| 2:25 - 3:00 | Wrap up with MIT license, Bedrock integration, and the [FRICTION_LOG.md](FRICTION_LOG.md) for the 10% judging bonus. |

---

## Friction Log

See [FRICTION_LOG.md](FRICTION_LOG.md) for documented issues with Streamable HTTP session binding, Bedrock schema normalization, and real-time card state sync. This qualifies for the **10% judging bonus**.

---

## License

[MIT](LICENSE)
