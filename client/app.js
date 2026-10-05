/**
 * Aura+ Client Controller v4.1
 * MCP Spec 2025-11-25+ | AWS Bedrock Runtime
 */

// DOM Elements
const alexaStateLabel = document.getElementById("alexaStateLabel");
const micBtn = document.getElementById("micBtn");
const conversationContainer = document.getElementById("conversationContainer");
const promptForm = document.getElementById("promptForm");
const promptInput = document.getElementById("promptInput");
const cardsCanvas = document.getElementById("cardsCanvas");
const deviceMatrixGrid = document.getElementById("deviceMatrixGrid");
const toastContainer = document.getElementById("toastContainer");
const voiceWaveBars = document.getElementById("voiceWaveBars");
const toolCallsList = document.getElementById("toolCallsList");
const planStatusTag = document.getElementById("planStatusTag");
const traceTotalDuration = document.getElementById("traceTotalDuration");

// Multi-Model Quota Failover Elements
const modelSelect = document.getElementById("modelSelect");
const bedrockPill = document.getElementById("bedrockPill");
const bedrockPillText = document.getElementById("bedrockPillText");
const quotaSimulateBtn = document.getElementById("quotaSimulateBtn");
const quotaSimulateLabel = document.getElementById("quotaSimulateLabel");
const quotaFallbackBanner = document.getElementById("quotaFallbackBanner");
const qfbTitle = document.getElementById("qfbTitle");
const qfbDesc = document.getElementById("qfbDesc");
const qfbCloseBtn = document.getElementById("qfbCloseBtn");

// Execution Trace Dynamic Elements
const traceModelTag = document.getElementById("traceModelTag");
const traceFallbackTag = document.getElementById("traceFallbackTag");
const traceQuotaFailRow = document.getElementById("traceQuotaFailRow");
const traceQuotaFailModel = document.getElementById("traceQuotaFailModel");
const traceModelSpanName = document.getElementById("traceModelSpanName");
const traceModelBarText = document.getElementById("traceModelBarText");

// Set welcome timestamp
const welcomeTimeEl = document.getElementById("welcomeTime");
if (welcomeTimeEl) welcomeTimeEl.textContent = new Date().toLocaleTimeString();

// State
let isListening = false;
let speechSynth = window.speechSynthesis;
let speechRecognizer = null;
let audioCtx = null;
let isProcessing = false;
let simulateQuotaActive = false;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

// ============================================================
// AUDIO FEEDBACK (Web Audio API Synthesized Chimes)
// ============================================================
function playAlexaWakeChime() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = "sine";
    osc2.type = "sine";
    osc1.frequency.setValueAtTime(523.25, now); // C5
    osc1.frequency.exponentialRampToValueAtTime(783.99, now + 0.12); // G5
    osc2.frequency.setValueAtTime(659.25, now + 0.05); // E5
    osc2.frequency.exponentialRampToValueAtTime(1046.50, now + 0.18); // C6

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now + 0.05);
    osc1.stop(now + 0.35);
    osc2.stop(now + 0.35);
  } catch (err) {
    console.debug("Audio chime skipped:", err);
  }
}

function playAlexaSuccessChime() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);

    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  } catch (err) {
    console.debug("Audio chime skipped:", err);
  }
}

// ============================================================
// TOAST NOTIFICATIONS
// ============================================================
function showToast(message, type = "info", duration = 3000) {
  if (!toastContainer) return;
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(8px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ============================================================
// VOICE SYNTHESIS & RECOGNITION
// ============================================================
function setVoiceState(state, label) {
  if (alexaStateLabel) alexaStateLabel.textContent = label;
  if (voiceWaveBars) {
    if (state === "listening" || state === "speaking") {
      voiceWaveBars.classList.add("active");
    } else {
      voiceWaveBars.classList.remove("active");
    }
  }
  if (micBtn) {
    if (state === "listening") {
      micBtn.classList.add("active");
    } else {
      micBtn.classList.remove("active");
    }
  }
}

function setupSpeechRecognition() {
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRec) {
    console.warn("SpeechRecognition API not available in this browser.");
    return;
  }

  speechRecognizer = new SpeechRec();
  speechRecognizer.continuous = false;
  speechRecognizer.interimResults = false;
  speechRecognizer.lang = "en-US";

  speechRecognizer.onstart = () => {
    isListening = true;
    setVoiceState("listening", "Listening for voice command...");
    playAlexaWakeChime();
  };

  speechRecognizer.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    setVoiceState("thinking", `Heard: "${transcript}"`);
    handleUserPrompt(transcript);
  };

  speechRecognizer.onerror = (event) => {
    console.warn("Speech recognition error:", event.error);
    isListening = false;
    setVoiceState("idle", "Ready • Enter command or click mic");
  };

  speechRecognizer.onend = () => {
    isListening = false;
    if (!isProcessing) {
      setVoiceState("idle", "Ready • Enter command or click mic");
    }
  };
}

