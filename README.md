# Aura+ — Autonomous Agent & Model Context Protocol (MCP) Platform for Alexa+

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Hackathon: Amazon Developer 2026](https://img.shields.io/badge/Amazon%20Developer%20Hackathon-Alexa%2B%20Track-orange.svg)](https://amazonappdev2026.devpost.com/)
[![MCP Spec](https://img.shields.io/badge/MCP%20Spec-2025--11--25%20Streamable%20HTTP-brightgreen.svg)](https://modelcontextprotocol.io/)
[![AWS Bedrock](https://img.shields.io/badge/AWS-Bedrock%20Runtime-FF9900.svg)](https://aws.amazon.com/bedrock/)

> **Built for the Build, Ship, Shape: Amazon Developer Hackathon**  
> **Primary Track:** Alexa+ (Self-Hosted MCP Server & Simulated Web Experience)  
> **Mini-Challenges:** AWS Builder & Open Source  

---

## 🌟 Overview

**Aura+** is a self-hosted **Model Context Protocol (MCP)** server and simulated **Alexa+** agent interface built to pioneer the next generation of ambient computing. 

Rather than relying on legacy single-turn Q&A voice skills, Aura+ implements the open **Streamable HTTP transport** (Spec 2025-11-25+) paired with **Amazon Bedrock**. It empowers Alexa+ to autonomously orchestrate multi-step physical and digital tasks, maintain persistent context across sessions, and dynamically project interactive visual cards (MCP Apps spec) onto modern screens.

---

## 🏗️ Architecture

```mermaid
graph TD
    User([User Voice / Text Input]) --> Client["Simulated Alexa+ Interface<br/>(Glowing Light Ring • Audio Synthesis • MCP Cards)"]
    
    subgraph "Streamable HTTP Transport (Spec 2025-11-25)"
        Client <-->|SSE Stream: /sse| MCP["Self-Hosted MCP Server<br/>(Express • Node.js)"]
        Client <-->|JSON-RPC 2.0: /messages| MCP
    end
    
    subgraph "AWS AI Cloud (AWS Builder)"
        MCP <-->|@aws-sdk/client-bedrock-runtime| Bedrock["Amazon Bedrock<br/>(Claude 3.5 Sonnet / Nova Pro)"]
    end
    
    subgraph "Autonomous MCP Tools"
        MCP --> T1["smart_home_control<br/>(Lights, Climate, Locks, Media)"]
        MCP --> T2["execute_multi_step_routine<br/>(Autonomous Complex Workflows)"]
        MCP --> T3["manage_context_memory<br/>(Persistent Cross-Session Store)"]
        MCP --> T4["render_interactive_card<br/>(MCP Apps Spec Visual Components)"]
    end
```

---

## 🚀 Key Features

1. **Self-Hosted Streamable HTTP MCP Server:**
   - Implements MCP specification `2025-11-25+` with Server-Sent Events (`/sse`) and JSON-RPC 2.0 (`/messages`).
   - Compliant with Amazon's official Alexa+ preview integration standards.
2. **AWS Bedrock Runtime Integration:**
   - Leverages `@aws-sdk/client-bedrock-runtime` for multi-step reasoning, autonomous planning, and tool calling.
   - Built-in zero-downtime developer fallback mode for offline testing.
3. **Simulated Alexa+ Glassmorphic Web Experience:**
   - Iconic reactive multi-color glowing Alexa+ halo ring.
   - Speech recognition (Mic input) + natural Alexa speech synthesis (TTS).
4. **Interactive Visual Surface (MCP Apps Spec):**
   - Directly renders interactive components onto the user's screen during voice interaction (device sliders, status badges, actionable buttons).
5. **Live Protocol Inspector:**
   - Real-time terminal sidebar displaying bidirectional JSON-RPC frames, handshake diagnostics, latency telemetry, and token usage.

---

## ⚡ Quick Start Guide

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation & Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/amazonhack.git
   cd amazonhack
   ```

2. **Start the application:**
   ```bash
   npm start
   ```

3. **Run automated test suite:**
   ```bash
   npm test
   ```
   *(Executes 11 automated verification tests for MCP tools, schemas, and Bedrock intent parsing).*

4. **Open the simulated Alexa+ interface:**
   Visit `http://localhost:3000` in your browser.

---

## 🔧 AWS Bedrock Configuration (Optional)

When you receive your $150 AWS Promotional Credits, configure your AWS credentials to activate live Amazon Bedrock inference:

1. Create a `.env` file in `server/.env`:
   ```env
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20240620-v1:0
   PORT=3000
   ```
2. Restart the server (`npm start`). Aura+ will automatically detect your AWS credentials and route queries through the live Bedrock runtime.

---

## 🛠️ MCP Tools & Resources Reference

### Autonomous Tools (`tools/list` & `tools/call`)
| Tool Name | Parameters | Purpose |
| :--- | :--- | :--- |
| `smart_home_control` | `deviceId`, `action`, `value` | Controls lights, thermostats, locks, and audio players |
| `execute_multi_step_routine` | `routineName`, `steps[]` | Autonomously executes sequential multi-device routines & mutates device states |
| `manage_context_memory` | `operation`, `key`, `value` | Stores and recalls preferences across conversation sessions |
| `render_interactive_card` | `cardType`, `title`, `details` | Renders rich UI cards adhering to MCP Apps standards |

### MCP Resources (`resources/list` & `resources/read`)
| Resource URI | MIME Type | Description |
| :--- | :--- | :--- |
| `alexa://user/profile` | `application/json` | User smart home device topology, active routines, and todo items |
| `alexa://system/telemetry` | `application/json` | Server uptime, active Streamable HTTP connections, and protocol health |

---

## 📋 3-Minute Demo Video Walkthrough Script

*For recording your submission demo video:*
- **[0:00 - 0:30] Introduction:** Present the problem with traditional single-turn voice skills and introduce Aura+ as an autonomous agent powered by Alexa+ MCP and AWS Bedrock.
- **[0:30 - 1:15] Voice & Autonomous Routine Demo:** Click the mic or prompt chip *"Activate Deep Focus routine"*. Show the Alexa ring glow amber (thinking) and cyan (speaking), demonstrating multi-step execution.
- **[1:15 - 2:00] Interactive Surface (MCP Apps):** Demonstrate the dynamically rendered smart light controller card and toggle device actions on-screen.
- **[2:00 - 2:40] MCP Protocol Inspector:** Show the real-time Streamable HTTP panel on the right with live Server-Sent Events, JSON-RPC 2.0 messages, and Bedrock latency.
- **[2:40 - 3:00] Conclusion & DevRel Feedback:** Highlight the open-source MIT license, AWS Bedrock integration, and friction log entries submitted for Amazon's developer team.

---

## 📜 Official Friction Log
See [FRICTION_LOG.md](FRICTION_LOG.md) for detailed observations on Streamable HTTP, Bedrock schema adapters, and actionable recommendations for the Amazon Developer Relations team (qualifying for the **10% judging bonus**).

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
