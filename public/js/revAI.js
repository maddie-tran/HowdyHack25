// revAI.js
console.log("🐾 Reveille AI script loaded");

const input = document.getElementById("userPrompt");
const sendBtn = document.getElementById("sendPrompt");
const output = document.getElementById("aiResponse");

async function sendMessage() {
  const prompt = input.value.trim();
  if (!prompt) return;

  // Display user message
  output.innerHTML += `<div class="user-msg"><b>🧑‍🎓 You:</b> ${prompt}</div>`;
  input.value = "";

  try {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();

    if (data.reply) {
      output.innerHTML += `<div class="ai-msg"><b>🐶 Reveille:</b> ${data.reply}</div>`;
    } else {
      output.innerHTML += `<div class="ai-msg error">⚠️ No reply received.</div>`;
    }
  } catch (err) {
    console.error("Fetch error:", err);
    output.innerHTML += `<div class="ai-msg error">❌ ${err.message}</div>`;
  }

  output.scrollTop = output.scrollHeight;
}

// Event listeners
sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