function speakAlexaResponse(text) {
  if (!speechSynth) return;
  speechSynth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.05;
  utterance.pitch = 1.0;

  const voices = speechSynth.getVoices();
  const selectedVoice = voices.find(v => v.lang.startsWith("en") && (v.name.includes("Female") || v.name.includes("Natural") || v.name.includes("Google"))) || voices[0];
  if (selectedVoice) utterance.voice = selectedVoice;

  setVoiceState("speaking", "Alexa+ Speaking response...");

  utterance.onend = () => {
    setVoiceState("idle", "Ready • Enter command or click mic");
  };

  speechSynth.speak(utterance);
}

// ============================================================
// CONVERSATION STREAM & MODEL HELPERS
// ============================================================
function formatModelName(modelId) {
  if (!modelId) return "Bedrock LLM";
  if (modelId.includes("claude-3-5-sonnet")) return "Claude 3.5 Sonnet";
  if (modelId.includes("claude-3-haiku")) return "Claude 3 Haiku";
  if (modelId.includes("claude-3-5-haiku")) return "Claude 3.5 Haiku";
  if (modelId.includes("nova-pro")) return "Amazon Nova Pro";
  if (modelId.includes("nova-lite")) return "Amazon Nova Lite";
  if (modelId.includes("llama3")) return "Meta Llama 3";
  if (modelId.includes("gemini")) return "Google Gemini Flash";
  if (modelId.includes("gpt-4o")) return "OpenAI GPT-4o Mini";
  if (modelId.includes("simulator")) return "Autonomous Simulator";
  return modelId.split("/").pop();
}

function addConversationMessage(sender, text, fallbackChipText = null) {
  if (!conversationContainer) return;
  const msg = document.createElement("div");
  msg.className = `chat-item ${sender === "user" ? "user" : "agent"}`;
  const time = new Date().toLocaleTimeString();
  const chipHtml = fallbackChipText
    ? `<div class="chat-fallback-chip">${escapeHtml(fallbackChipText)}</div>`
    : "";
  msg.innerHTML = `
    <div class="chat-meta">
      <span class="chat-sender">${sender === "user" ? "You" : "Alexa+ Agent"}</span>
      <span class="chat-timestamp">${time}</span>
    </div>
    <div class="chat-bubble">
      ${escapeHtml(text)}
      ${chipHtml}
    </div>
  `;
  conversationContainer.appendChild(msg);
  conversationContainer.scrollTop = conversationContainer.scrollHeight;
}

// ============================================================
// 21ST.DEV COMPONENT: AI TOOL CALL DISCLOSURE (id: 23789)
// ============================================================
window.toggleToolCard = function(id) {
  const card = document.getElementById(id);
  if (card) {
    card.classList.toggle("open");
    const summary = card.querySelector(".tool-card-summary");
    if (summary) {
      const isOpen = card.classList.contains("open");
      summary.setAttribute("aria-expanded", String(isOpen));
    }
  }
};

