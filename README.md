# AptitudeAI — Aptitude Chatbot

A beautiful, AI-powered aptitude practice chatbot using the **FREE Gemini API**.

## 🚀 Setup

### Step 1: Get Your Free Gemini API Key
1. Go to **https://aistudio.google.com/app/apikey**
2. Sign in with your Google account (it's free!)
3. Click **"Create API Key"**
4. Copy the key

### Step 2: Run the Chatbot
1. Open the folder in **VS Code**
2. Open `index.html`
3. Right-click → **"Open with Live Server"** (install the Live Server extension if needed)
   - OR just double-click `index.html` to open it in your browser
4. Paste your API key in the **sidebar → GEMINI API KEY** field
5. Click the ✓ button to save it

## 🎓 Features

| Feature | Description |
|---|---|
| 🧠 6 Topics | General, Quantitative, Logical, Verbal, Data Interpretation, Coding |
| 🎯 3 Difficulty Levels | Easy, Medium, Hard |
| ⚡ Quick Question | Get a random question instantly |
| 🎯 Start Quiz | 5-question interactive quiz session |
| 📊 Score Tracker | Live accuracy tracking |
| 💡 Explanations | Step-by-step solutions |
| 🖱️ Clickable Options | Click MCQ options directly |

## 📁 File Structure
```
aptitude-chatbot/
├── index.html   ← Main HTML structure
├── style.css    ← All styles & animations
├── script.js    ← Logic & Gemini API integration
└── README.md    ← This file
```

## 🔑 API Key Info
- The Gemini 1.5 Flash model is used (fast & free tier available)
- Your API key is saved in your browser's localStorage
- Free tier: ~15 requests/minute, 1 million tokens/day

## 💡 Tips
- Type "explain [concept]" for concept explanations
- Type "give me a hint" when stuck on a question
- Use topic buttons on the sidebar to focus on a specific area
