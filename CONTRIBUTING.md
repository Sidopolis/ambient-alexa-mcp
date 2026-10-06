# Contributing to Aura+

Thank you for your interest in contributing to **Aura+**! This project is an open-source, self-hosted Model Context Protocol (MCP) server and ambient agent interface built for the Amazon Developer Hackathon 2026.

We welcome contributions from the community, including bug reports, documentation updates, new MCP tools, and test cases.

---

## Code of Conduct

We are committed to providing a welcoming, inclusive, and harassment-free environment for everyone. Please be respectful and constructive in all discussions, issues, and pull requests.

---

## Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Git**

### Local Setup

1. **Fork and Clone the Repository**:
   ```bash
   git clone https://github.com/Sidopolis/ambient-alexa-mcp.git
   cd ambient-alexa-mcp
   ```

2. **Install Dependencies**:
   ```bash
   # Root / Server dependencies
   npm install

   # Client dependencies (if running client scripts)
   cd client && npm install && cd ..
   ```

3. **Run Locally**:
   ```bash
   npm start
   ```
   Open `http://localhost:3000` in your browser. The app runs with the built-in offline simulator by default—no AWS credentials required!

4. **Optional: AWS Bedrock Setup**:
   Create a `server/.env` file:
   ```env
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your_key
   AWS_SECRET_ACCESS_KEY=your_secret
   BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20240620-v1:0
   PORT=3000
   ```

---

## Development Workflow

### Project Structure

```
ambient-alexa-mcp/
├── server/
│   ├── src/
│   │   ├── index.js              # Express app, SSE (/sse) & JSON-RPC (/messages)
│   │   ├── bedrock/
│   │   │   └── client.js         # Bedrock Converse API + multi-model cascade
│   │   └── mcp/
│   │       ├── tools.js          # Registered MCP tools & JSON Schema definitions
│   │       ├── resources.js      # MCP URI resources (alexa://user/profile, etc.)
│   │       └── simulator.js      # Offline autonomous planning engine
│   └── tests/
│       ├── tools.test.js         # MCP tool schema & execution unit tests
│       └── bedrock.test.js       # Fallback & error recovery unit tests
├── client/
│   ├── index.html                # Accessible 4-view web dashboard
│   ├── app.js                    # Client-side state, SSE listener & voice handling
│   ├── style.css                 # Responsive design system & themes
│   └── site.webmanifest          # PWA manifest
└── FRICTION_LOG.md               # Developer experience & protocol friction log
```

### Running Tests

Before submitting any code changes, ensure all tests pass:

```bash
npm test
```

All 16 unit tests should exit with code 0. If you add new functionality, please add corresponding test cases under `server/tests/`.

---

## How to Contribute

### Adding a New MCP Tool

1. Open `server/src/mcp/tools.js`.
2. Define your tool definition complying with the MCP Spec (including `name`, `description`, and `inputSchema`).
3. Add the execution handler in `executeTool(name, args)`.
4. Add a test in `server/tests/tools.test.js` validating the tool input schema and execution response.

### Submitting a Pull Request (PR)

1. Create a descriptive branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Commit your changes with clear, semantic commit messages:
   ```bash
   git commit -m "feat(mcp): add weather_query tool"
   ```
3. Push to your fork and submit a Pull Request targeting `main`.
4. In your PR description, explain:
   - What problem this solves or what feature it adds.
   - Any manual or automated tests conducted.
   - Screenshots if you modified the client UI.

---

## License

By contributing to Aura+, you agree that your contributions will be licensed under the [MIT License](LICENSE).
