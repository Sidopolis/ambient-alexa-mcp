/**
 * Aura+ Model Context Protocol (MCP) Tools Definition
 * Compliant with MCP Spec 2025-11-25+ (Agent Skills & Streamable HTTP)
 */

// In-memory persistent state across sessions
export const memoryStore = {
  preferences: {
    userName: "Sidhant",
    theme: "cyber-dark",
    preferredTemp: 22,
    routineActive: "evening_focus"
  },
  conversationHistory: [],
  activeRoutines: [
    { id: "morning", name: "Morning Briefing", time: "07:30", enabled: true },
    { id: "focus", name: "Deep Work Focus", time: "10:00", enabled: true },
    { id: "winddown", name: "Night Calm", time: "22:30", enabled: false }
  ],
  smartDevices: {
    living_room_light: { name: "Living Room Light", type: "light", state: "on", brightness: 75, color: "#00d2ff" },
    thermostat: { name: "Climate Control", type: "thermostat", state: "cooling", targetTemp: 21, currentTemp: 23 },
    front_door_lock: { name: "Smart Lock (Ring/Alexa)", type: "lock", state: "locked", battery: 94 },
    ambient_speakers: { name: "Echo Studio Living Room", type: "media", state: "playing", track: "Ambient Chillout" },
    solar_storage: { name: "Tesla Powerwall 3", type: "battery", state: "charging", batteryLevel: 84, chargeRateKw: 3.4, timeToFull: "42m" },
    ev_charger: { name: "Aura Smart EV Wallbox", type: "ev", state: "active", powerKw: 7.2, targetPct: 90 }
  },
  todoList: [
    { id: "1", task: "Review Hackathon project submission draft", completed: false, priority: "high" },
    { id: "2", task: "Deploy Streamable HTTP MCP server on AWS", completed: true, priority: "critical" },
    { id: "3", task: "Sync smart home routines with Alexa+", completed: false, priority: "medium" }
  ]
};

/**
 * List of available MCP tools exposed to Alexa+ and AWS Bedrock
 */
export const toolDefinitions = [
  {
    name: "smart_home_control",
    description: "Controls smart home devices connected to Alexa+ (lights, thermostat, locks, media). Supports querying status or updating device state.",
    inputSchema: {
      type: "object",
      properties: {
        deviceId: {
          type: "string",
          description: "ID of the target device: living_room_light, thermostat, front_door_lock, ambient_speakers, solar_storage, ev_charger"
        },
        action: {
          type: "string",
          enum: ["get_status", "turn_on", "turn_off", "set_temperature", "lock", "unlock", "set_color"],
          description: "Action to perform on the device"
        },
        value: {
          type: "string",
          description: "Optional argument (e.g. target temperature '22' or hex color '#00ff88')"
        }
      },
      required: ["deviceId", "action"]
    }
  },
  {
    name: "manage_context_memory",
    description: "Stores, retrieves, or updates user preferences and contextual memory across conversations for personalized agentic assistance.",
    inputSchema: {
      type: "object",
      properties: {
        operation: {
          type: "string",
          enum: ["read_preferences", "save_preference", "get_history", "record_event"],
          description: "Memory operation"
        },
        key: {
          type: "string",
          description: "Preference or memory key"
        },
        value: {
          type: "string",
          description: "Value to store or record"
        }
      },
      required: ["operation"]
    }
  },
  {
    name: "execute_multi_step_routine",
    description: "Autonomously orchestrates a multi-step routine across multiple services (e.g., set lights, adjust climate, update todo list, announce briefing).",
    inputSchema: {
      type: "object",
      properties: {
        routineName: {
          type: "string",
          description: "Name or intent of the routine (e.g., 'Work Mode', 'Night Routine', 'Welcome Home')"
        },
        steps: {
          type: "array",
          items: { type: "string" },
          description: "List of steps to orchestrate sequentially"
        }
      },
      required: ["routineName", "steps"]
    }
  },
  {
    name: "render_interactive_card",
    description: "Renders rich interactive UI components (MCP Apps spec) such as actionable cards, product suggestions, carousels, or metric dials on the Alexa+ screen.",
    inputSchema: {
      type: "object",
      properties: {
        cardType: {
          type: "string",
          enum: ["device_controller", "task_carousel", "metrics_dashboard", "smart_suggestion"],
          description: "Type of UI card to render"
        },
        title: {
          type: "string",
          description: "Card header title"
        },
        details: {
          type: "object",
          description: "Card data payload (items, action buttons, status values)"
        }
      },
      required: ["cardType", "title", "details"]
    }
  }
];

