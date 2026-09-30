/**
 * Aura+ Client Application Controller
 * Handles Streamable HTTP SSE transport, Voice Synthesis/Recognition,
 * Alexa Ring animations, and MCP Apps dynamic visual cards.
 */

// DOM Elements
const alexaRing = document.getElementById("alexaRing");
const alexaStateLabel = document.getElementById("alexaStateLabel");
const micBtn = document.getElementById("micBtn");
const userTranscript = document.getElementById("userTranscript");
const responseText = document.getElementById("responseText");
const promptForm = document.getElementById("promptForm");
const promptInput = document.getElementById("promptInput");
const cardsCanvas = document.getElementById("cardsCanvas");
const streamLogContainer = document.getElementById("streamLogContainer");
const clearLogBtn = document.getElementById("clearLogBtn");
const telemetryLatency = document.getElementById("telemetryLatency");
const telemetryTokens = document.getElementById("telemetryTokens");
const deviceMatrixGrid = document.getElementById("deviceMatrixGrid");

// State
let isListening = false;
let speechSynth = window.speechSynthesis;
let speechRecognizer = null;
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

// Iconic Alexa Wake Chime (Dual-frequency sine wave chime)
function playAlexaWakeChime() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.26);
  } catch (e) {}
}

// Confirmation Chime for completed autonomous tasks
function playAlexaSuccessChime() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(659.25, now); // E5
    osc.frequency.setValueAtTime(880, now + 0.08); // A5

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.22);
  } catch (e) {}
}

// Initialize Speech Recognition if supported in browser
function setupSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    speechRecognizer = new SpeechRecognition();
    speechRecognizer.continuous = false;
    speechRecognizer.interimResults = false;
    speechRecognizer.lang = "en-US";

    speechRecognizer.onstart = () => {
      setAlexaState("listening", "Listening to voice input...");
    };

    speechRecognizer.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      userTranscript.querySelector(".text").textContent = `"${transcript}"`;
      promptInput.value = transcript;
      handleUserPrompt(transcript);
    };

    speechRecognizer.onerror = (event) => {
      console.warn("Speech recognition error:", event.error);
      setAlexaState("idle", "Ready • Click mic or prompt chips");
    };

    speechRecognizer.onend = () => {
      isListening = false;
    };
  } else {
    console.info("Speech recognition not natively supported, prompt input active.");
  }
}

// Update the Alexa+ Halo Ring visual state
function setAlexaState(state, label) {
  alexaRing.classList.remove("listening", "thinking", "speaking");
  if (state !== "idle") {
    alexaRing.classList.add(state);
  }
  alexaStateLabel.textContent = label;
}

// Speak response with Alexa-like natural cadence
function speakAlexaResponse(text) {
  if (!speechSynth) return;
  speechSynth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.05;
  utterance.pitch = 1.0;

  // Attempt to select a clean English voice
  const voices = speechSynth.getVoices();
  const selectedVoice = voices.find(v => v.lang.startsWith("en") && (v.name.includes("Female") || v.name.includes("Natural") || v.name.includes("Google"))) || voices[0];
  if (selectedVoice) utterance.voice = selectedVoice;

  setAlexaState("speaking", "Alexa+ Speaking...");

  utterance.onend = () => {
    setAlexaState("idle", "Ready • Say 'Alexa' or Click to Speak");
  };

  speechSynth.speak(utterance);
}