function addToolCallDisclosure(toolName, args, result) {
  if (!toolCallsList) return;
  const id = `toolCall_${Date.now()}`;
  const card = document.createElement("div");
  card.className = "ai-tool-card open";
  card.id = id;

  const argsStr = typeof args === "object" ? JSON.stringify(args, null, 2) : String(args);
  const resultStr = typeof result === "object" ? JSON.stringify(result, null, 2) : String(result);

  card.innerHTML = `
    <div class="tool-card-summary" role="button" tabindex="0" aria-expanded="true" aria-label="Toggle ${escapeHtml(toolName)} tool call details" onclick="toggleToolCard('${id}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();toggleToolCard('${id}')}">
      <span class="tool-badge">✓</span>
      <span class="tool-name">${escapeHtml(toolName)}</span>
      <span class="tool-summary-text">${escapeHtml(argsStr.substring(0, 50))}...</span>
      <span class="chevron-icon">›</span>
    </div>
    <div class="tool-card-details">
      <div class="detail-block">
        <div class="detail-label">Arguments (JSON-RPC)</div>
        <pre class="code-block"><code>${escapeHtml(argsStr)}</code></pre>
      </div>
      <div class="detail-block">
        <div class="detail-label">Execution Result</div>
        <pre class="code-block result"><code>${escapeHtml(resultStr)}</code></pre>
      </div>
    </div>
  `;

  toolCallsList.prepend(card);
}

// ============================================================
// STREAMABLE HTTP (SSE) HANDSHAKE & EVENT STREAM
// ============================================================
function connectStreamableHttp() {
  const sseSource = new EventSource("/sse");

  sseSource.addEventListener("endpoint", (e) => {
    const data = JSON.parse(e.data);
    showToast(`MCP session established: ${data.sessionId}`, "info");
  });

  sseSource.addEventListener("tool_execution", (e) => {
    const data = JSON.parse(e.data);
    addToolCallDisclosure(data.tool, data.input, data.result);
    fetchCurrentState();
  });

  sseSource.addEventListener("model_fallback", (e) => {
    try {
      const data = JSON.parse(e.data);
      showToast(`⚡ Model Quota Switch: ${formatModelName(data.primaryModel)} ➔ ${formatModelName(data.activeModel)}`, "warning");
    } catch {}
  });

  sseSource.onerror = () => {
    console.warn("Streamable HTTP connection paused or reconnecting...");
  };
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str).replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m]);
}

