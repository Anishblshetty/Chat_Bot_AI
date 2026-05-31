/* ============================================
   AptitudeAI — Script
   ============================================ */

// ─── State ───────────────────────────────────
const state = {
  apiKey: localStorage.getItem('gemini_api_key') || '',
  topic: 'General Aptitude',
  difficulty: 'Easy',
  correctCount: 0,
  wrongCount: 0,
  totalCount: 0,
  conversationHistory: [],
  awaitingAnswer: false,
};

// ─── DOM References ───────────────────────────
const messagesWrap  = document.getElementById('messagesWrap');
const messagesList  = document.getElementById('messagesList');
const welcomeCard   = document.getElementById('welcomeCard');
const userInput     = document.getElementById('userInput');
const sendBtn       = document.getElementById('sendBtn');
const apiKeyInput   = document.getElementById('apiKeyInput');
const saveApiKeyBtn = document.getElementById('saveApiKey');
const clearChatBtn  = document.getElementById('clearChat');
const statusBadge   = document.getElementById('statusBadge');
const quickQuestionBtn = document.getElementById('quickQuestion');
const startQuizBtn  = document.getElementById('startQuiz');

// Score elements
const correctCountEl  = document.getElementById('correctCount');
const wrongCountEl    = document.getElementById('wrongCount');
const totalCountEl    = document.getElementById('totalCount');
const accuracyPctEl   = document.getElementById('accuracyPct');

// ─── Init ─────────────────────────────────────
if (state.apiKey) {
  apiKeyInput.value = state.apiKey;
  setStatus('● Ready', 'ok');
}

// ─── Event Listeners ──────────────────────────

// Send on Enter
userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
});
sendBtn.addEventListener('click', handleSend);

// Auto-resize textarea
userInput.addEventListener('input', () => {
  userInput.style.height = 'auto';
  userInput.style.height = Math.min(userInput.scrollHeight, 120) + 'px';
});

// Save API key
saveApiKeyBtn.addEventListener('click', () => {
  const key = apiKeyInput.value.trim();
  if (key) {
    state.apiKey = key;
    localStorage.setItem('gemini_api_key', key);
    setStatus('● API Key Saved', 'ok');
    setTimeout(() => setStatus('● Ready', 'ok'), 2000);
  }
});

// Clear chat
clearChatBtn.addEventListener('click', () => {
  messagesList.innerHTML = '';
  welcomeCard.style.display = 'flex';
  state.conversationHistory = [];
  state.correctCount = 0;
  state.wrongCount   = 0;
  state.totalCount   = 0;
  updateScores();
});

// Topic buttons
document.querySelectorAll('.topic-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.topic-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.topic = btn.dataset.topic;
  });
});

// Difficulty buttons
document.querySelectorAll('.diff-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.difficulty = btn.dataset.diff;
  });
});

// Quick question & quiz buttons
quickQuestionBtn.addEventListener('click', () => {
  const msg = `Give me a ${state.difficulty} ${state.topic} question`;
  appendUserMessage(msg);
  callGemini(msg);
});

startQuizBtn.addEventListener('click', () => {
  const msg = `Start a 5-question ${state.difficulty} quiz on ${state.topic}. Ask one question at a time with 4 options (A, B, C, D). Wait for my answer before giving the next question.`;
  appendUserMessage(msg);
  callGemini(msg);
});

// Welcome chips
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    const msg = chip.dataset.msg;
    appendUserMessage(msg);
    callGemini(msg);
    hideWelcome();
  });
});

// ─── Core Functions ───────────────────────────

function handleSend() {
  const text = userInput.value.trim();
  if (!text) return;
  appendUserMessage(text);
  callGemini(text);
  userInput.value = '';
  userInput.style.height = 'auto';
  hideWelcome();
}

function hideWelcome() {
  if (welcomeCard) welcomeCard.style.display = 'none';
}

function setStatus(text, type = 'ok') {
  statusBadge.textContent = text;
  statusBadge.className = 'status-badge';
  if (type === 'loading') statusBadge.classList.add('loading');
  if (type === 'error')   statusBadge.classList.add('error');
}