// ----------------------------------------------------
// STREAMABLE HTTP (SSE) REAL-TIME INSPECTOR
// ----------------------------------------------------
function connectStreamableHttp() {
  const sseSource = new EventSource("/sse");

  appendLog("system", "Initiating Streamable HTTP handshake on /sse...");

  sseSource.addEventListener("endpoint", (e) => {
    const data = JSON.parse(e.data);
    appendLog("event-handshake", `[MCP Streamable HTTP] Session bound: ${data.sessionId} via ${data.endpoint}`);
  });

  sseSource.addEventListener("handshake", (e) => {
    const data = JSON.parse(e.data);
    appendLog("event-handshake", `[MCP Spec 2025-11-25] Server: ${data.serverName} v${data.serverVersion} (Tools listChanged: true)`);
  });

  sseSource.addEventListener("jsonrpc_request", (e) => {
    const data = JSON.parse(e.data);
    appendLog("event-jsonrpc", `--> JSON-RPC 2.0 Request: method="${data.method}" id=${data.id}`);
  });

  sseSource.addEventListener("jsonrpc_response", (e) => {
    const data = JSON.parse(e.data);
    appendLog("event-jsonrpc", `<-- JSON-RPC 2.0 Response: id=${data.id} payload=${JSON.stringify(data.result).substring(0, 100)}...`);
  });

  sseSource.addEventListener("tool_execution", (e) => {
    const data = JSON.parse(e.data);
    appendLog("event-tool", `⚡ Tool Executed: [${data.tool}] Args: ${JSON.stringify(data.input)}`);
    fetchCurrentState();
  });

  sseSource.onerror = (err) => {
    appendLog("system", "Streamable HTTP connection paused or reconnecting...");
  };
}

function appendLog(typeClass, message) {
  const entry = document.createElement("div");
  entry.className = `log-entry ${typeClass}`;
  const time = new Date().toLocaleTimeString();
  entry.innerHTML = `<span class="log-time">[${time}]</span> <span class="log-body">${escapeHtml(message)}</span>`;
  streamLogContainer.appendChild(entry);
  streamLogContainer.scrollTop = streamLogContainer.scrollHeight;
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m]);
}

// ----------------------------------------------------
// AGENT PROMPT SUBMISSION & EXECUTION
// ----------------------------------------------------
async function handleUserPrompt(promptText) {
  if (!promptText.trim()) return;

  playAlexaWakeChime();
  userTranscript.querySelector(".text").textContent = `"${promptText}"`;
  setAlexaState("thinking", "Alexa+ & AWS Bedrock Orchestrating...");
  promptInput.value = "";

  try {
    const response = await fetch("/api/agent/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: promptText })
    });

    const result = await response.json();
    if (result.success) {
      const data = result.data;
      responseText.textContent = `"${data.response}"`;
      telemetryLatency.textContent = `${data.latencyMs}ms`;
      telemetryTokens.textContent = `${data.tokens}`;

      playAlexaSuccessChime();
      speakAlexaResponse(data.response);

      // Render Dynamic Visual Card
      if (data.uiCard) {
        renderCard(data.uiCard);
      }

      // Synchronize live device matrix digital twin
      if (result.currentState?.smartDevices) {
        renderDeviceMatrix(result.currentState.smartDevices);
      }
    } else {
      responseText.textContent = `"I encountered an issue executing this request: ${result.error}"`;
      setAlexaState("idle", "Error occurred");
    }
  } catch (error) {
    responseText.textContent = `"Network connection error to local MCP server: ${error.message}"`;
    setAlexaState("idle", "Ready");
  }
}