// ============================================================
// AGENT PROMPT SUBMISSION & EXECUTION (WITH QUOTA FAILOVER)
// ============================================================
async function handleUserPrompt(promptText) {
  if (!promptText.trim() || isProcessing) return;

  isProcessing = true;
  playAlexaWakeChime();
  addConversationMessage("user", promptText);
  setVoiceState("thinking", "Processing with Bedrock / Multi-Model Cascade...");
  promptInput.value = "";

  if (planStatusTag) planStatusTag.textContent = "Orchestrating...";

  try {
    const selectedModel = modelSelect ? modelSelect.value : "auto";
    const payload = {
      prompt: promptText,
      preferredModel: selectedModel,
      simulateQuota: simulateQuotaActive
    };

    const response = await fetch("/api/agent/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.success) {
      const data = result.data;
      const modelDisplayName = formatModelName(data.model);

      // Handle Quota Fallback state in UI
      if (data.fallbackOccurred) {
        if (bedrockPill) bedrockPill.classList.add("fallback-active");
        if (bedrockPillText) bedrockPillText.textContent = `⚡ Switched: ${modelDisplayName}`;

        // Show quota fallback banner
        if (quotaFallbackBanner) {
          quotaFallbackBanner.style.display = "block";
          if (qfbTitle) qfbTitle.textContent = "⚡ Multi-Model Quota Failover Active";
          if (qfbDesc) {
            const primaryName = formatModelName(data.primaryModel || "Claude 3.5 Sonnet");
            qfbDesc.innerHTML = `Primary model (<strong>${escapeHtml(primaryName)}</strong>) reached quota or rate limit. Aura+ automatically failed over to <strong>${escapeHtml(modelDisplayName)}</strong> in ${data.latencyMs}ms with zero disruption.`;
          }
        }

        showToast(`Quota reached on ${formatModelName(data.primaryModel)} — switched to ${modelDisplayName}!`, "warning");

        // Add message with fallback chip
        addConversationMessage(
          "agent",
          data.response,
          `⚡ Quota Switched: ${formatModelName(data.primaryModel)} ➔ ${modelDisplayName}`
        );

        // Update Trace Waterfall
        if (traceFallbackTag) {
          traceFallbackTag.style.display = "inline-flex";
          traceFallbackTag.textContent = `⚡ Quota Failover: ${modelDisplayName}`;
        }
        if (traceQuotaFailRow) {
          traceQuotaFailRow.style.display = "flex";
          if (traceQuotaFailModel) traceQuotaFailModel.textContent = data.primaryModel || "claude-3-5-sonnet";
        }
      } else {
        if (bedrockPill) bedrockPill.classList.remove("fallback-active");
        if (bedrockPillText) bedrockPillText.textContent = `⚡ ${modelDisplayName}`;
        if (traceFallbackTag) traceFallbackTag.style.display = "none";
        if (traceQuotaFailRow) traceQuotaFailRow.style.display = "none";
        addConversationMessage("agent", data.response);
      }

      // Update Trace Tags & Spans
      if (traceTotalDuration) {
        traceTotalDuration.textContent = `Total: ${data.latencyMs}ms`;
      }
      if (traceModelTag) {
        traceModelTag.textContent = `Model: ${data.model}`;
      }
      if (traceModelSpanName) {
        traceModelSpanName.textContent = data.model;
      }
      if (traceModelBarText) {
        traceModelBarText.textContent = `${data.latencyMs}ms • ${data.tokens || 140} tokens`;
      }

      playAlexaSuccessChime();
      speakAlexaResponse(data.response);

      // Render Tool Call Disclosure if a tool was executed
      if (data.toolCalled) {
        addToolCallDisclosure(data.toolCalled, data.toolInput || {}, data.toolResult || data.response);
      }

      // Render Dynamic Visual Card
      if (data.uiCard) {
        renderCard(data.uiCard);
      }

      // Synchronize live device matrix digital twin
      if (result.currentState?.smartDevices) {
        renderDeviceMatrix(result.currentState.smartDevices);
      }

      if (planStatusTag) planStatusTag.textContent = "Complete";
      showToast(data.toolCalled ? `Tool executed: ${data.toolCalled}` : "Response generated", "success");
    } else {
      addConversationMessage("agent", `I encountered an issue: ${result.error}`);
      setVoiceState("idle", "Ready");
      showToast("Request failed", "error");
    }
  } catch (error) {
    addConversationMessage("agent", `Network error: ${error.message}`);
    setVoiceState("idle", "Ready");
    showToast("Connection error", "error");
  }

  isProcessing = false;
}

// ============================================================
// DYNAMIC VISUAL CARDS (MCP APPS SPEC)
// ============================================================
function renderCard(card) {
  if (!cardsCanvas) return;
  const cardElement = document.createElement("div");
  cardElement.className = "ui-card";

  if (card.cardType === "device_controller") {
    cardElement.innerHTML = `
      <div class="card-top">
        <h4>💡 ${escapeHtml(card.title)}</h4>
        <span class="card-badge badge-device">Smart Device</span>
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
        <h4>🎯 ${escapeHtml(card.title)}</h4>
        <span class="card-badge badge-routine">Autonomous Routine</span>
      </div>
      <div class="card-metrics">
        <div class="metric-item">
          <span class="label">Steps Executed</span>
          <span class="val" style="color: var(--accent-emerald)">${card.details.stepsCompleted || 5}</span>
        </div>
        <div class="metric-item">
          <span class="label">Mode</span>
          <span class="val" style="color: var(--accent-cyan)">Deep Focus</span>
        </div>
      </div>
      <div class="card-actions">
        <button class="card-btn primary" onclick="handleUserPrompt('Cancel Focus routine')">Disengage Routine</button>
      </div>
    `;
  } else {
    cardElement.innerHTML = `
      <div class="card-top">
        <h4>✨ ${escapeHtml(card.title)}</h4>
        <span class="card-badge badge-device">MCP Result</span>
      </div>
      <p style="font-size: 0.78rem; color: var(--text-muted);">${escapeHtml(JSON.stringify(card.details, null, 2))}</p>
    `;
  }

  cardsCanvas.prepend(cardElement);
}