function updateScores() {
  correctCountEl.textContent = state.correctCount;
  wrongCountEl.textContent   = state.wrongCount;
  totalCountEl.textContent   = state.totalCount;
  if (state.totalCount > 0) {
    const pct = Math.round((state.correctCount / state.totalCount) * 100);
    accuracyPctEl.textContent = pct + '%';
  } else {
    accuracyPctEl.textContent = '—';
  }
}

// ─── Message Rendering ────────────────────────

function appendUserMessage(text) {
  const div = document.createElement('div');
  div.className = 'message user';
  div.innerHTML = `
    <div class="avatar">U</div>
    <div class="bubble">${escapeHtml(text)}</div>
  `;
  messagesList.appendChild(div);
  scrollBottom();
  state.conversationHistory.push({ role: 'user', parts: [{ text }] });
}

function appendBotMessage(html, rawText) {
  const div = document.createElement('div');
  div.className = 'message bot';
  div.innerHTML = `
    <div class="avatar">🤖</div>
    <div class="bubble">${html}</div>
  `;
  messagesList.appendChild(div);
  scrollBottom();
  state.conversationHistory.push({ role: 'model', parts: [{ text: rawText || html }] });
}

function appendTypingIndicator() {
  const div = document.createElement('div');
  div.className = 'message bot';
  div.id = 'typingIndicator';
  div.innerHTML = `
    <div class="avatar">🤖</div>
    <div class="bubble">
      <div class="typing-indicator">
        <span></span><span></span><span></span>
      </div>
    </div>
  `;
  messagesList.appendChild(div);
  scrollBottom();
}

function removeTypingIndicator() {
  const el = document.getElementById('typingIndicator');
  if (el) el.remove();
}

function scrollBottom() {
  messagesWrap.scrollTop = messagesWrap.scrollHeight;
}

// ─── Gemini API Call ──────────────────────────

async function callGemini(userMessage) {
  if (!state.apiKey) {
    appendBotMessage(
      `<span style="color:var(--wrong)">⚠️ Please enter your Gemini API key in the sidebar first.</span><br>
       Get a free key at <a href="https://aistudio.google.com/app/apikey" target="_blank" style="color:var(--accent2)">Google AI Studio →</a>`,
      'No API key'
    );
    return;
  }

  setStatus('● Thinking…', 'loading');
  appendTypingIndicator();

  // Build system instruction
  const systemInstruction = buildSystemPrompt();

  // Build history (last 10 turns for context)
  const history = state.conversationHistory.slice(-20);

  const requestBody = {
    system_instruction: { parts: [{ text: systemInstruction }] },
    contents: history,
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 1024,
    }
  };

  const selectedModel = document.getElementById('modelSelect')?.value || 'gemini-1.5-flash-latest';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${state.apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    removeTypingIndicator();

    if (!response.ok) {
      const err = await response.json();
      const msg = err?.error?.message || 'Unknown API error';
      throw new Error(msg);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received.';

    // Parse and render response
    const parsed = parseResponse(rawText);
    appendBotMessage(parsed.html, rawText);
    setStatus('● Ready', 'ok');

  } catch (error) {
    removeTypingIndicator();
    const errMsg = error.message.includes('API_KEY_INVALID')
      ? 'Invalid API key. Please check and re-enter your Gemini API key.'
      : error.message;
    appendBotMessage(
      `<span style="color:var(--wrong)">❌ Error: ${escapeHtml(errMsg)}</span>`,
      errMsg
    );
    setStatus('● Error', 'error');
    setTimeout(() => setStatus('● Ready', 'ok'), 3000);
  }
}

// ─── System Prompt ────────────────────────────

