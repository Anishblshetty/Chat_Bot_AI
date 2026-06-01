// ── STATE ──
// Replace the value below with your Anthropic API key before deploying
const apiKey = 'YOUR_API_KEY_HERE';
let selectedTopic = 'All Topics';
let conversationHistory = [];

const SYSTEM_PROMPT = `You are AptiBot — an expert aptitude tutor helping students prepare for competitive exams (CAT, GATE, placements, banking exams).

Your role:
- Ask MCQ or subjective aptitude questions based on the topic requested.
- Provide clear, step-by-step solutions when the user answers.
- Explain underlying concepts when needed.
- Track the conversation context and give relevant follow-ups.
- Be encouraging and supportive.

Topics you cover: Number System, Percentages, Profit & Loss, Time & Work, Speed & Distance, Ratios & Proportions, Probability, Logical Reasoning, Data Interpretation.

When giving MCQ options, format them clearly as:
A) ...
B) ...
C) ...
D) ...

Always explain the solution fully with steps. Use simple language.`;

// ── TOPIC SELECT ──
document.getElementById('topicList').addEventListener('click', (e) => {
  const btn = e.target.closest('.topic-btn');
  if (!btn) return;
  document.querySelectorAll('.topic-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  selectedTopic = btn.dataset.topic;
  document.getElementById('topicLabel').textContent = '/ ' + selectedTopic;
});

// ── AUTO RESIZE TEXTAREA ──
function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}

function handleKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

function sendChip(text) {
  document.getElementById('userInput').value = text;
  sendMessage();
}

// ── APPEND MESSAGE ──
function appendMessage(role, html) {
  const welcome = document.getElementById('welcome');
  if (welcome) welcome.remove();

  const wrap = document.getElementById('messages');
  const div = document.createElement('div');
  div.className = `msg ${role}`;

  const avatar = document.createElement('div');
  avatar.className = 'avatar';
  avatar.textContent = role === 'bot' ? '🧠' : '👤';

  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.innerHTML = html;

  div.appendChild(avatar);
  div.appendChild(bubble);
  wrap.appendChild(div);
  wrap.scrollTop = wrap.scrollHeight;
  return bubble;
}

// ── TYPING INDICATOR ──
function showTyping() {
  const welcome = document.getElementById('welcome');
  if (welcome) welcome.remove();

  const wrap = document.getElementById('messages');
  const div = document.createElement('div');
  div.className = 'msg bot';
  div.id = 'typingMsg';

  const avatar = document.createElement('div');
  avatar.className = 'avatar';
  avatar.textContent = '🧠';

  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';

  div.appendChild(avatar);
  div.appendChild(bubble);
  wrap.appendChild(div);
  wrap.scrollTop = wrap.scrollHeight;
}

function removeTyping() {
  const t = document.getElementById('typingMsg');
  if (t) t.remove();
}

// ── FORMAT BOT TEXT ──
function formatText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>');
}

// ── SEND MESSAGE ──
async function sendMessage() {
  const input = document.getElementById('userInput');
  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  input.style.height = 'auto';
  document.getElementById('sendBtn').disabled = true;

  // Prepend topic context if a specific topic is selected
  const userMsg = selectedTopic !== 'All Topics'
    ? `[Topic: ${selectedTopic}] ${text}`
    : text;

  appendMessage('user', formatText(text));
  conversationHistory.push({ role: 'user', content: userMsg });
  showTyping();

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: conversationHistory
      })
    });

    const data = await res.json();
    removeTyping();

    if (data.error) {
      appendMessage('bot', `<span style="color:var(--warn)">⚠️ ${data.error.message}</span>`);
      conversationHistory.pop();
    } else {
      const reply = data.content[0].text;
      conversationHistory.push({ role: 'assistant', content: reply });
      appendMessage('bot', formatText(reply));
    }

  } catch (err) {
    removeTyping();
    appendMessage('bot', `<span style="color:var(--warn)">⚠️ Network error. Check your connection and API key.</span>`);
    conversationHistory.pop();
  }

  document.getElementById('sendBtn').disabled = false;
  input.focus();
}
