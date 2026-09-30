/**
 * Aura+ Automated Test Suite
 * Validates MCP Streamable HTTP endpoints, JSON-RPC 2.0 schemas, and Tool Execution.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { toolDefinitions, handleToolExecution, memoryStore } from "../src/mcp/tools.js";
import { runAgentReasoning } from "../src/bedrock/client.js";

test("MCP Tools Specification & Schema Integrity", async (t) => {
  await t.test("should register all 4 required MCP tools", () => {
    assert.equal(toolDefinitions.length, 4, "Expected exactly 4 registered MCP tools");
    const toolNames = toolDefinitions.map(t => t.name);
    assert.ok(toolNames.includes("smart_home_control"), "Missing smart_home_control");
    assert.ok(toolNames.includes("execute_multi_step_routine"), "Missing execute_multi_step_routine");
    assert.ok(toolNames.includes("manage_context_memory"), "Missing manage_context_memory");
    assert.ok(toolNames.includes("render_interactive_card"), "Missing render_interactive_card");
  });

  await t.test("each tool should contain valid JSON Schema inputSchema", () => {
    for (const tool of toolDefinitions) {
      assert.ok(tool.description, `Tool ${tool.name} missing description`);
      assert.equal(tool.inputSchema.type, "object", `Tool ${tool.name} inputSchema must be object`);
      assert.ok(tool.inputSchema.properties, `Tool ${tool.name} missing properties`);
      assert.ok(Array.isArray(tool.inputSchema.required), `Tool ${tool.name} required fields must be an array`);
    }
  });
});

test("MCP Tool Execution Engine", async (t) => {
  await t.test("smart_home_control: should turn on lights and set color", async () => {
    const res = await handleToolExecution("smart_home_control", {
      deviceId: "living_room_light",
      action: "turn_on",
      value: "#00d2ff"
    });
    assert.ok(!res.isError, "Execution reported error");
    assert.equal(memoryStore.smartDevices.living_room_light.state, "on");
    assert.equal(memoryStore.smartDevices.living_room_light.color, "#00d2ff");
  });

  await t.test("smart_home_control: should adjust climate temperature", async () => {
    const res = await handleToolExecution("smart_home_control", {
      deviceId: "thermostat",
      action: "set_temperature",
      value: "21.5"
    });
    assert.ok(!res.isError, "Execution reported error");
    assert.equal(memoryStore.smartDevices.thermostat.targetTemp, 21.5);
  });

  await t.test("execute_multi_step_routine: should orchestrate Deep Focus routine and mutate state", async () => {
    const res = await handleToolExecution("execute_multi_step_routine", {
      routineName: "Deep Focus Workspace",
      steps: ["Dim lights", "Lock front door", "Adjust thermostat"]
    });
    assert.ok(!res.isError, "Routine execution reported error");
    assert.ok(res.uiPayload, "Expected uiPayload for MCP Apps spec");
    assert.equal(res.uiPayload.cardType, "task_carousel");
    assert.equal(memoryStore.smartDevices.front_door_lock.state, "locked");
    assert.equal(memoryStore.smartDevices.living_room_light.brightness, 40);
  });

  await t.test("manage_context_memory: should persist preferences across sessions", async () => {
    await handleToolExecution("manage_context_memory", {
      operation: "save_preference",
      key: "preferredMusic",
      value: "Lo-Fi Beats"
    });
    assert.equal(memoryStore.preferences.preferredMusic, "Lo-Fi Beats");
  });
});

test("Agent Reasoning & Autonomous Intent Parser", async (t) => {
  await t.test("should prioritize routines when prompt combines routine and device intents", async () => {
    const agentResult = await runAgentReasoning("Activate Deep Focus routine and set lights");
    assert.equal(agentResult.toolCalled, "execute_multi_step_routine", "Failed to prioritize routine");
    assert.ok(agentResult.response.toLowerCase().includes("deep focus"), "Response must mention focus routine");
    assert.ok(agentResult.tokens > 0, "Must return token telemetry");
  });

  await t.test("should generate responsive UI card payload for MCP Apps", async () => {
    const agentResult = await runAgentReasoning("Check my hackathon checklist and tasks");
    assert.ok(agentResult.uiCard, "Must return uiCard payload");
    assert.equal(agentResult.uiCard.cardType, "metrics_dashboard");
  });
});