function buildSystemPrompt() {
  return `You are AptitudeAI, an expert aptitude and reasoning tutor. Your role is to:
1. Generate high-quality aptitude questions on the topic: "${state.topic}" at "${state.difficulty}" difficulty.
2. Provide clear, step-by-step explanations for all solutions.
3. Format multiple-choice questions clearly with options A, B, C, D.
4. When a user answers a question, verify if they're correct or wrong and explain why.
5. Keep track of the conversation context to maintain quiz flow.
6. Be encouraging and educational.

FORMATTING RULES:
- For MCQ options, start each on a new line like: A) option, B) option, C) option, D) option
- Use **bold** for important terms, answers, and key concepts
- Use "✅ Correct!" or "❌ Wrong!" when evaluating answers
- For explanations, start with "💡 Explanation:"
- Keep responses concise but complete

TOPICS YOU COVER: Quantitative Aptitude, Logical Reasoning, Verbal Aptitude, Data Interpretation, Number Series, Percentages, Ratios, Time & Work, Profit & Loss, Probability, Permutations & Combinations, Blood Relations, Syllogisms, Coding-Decoding, Direction Sense, and more.

Always maintain an encouraging, supportive tone. If the user seems stuck, offer hints.`;
}

// ─── Response Parser ──────────────────────────

function parseResponse(text) {
  let html = escapeHtml(text);

  // Bold: **text**
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Italic: *text*
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Inline code: `code`
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Newlines to <br>
  html = html.replace(/\n/g, '<br>');

  // Detect MCQ options: lines like "A) text" or "A. text"
  const hasOptions = /[A-D][).]\s/.test(text);
  if (hasOptions) {
    html = renderMCQOptions(text, html);
  }

  // Detect correct/wrong indicators
  if (text.includes('✅ Correct') || text.includes('Correct!')) {
    state.correctCount++;
    state.totalCount++;
    updateScores();
  } else if (text.includes('❌ Wrong') || text.includes('Wrong!') || text.includes('Incorrect')) {
    state.wrongCount++;
    state.totalCount++;
    updateScores();
  }

  return { html };
}

function renderMCQOptions(rawText, formattedHtml) {
  // Extract the preamble (question text before options)
  const lines = rawText.split('\n');
  const optionRegex = /^([A-D])[).]\s+(.+)$/i;

  let questionLines = [];
  let options = [];
  let postLines = [];
  let inOptions = false;
  let optionsDone = false;

  lines.forEach(line => {
    const match = line.match(optionRegex);
    if (match && !optionsDone) {
      inOptions = true;
      options.push({ label: match[1].toUpperCase(), text: match[2] });
    } else if (inOptions && !match) {
      optionsDone = true;
      if (line.trim()) postLines.push(line);
    } else if (!inOptions) {
      questionLines.push(line);
    } else {
      if (line.trim()) postLines.push(line);
    }
  });

  if (options.length < 2) return formattedHtml;

  // Build HTML
  let qHtml = questionLines.map(l => escapeHtml(l)).join('<br>');
  qHtml = qHtml.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  let optionsHtml = `<ul class="options-list" id="opts_${Date.now()}">`;
  options.forEach(opt => {
    optionsHtml += `
      <li class="option-item" onclick="handleOptionClick(this, '${escapeAttr(opt.label)}', '${escapeAttr(opt.text)}')">
        <span class="option-tag">${opt.label}</span>
        <span>${escapeHtml(opt.text)}</span>
      </li>`;
  });
  optionsHtml += '</ul>';

  let postHtml = postLines.map(l => escapeHtml(l)).join('<br>');
  postHtml = postHtml.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  return qHtml + optionsHtml + (postHtml ? `<br>${postHtml}` : '');
}

// ─── Option Click Handler ─────────────────────

function handleOptionClick(el, label, text) {
  const list = el.closest('.options-list');
  if (!list) return;

  // Disable all options
  list.querySelectorAll('.option-item').forEach(item => {
    item.classList.add('disabled');
  });

  // Send answer to bot
  const userMsg = `My answer is ${label}) ${text}`;
  appendUserMessage(userMsg);
  callGemini(userMsg);
  hideWelcome();
}

// ─── Utility Functions ────────────────────────

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(str) {
  return str.replace(/'/g, "\\'").replace(/"/g, '\\"');
}

// ─── Load saved API key into input ────────────
if (state.apiKey) {
  apiKeyInput.value = state.apiKey;
}