// ============================================================
// DEVICE TOPOLOGY (DIGITAL TWIN)
// ============================================================
const deviceIcons = {
  light: "💡",
  thermostat: "🌡️",
  lock: "🔐",
  media: "🔊",
  battery: "🔋",
  ev: "🚗"
};

function renderDeviceMatrix(devices) {
  if (!deviceMatrixGrid || !devices) return;
  deviceMatrixGrid.innerHTML = "";

  Object.entries(devices).forEach(([id, dev]) => {
    const card = document.createElement("div");
    const isActive = dev.state === "on" || dev.state === "cooling" || dev.state === "locked" || dev.state === "playing" || dev.state === "adjusting" || dev.state === "charging" || dev.state === "active";
    card.className = `matrix-device-card ${isActive ? "active" : ""}`;

    const icon = deviceIcons[dev.type] || "📟";

    let subText = "";
    if (dev.type === "light") {
      subText = `Brightness: ${dev.brightness}% • Color: <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${dev.color};vertical-align:middle;"></span>`;
    } else if (dev.type === "thermostat") {
      subText = `Target: ${dev.targetTemp}°C (Current: ${dev.currentTemp}°C)`;
    } else if (dev.type === "lock") {
      subText = `Status: ${dev.state.toUpperCase()} • Battery: ${dev.battery}%`;
    } else if (dev.type === "media") {
      subText = `Track: "${dev.track}"`;
    } else if (dev.type === "battery") {
      subText = `Level: ${dev.batteryLevel}% • Flow: +${dev.chargeRateKw || 3.4} kW`;
    } else if (dev.type === "ev") {
      subText = `Wallbox: ${dev.powerKw} kW • Target: ${dev.targetPct}%`;
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
    } else {
      actions = `
        <button class="matrix-btn" onclick="showToast('Node synchronized with MCP mesh', 'info')">Sync Telemetry</button>
      `;
    }

    card.innerHTML = `
      <div class="matrix-card-header">
        <span class="matrix-device-title"><span class="device-icon">${icon}</span> ${escapeHtml(dev.name)}</span>
        <span class="device-status-badge ${isActive ? "badge-on" : "badge-off"}">${dev.state}</span>
      </div>
      <div class="matrix-device-sub">${subText}</div>
      <div class="matrix-action-bar">${actions}</div>
    `;

    deviceMatrixGrid.appendChild(card);
  });
}

// Global toggle device action
window.toggleDeviceAction = async function(deviceId, action, value) {
  try {
    showToast(`Sending command to ${deviceId.replace(/_/g, ' ')}...`, "info", 2000);

    const res = await fetch("/api/device/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deviceId, action, value })
    });
    const data = await res.json();
    if (data.success) {
      playAlexaSuccessChime();
      const readableAction = action.replace('turn_', '').replace('set_', 'set to ');
      showToast(`${deviceId.replace(/_/g, ' ')} → ${readableAction} ${value || ""}`, "success");

      if (data.currentDevices) {
        renderDeviceMatrix(data.currentDevices);
      }
    }
  } catch (err) {
    console.error("Device toggle failed:", err);
    showToast("Device command failed", "error");
  }
};