// ----------------------------------------------------
// DYNAMIC VISUAL CARDS (MCP APPS SPEC)
// ----------------------------------------------------
function renderCard(card) {
  const cardElement = document.createElement("div");
  cardElement.className = "ui-card";

  if (card.cardType === "device_controller") {
    cardElement.innerHTML = `
      <div class="card-top">
        <h4>${card.title}</h4>
        <span class="card-badge">Smart Device</span>
      </div>
      <div class="card-metrics">
        <div class="metric-item">
          <span class="label">Status</span>
          <span class="val">${card.details.state || "Online"}</span>
        </div>
        <div class="metric-item">
          <span class="label">Target</span>
          <span class="val">${card.details.target || card.details.brightness || "Active"}</span>
        </div>
      </div>
      <div class="card-actions">
        <button class="card-btn primary" onclick="toggleDeviceAction('living_room_light', 'turn_on')">Turn On</button>
        <button class="card-btn" onclick="toggleDeviceAction('living_room_light', 'turn_off')">Turn Off</button>
      </div>
    `;
  } else if (card.cardType === "task_carousel") {
    cardElement.innerHTML = `
      <div class="card-top">
        <h4>${card.title}</h4>
        <span class="card-badge">Autonomous Routine</span>
      </div>
      <div class="card-metrics">
        <div class="metric-item">
          <span class="label">Steps Executed</span>
          <span class="val">${card.details.stepsCompleted || 5}</span>
        </div>
        <div class="metric-item">
          <span class="label">Ambient Hue</span>
          <span class="val" style="color: #9d00ff">Indigo</span>
        </div>
      </div>
      <div class="card-actions">
        <button class="card-btn primary" onclick="handleUserPrompt('Cancel Focus routine')">Disengage Routine</button>
      </div>
    `;
  } else if (card.cardType === "metrics_dashboard") {
    cardElement.innerHTML = `
      <div class="card-top">
        <h4>${card.title}</h4>
        <span class="card-badge">Hackathon Status</span>
      </div>
      <div class="card-metrics">
        <div class="metric-item">
          <span class="label">Primary Track</span>
          <span class="val" style="font-size: 0.95rem; color: #00d2ff;">Alexa+ MCP</span>
        </div>
        <div class="metric-item">
          <span class="label">Bonus Eligible</span>
          <span class="val" style="font-size: 0.95rem; color: #00f298;">+10% Bonus</span>
        </div>
      </div>
      <div class="card-actions">
        <button class="card-btn primary" onclick="window.open('/sse', '_blank')">View Stream</button>
      </div>
    `;
  } else {
    cardElement.innerHTML = `
      <div class="card-top">
        <h4>${card.title}</h4>
        <span class="card-badge">MCP Suggestion</span>
      </div>
      <p style="font-size: 0.85rem; color: var(--text-muted);">${JSON.stringify(card.details)}</p>
      <div class="card-actions">
        <button class="card-btn primary" onclick="handleUserPrompt('Activate Deep Focus routine and set lights')">Execute Routine</button>
      </div>
    `;
  }

  // Prepend new card so latest appears at top
  cardsCanvas.prepend(cardElement);
}

// ----------------------------------------------------
// CONNECTED DEVICE MATRIX (LIVE DIGITAL TWIN)
// ----------------------------------------------------
function renderDeviceMatrix(devices) {
  if (!deviceMatrixGrid || !devices) return;
  deviceMatrixGrid.innerHTML = "";

  Object.entries(devices).forEach(([id, dev]) => {
    const card = document.createElement("div");
    const isActive = dev.state === "on" || dev.state === "cooling" || dev.state === "locked" || dev.state === "playing" || dev.state === "adjusting";
    card.className = `matrix-device-card ${isActive ? "active" : ""}`;

    let subText = "";
    if (dev.type === "light") {
      subText = `Brightness: ${dev.brightness}% • Color: <span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:${dev.color};vertical-align:middle;box-shadow:0 0 6px ${dev.color}"></span>`;
    } else if (dev.type === "thermostat") {
      subText = `Target: ${dev.targetTemp}°C (Current: ${dev.currentTemp}°C)`;
    } else if (dev.type === "lock") {
      subText = `Status: ${dev.state.toUpperCase()} • Battery: ${dev.battery}%`;
    } else if (dev.type === "media") {
      subText = `Track: "${dev.track}"`;
    }

    let actions = "";
    if (dev.type === "light") {
      actions = `
        <button class="matrix-btn" onclick="toggleDeviceAction('${id}', 'turn_on')">Turn On</button>
        <button class="matrix-btn" onclick="toggleDeviceAction('${id}', 'turn_off')">Turn Off</button>
      `;
    } else if (dev.type === "thermostat") {
      actions = `
        <button class="matrix-btn" onclick="toggleDeviceAction('${id}', 'set_temperature', '20')">Cool (20°C)</button>
        <button class="matrix-btn" onclick="toggleDeviceAction('${id}', 'set_temperature', '22')">Eco (22°C)</button>
      `;
    } else if (dev.type === "lock") {
      actions = `
        <button class="matrix-btn" onclick="toggleDeviceAction('${id}', '${dev.state === "locked" ? "unlock" : "lock"}')">${dev.state === "locked" ? "Unlock" : "Lock"}</button>
      `;
    } else if (dev.type === "media") {
      actions = `
        <button class="matrix-btn" onclick="toggleDeviceAction('${id}', '${dev.state === "playing" ? "turn_off" : "turn_on"}')">${dev.state === "playing" ? "Pause" : "Play"}</button>
      `;
    }

    card.innerHTML = `
      <div class="matrix-card-header">
        <span class="matrix-device-title">${dev.name}</span>
        <span class="device-status-badge ${isActive ? "badge-on" : "badge-off"}">${dev.state}</span>
      </div>
      <div class="matrix-device-sub">${subText}</div>
      <div class="matrix-action-bar">${actions}</div>
    `;

    deviceMatrixGrid.appendChild(card);
  });
}

