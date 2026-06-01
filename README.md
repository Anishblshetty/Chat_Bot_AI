# 🧠 AptiBot — AI Aptitude Prep Chatbot

A lightweight, browser-based aptitude question chatbot powered by the **Anthropic Claude API**. Built with plain HTML, CSS, and JavaScript — no frameworks, no installation required.

---

## 📁 Project Structure

```
AptiBot/
├── index.html   → App layout and markup
├── style.css    → All styles and animations
└── script.js    → Chat logic and API integration
```

---

## ⚙️ Setup Instructions

### 1. Get your Anthropic API Key
- Go to [https://console.anthropic.com](https://console.anthropic.com)
- Sign in or create an account
- Navigate to **API Keys** and generate a new key
- Copy the key (starts with `sk-ant-...`)

### 2. Add your API Key to the project
Open `script.js` and replace the placeholder on line 3:

```js
const apiKey = 'YOUR_API_KEY_HERE';
```

Replace it with your actual key:

```js
const apiKey = 'sk-ant-api03-xxxxxxxxxxxxxxxxxxxx';
```

### 3. Run the chatbot
Simply open `index.html` in any modern browser — no server or build step needed.

```
Double-click index.html  →  Opens in browser  →  Start chatting!
```

---

## 💬 Features

- **9 Aptitude Topics** — Number System, Percentages, Profit & Loss, Time & Work, Speed & Distance, Ratios & Proportions, Probability, Logical Reasoning, Data Interpretation
- **Multi-turn conversation** — follow-up questions and contextual answers
- **Quick-start chips** — jump straight into practice with one click
- **Step-by-step solutions** — every answer explained clearly
- **Typing indicator** — visual feedback while the AI responds
- **Responsive design** — works on desktop and mobile browsers

---

## 🗂️ Topics Covered

| Topic | Example Questions |
|---|---|
| Number System | LCM, HCF, divisibility rules |
| Percentages | Increase/decrease, successive % |
| Profit & Loss | SP, CP, discount, markup |
| Time & Work | Combined work, pipes & cisterns |
| Speed & Distance | Relative speed, trains, boats |
| Ratios & Proportions | Direct/inverse proportion |
| Probability | Basic, conditional, combinations |
| Logical Reasoning | Syllogisms, sequences, puzzles |
| Data Interpretation | Tables, bar charts, pie charts |

---

## 🔐 API Key Security Note

- The API key is stored **only in `script.js`** — it is never displayed in the browser UI
- Do **not** share your `script.js` file publicly with the key inside
- Do **not** commit the key to GitHub — add `script.js` to `.gitignore` or use environment variables if deploying to a server

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 |
| Styling | CSS3 (custom properties, flexbox, grid, animations) |
| Logic | Vanilla JavaScript (ES6+) |
| AI Model | Claude Sonnet (`claude-sonnet-4-20250514`) |
| Fonts | Syne + DM Mono (Google Fonts) |

---

## 📋 Requirements

- Any modern browser (Chrome, Firefox, Edge, Safari)
- Active internet connection (for Google Fonts + Anthropic API)
- A valid Anthropic API key

---

## 🚀 How to Use

1. Open `index.html` in your browser
2. Select a topic from the sidebar, or leave it on **All Topics**
3. Click a quick-start chip or type your own message
4. Press **Enter** to send (Shift+Enter for a new line)
5. Read the step-by-step solution and ask follow-up questions

---

## 📄 License

This project is for educational purposes.  
Built as part of a Human-Centered AI coursework project — Acharya Institute of Technology, VTU.