// ============================================================
// TELEMETRY & CONTROLLERS (Area Chart, Battery, Climate)
// ============================================================
function initTelemetryChart() {
  const wrapper = document.getElementById("chartCanvasWrapper");
  const scrubberLine = document.getElementById("chartScrubberLine");
  const dotSolar = document.getElementById("chartScrubberDotSolar");
  const dotLoad = document.getElementById("chartScrubberDotLoad");
  const tooltip = document.getElementById("chartTooltip");
  const tooltipTime = document.getElementById("tooltipTime");
  const tooltipVal = document.getElementById("tooltipVal");
  if (!wrapper || !scrubberLine) return;

  wrapper.addEventListener("mousemove", (e) => {
    const rect = wrapper.getBoundingClientRect();
    const x = Math.max(10, Math.min(rect.width - 10, e.clientX - rect.left));
    const pct = x / rect.width;

    const svgX = pct * 680;
    scrubberLine.setAttribute("x1", svgX);
    scrubberLine.setAttribute("x2", svgX);

    const hour = Math.floor(6 + pct * 16);
    const minute = Math.floor((pct * 16 % 1) * 60).toString().padStart(2, "0");
    const solarKw = (Math.max(0.2, Math.sin(pct * Math.PI) * 5.2)).toFixed(1);
    const loadKw = (1.8 + Math.cos(pct * Math.PI * 2) * 0.7).toFixed(1);

    const solarY = Math.max(25, 140 - (solarKw / 5.5) * 115);
    const loadY = Math.max(40, 140 - (loadKw / 5.5) * 115);

    if (dotSolar) {
      dotSolar.setAttribute("cx", svgX);
      dotSolar.setAttribute("cy", solarY);
    }
    if (dotLoad) {
      dotLoad.setAttribute("cx", svgX);
      dotLoad.setAttribute("cy", loadY);
    }

    if (tooltip) {
      tooltip.style.left = `${x}px`;
      if (tooltipTime) tooltipTime.textContent = `${hour}:${minute} (${pct > 0.4 && pct < 0.65 ? 'Peak Generation' : 'Normal Flow'})`;
      if (tooltipVal) tooltipVal.textContent = `Solar: ${solarKw} kW • Load: ${loadKw} kW`;
      tooltip.style.opacity = "1";
    }
  });

  wrapper.addEventListener("mouseleave", () => {
    if (tooltip) tooltip.style.opacity = "0.7";
  });
}

window.setBatteryMode = async function(mode) {
  const btnSelf = document.getElementById("btnSelfPowered");
  const btnBackup = document.getElementById("btnBackupOnly");
  const badge = document.getElementById("batteryStatusBadge");
  const flowRate = document.getElementById("batteryFlowRate");

  if (mode === "self_powered") {
    if (btnSelf) { btnSelf.classList.add("active"); btnSelf.setAttribute("aria-pressed", "true"); }
    if (btnBackup) { btnBackup.classList.remove("active"); btnBackup.setAttribute("aria-pressed", "false"); }
    if (badge) badge.textContent = "⚡ Self-Powered (+3.4 kW)";
    if (flowRate) flowRate.textContent = "+3.4 kW";
    showToast("Powerwall: Maximizing clean solar self-consumption", "success");
  } else {
    if (btnBackup) { btnBackup.classList.add("active"); btnBackup.setAttribute("aria-pressed", "true"); }
    if (btnSelf) { btnSelf.classList.remove("active"); btnSelf.setAttribute("aria-pressed", "false"); }
    if (badge) badge.textContent = "🛡️ 100% Backup Mode";
    if (flowRate) flowRate.textContent = "Idle (0 kW)";
    showToast("Powerwall: Reserve locked for weather resilience", "warning");
  }

  await window.toggleDeviceAction("solar_storage", "set_mode", mode);
};

function initClimateScrubber() {
  const rangeInput = document.getElementById("climateRangeInput");
  const tempDisplay = document.getElementById("currentTempDisplay");
  if (!rangeInput) return;

  rangeInput.addEventListener("input", (e) => {
    const val = parseFloat(e.target.value);
    if (tempDisplay) tempDisplay.textContent = val.toFixed(1);
  });

  rangeInput.addEventListener("change", (e) => {
    const val = parseFloat(e.target.value);
    window.toggleDeviceAction("thermostat", "set_temperature", val.toString());
  });
}

window.applyEcoComfortPreset = function() {
  const rangeInput = document.getElementById("climateRangeInput");
  const tempDisplay = document.getElementById("currentTempDisplay");
  if (rangeInput) rangeInput.value = 21.0;
  if (tempDisplay) tempDisplay.textContent = "21.0";
  window.toggleDeviceAction("thermostat", "set_temperature", "21");
  showToast("Eco Comfort Preset (21°C) applied", "success");
};