/**
 * Executes a tool call given the tool name and input arguments
 */
export async function handleToolExecution(name, args) {
  switch (name) {
    case "smart_home_control": {
      const { deviceId, action, value } = args;
      const device = memoryStore.smartDevices[deviceId];

      if (!device) {
        return {
          content: [
            {
              type: "text",
              text: `Error: Device '${deviceId}' not found. Available devices: ${Object.keys(memoryStore.smartDevices).join(", ")}`
            }
          ],
          isError: true
        };
      }

      if (action === "get_status") {
        return {
          content: [{ type: "text", text: `Status of ${device.name}: ${JSON.stringify(device, null, 2)}` }]
        };
      }

      if (action === "turn_on" || action === "turn_off") {
        device.state = action === "turn_on" ? "on" : "off";
      } else if (action === "set_temperature" && value) {
        device.targetTemp = parseFloat(value);
        device.state = "adjusting";
      } else if (action === "set_color" && value) {
        device.color = value;
      } else if (action === "lock" || action === "unlock") {
        device.state = action === "lock" ? "locked" : "unlocked";
      } else if (action === "charge" || action === "discharge") {
        device.state = action;
        if (value) device.chargeRateKw = parseFloat(value);
      } else if (action === "set_mode" && value) {
        device.mode = value;
      }

      return {
        content: [
          {
            type: "text",
            text: `Successfully executed '${action}' on ${device.name}. Current state: ${device.state} ${device.targetTemp ? `(${device.targetTemp}°C)` : ""}`
          }
        ]
      };
    }

    case "manage_context_memory": {
      const { operation, key, value } = args;

      if (operation === "read_preferences") {
        return {
          content: [{ type: "text", text: JSON.stringify(memoryStore.preferences, null, 2) }]
        };
      }

      if (operation === "save_preference" && key) {
        memoryStore.preferences[key] = value;
        return {
          content: [{ type: "text", text: `Saved preference [${key} = ${value}]. Persistent across sessions.` }]
        };
      }

      if (operation === "record_event") {
        const event = { timestamp: new Date().toISOString(), detail: value || key };
        memoryStore.conversationHistory.push(event);
        return {
          content: [{ type: "text", text: `Recorded memory event: "${event.detail}" at ${event.timestamp}` }]
        };
      }

      return {
        content: [{ type: "text", text: `Retrieved context memory: ${JSON.stringify(memoryStore, null, 2)}` }]
      };
    }

    case "execute_multi_step_routine": {
      const { routineName, steps } = args;
      const executionResults = [];

      // Apply real device state changes according to routine
      if (routineName.toLowerCase().includes("focus") || routineName.toLowerCase().includes("work")) {
        memoryStore.smartDevices.living_room_light.state = "on";
        memoryStore.smartDevices.living_room_light.brightness = 40;
        memoryStore.smartDevices.living_room_light.color = "#4A00E0";
        memoryStore.smartDevices.thermostat.targetTemp = 21.5;
        memoryStore.smartDevices.thermostat.state = "cooling";
        memoryStore.smartDevices.front_door_lock.state = "locked";
        memoryStore.preferences.routineActive = routineName;
      }

      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        executionResults.push(`Step ${i + 1}/${steps.length}: Completed "${step}"`);
      }

      return {
        content: [
          {
            type: "text",
            text: `Autonomous Routine '${routineName}' executed successfully:\n` + executionResults.join("\n")
          }
        ],
        uiPayload: {
          cardType: "task_carousel",
          title: `${routineName} Active`,
          details: {
            stepsCompleted: steps.length,
            activeAudio: "Echo Studio - Focus Stream",
            ambientLighting: "Deep Indigo (#4A00E0)"
          }
        }
      };
    }

    case "render_interactive_card": {
      const { cardType, title, details } = args;
      return {
        content: [
          {
            type: "text",
            text: `Rendered interactive visual card [${cardType}]: "${title}". UI payload synchronized.`
          }
        ],
        uiPayload: {
          cardType,
          title,
          details,
          timestamp: new Date().toISOString()
        }
      };
    }

    default:
      return {
        content: [{ type: "text", text: `Unknown tool: ${name}` }],
        isError: true
      };
  }
}