// Expose prompt handler on window for inline card onclick handlers
window.handleUserPrompt = handleUserPrompt;

// Global action handler for card buttons
window.toggleDeviceAction = async function(deviceId, action, value) {
  try {
    const res = await fetch("/api/device/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deviceId, action, value })
    });
    const data = await res.json();
    if (data.success) {
      playAlexaSuccessChime();
      appendLog("event-tool", `⚡ Device [${deviceId}] toggled: ${action.toUpperCase()} ${value ? `(${value})` : ""}`);
      speakAlexaResponse(`${deviceId.replace(/_/g, ' ')} is now updated to ${action.replace('turn_', '')}.`);

      // Update Live Device Matrix
      if (data.currentDevices) {
        renderDeviceMatrix(data.currentDevices);
      }
    }
  } catch (err) {
    console.error("Device toggle failed:", err);
  }
};

// Fetch current memory store state
async function fetchCurrentState() {
  try {
    const res = await fetch("/api/state");
    const state = await res.json();

    // Render Digital Twin Device Matrix
    if (state.smartDevices) {
      renderDeviceMatrix(state.smartDevices);
    }

    // Render initial smart device card if canvas is empty
    if (cardsCanvas.children.length === 0 && state.smartDevices) {
      renderCard({
        cardType: "device_controller",
        title: "Living Room Light",
        details: { state: state.smartDevices.living_room_light.state, brightness: "75%" }
      });
      renderCard({
        cardType: "metrics_dashboard",
        title: "Amazon Developer Hackathon Progress",
        details: {}
      });
    }
  } catch (err) {
    console.warn("Could not fetch state:", err);
  }
}

// ----------------------------------------------------
// EVENT LISTENERS & INITIALIZATION
// ----------------------------------------------------
micBtn.addEventListener("click", () => {
  if (!isListening && speechRecognizer) {
    isListening = true;
    speechRecognizer.start();
  } else if (isListening && speechRecognizer) {
    speechRecognizer.stop();
    isListening = false;
    setAlexaState("idle", "Ready • Say 'Alexa' or Click to Speak");
  } else {
    // If browser speech recognition is blocked or unsupported, prompt focus
    promptInput.focus();
    setAlexaState("listening", "Listening simulation active (Type prompt)");
  }
});

promptForm.addEventListener("submit", (e) => {
  e.preventDefault();
  handleUserPrompt(promptInput.value);
});

// Prompt Chips Click Handlers
document.querySelectorAll(".chip").forEach(chip => {
  chip.addEventListener("click", () => {
    const prompt = chip.getAttribute("data-prompt");
    handleUserPrompt(prompt);
  });
});

clearLogBtn.addEventListener("click", () => {
  streamLogContainer.innerHTML = '<div class="log-entry system-entry"><span class="log-time">[System]</span> Log cleared. Listening for stream events...</div>';
});

// Boot application
setupSpeechRecognition();
connectStreamableHttp();
fetchCurrentState();