// Navigation Tab Switching
function initNavTabs() {
  const tabs = document.querySelectorAll(".nav-tab-btn");
  const views = document.querySelectorAll(".app-view");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const targetViewId = tab.getAttribute("data-view");

      tabs.forEach(t => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");

      views.forEach(v => {
        v.classList.remove("active");
        if (v.id === targetViewId) {
          v.classList.add("active");
        }
      });
    });
  });
}

async function fetchCurrentState() {
  try {
    const res = await fetch("/api/state");
    const state = await res.json();

    if (state.smartDevices) {
      renderDeviceMatrix(state.smartDevices);

      if (state.smartDevices.solar_storage) {
        const bat = state.smartDevices.solar_storage;
        const waveLevel = document.getElementById("liquidWaveLevel");
        const pctLabel = document.getElementById("batteryPctLabel");
        const flowLabel = document.getElementById("batteryFlowRate");
        if (waveLevel) waveLevel.style.height = `${bat.batteryLevel}%`;
        if (pctLabel) pctLabel.textContent = `${bat.batteryLevel}%`;
        if (flowLabel) flowLabel.textContent = `+${bat.chargeRateKw || 3.4} kW`;
      }

      if (state.smartDevices.thermostat) {
        const t = state.smartDevices.thermostat;
        const tempDisplay = document.getElementById("currentTempDisplay");
        const rangeInput = document.getElementById("climateRangeInput");
        if (tempDisplay && t.targetTemp) tempDisplay.textContent = t.targetTemp.toFixed(1);
        if (rangeInput && t.targetTemp) rangeInput.value = t.targetTemp;
      }
    }
  } catch (err) {
    console.warn("Could not fetch state:", err);
  }
}

// Event Listeners
micBtn.addEventListener("click", () => {
  if (!isListening && speechRecognizer) {
    speechRecognizer.start();
    showToast("Listening for voice input...", "info", 2500);
  } else if (isListening && speechRecognizer) {
    speechRecognizer.stop();
    setVoiceState("idle", "Ready • Enter command or click mic");
  } else {
    promptInput.focus();
    setVoiceState("listening", "Listening simulation active (Type command)");
    showToast("Type your command in the prompt bar", "info", 2500);
  }
});

promptForm.addEventListener("submit", (e) => {
  e.preventDefault();
  handleUserPrompt(promptInput.value);
});

document.querySelectorAll(".intent-chip").forEach(chip => {
  chip.addEventListener("click", () => {
    const prompt = chip.getAttribute("data-prompt");
    handleUserPrompt(prompt);
  });
});

// Model Controls & Quota Simulation Setup
function initModelControls() {
  if (quotaSimulateBtn) {
    quotaSimulateBtn.addEventListener("click", () => {
      simulateQuotaActive = !simulateQuotaActive;
      quotaSimulateBtn.classList.toggle("active", simulateQuotaActive);
      quotaSimulateBtn.setAttribute("aria-pressed", String(simulateQuotaActive));
      if (quotaSimulateLabel) {
        quotaSimulateLabel.textContent = simulateQuotaActive ? "Quota Reached (Active)" : "Simulate Quota Limit";
      }
      showToast(
        simulateQuotaActive
          ? "⚠️ Simulating Quota Limit on primary model! Next prompt will auto-switch models."
          : "Quota simulation disabled.",
        simulateQuotaActive ? "warning" : "info"
      );
    });
  }

  if (qfbCloseBtn && quotaFallbackBanner) {
    qfbCloseBtn.addEventListener("click", () => {
      quotaFallbackBanner.style.display = "none";
    });
  }

  if (modelSelect) {
    modelSelect.addEventListener("change", () => {
      const selected = modelSelect.value;
      const formatted = formatModelName(selected);
      if (bedrockPillText) bedrockPillText.textContent = `⚡ ${formatted}`;
      showToast(`Reasoning model preference set to: ${formatted}`, "info");
    });
  }
}

// Expose handlers on window
window.handleUserPrompt = handleUserPrompt;

// Boot application
initNavTabs();
setupSpeechRecognition();
connectStreamableHttp();
initModelControls();
fetchCurrentState();
initTelemetryChart();
initClimateScrubber();
