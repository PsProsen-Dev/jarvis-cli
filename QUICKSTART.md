# 🚀 Jarvis CLI - Quick Start Guide

## Installation (One Line)

### macOS / Linux
```bash
curl -fsSL https://raw.githubusercontent.com/PsProsen-Dev/jarvis-qwen-cli/main/setup.sh | bash
```

### Windows (PowerShell)
```powershell
iwr https://raw.githubusercontent.com/PsProsen-Dev/jarvis-qwen-cli/main/setup.ps1 -useb | iex
```

### Manual (npm)
```bash
npm install -g jarvis-qwen-cli
```

---

## Setup (2 Steps)

### 1️⃣ Initialize API Key
```bash
jarvis init
```

Enter your Qwen AI API key (get from: https://dashscope.console.aliyun.com/)

### 2️⃣ Start Using
```bash
cd your-project
jarvis
```

---

## Commands Cheat Sheet

| Command | What It Does |
|---------|--------------|
| `jarvis` | Interactive mode start |
| `jarvis "explain src/app.ts"` | Code explain karo |
| `jarvis git commit` | Commit message banao |
| `jarvis git status` | Git status dekho |
| `jarvis "search for login"` | Codebase search |
| `jarvis "refactor utils.ts"` | Refactoring tips |
| `jarvis plugins list` | Plugins dekho |
| `jarvis doctor` | Health check |

---

## Interactive Mode Commands

```
jarvis> explain <file>     - File explain karo
jarvis> refactor <file>    - Refactoring suggestions
jarvis> commit             - Commit message generate
jarvis> status             - Git status
jarvis> search <query>     - Codebase search
jarvis> chat <message>     - Normal baat cheet
jarvis> help               - Help dikhao
jarvis> exit               - Exit
```

---

## Example Session

```bash
$ cd my-react-app
$ jarvis

🤖 Welcome to Jarvis - Your AI Coding Assistant!
   Type "help" for commands, "exit" to quit

jarvis> is project ko explain karo

📖 Project Analysis:

Yeh ek React + TypeScript project hai...
```

---

## Environment Variables

```bash
# ~/.bashrc or ~/.zshrc (macOS/Linux)
export QWEN_API_KEY="your-key-here"

# $PROFILE (Windows PowerShell)
$env:QWEN_API_KEY="your-key-here"
```

---

## Plugin Development

```bash
# Create plugin
jarvis plugins init my-plugin

# Plugin location
~/.jarvis/plugins/my-plugin/

# Edit index.js to add commands
```

---

## Troubleshooting

### "Command not found: jarvis"
```bash
# Add npm global bin to PATH
export PATH="$PATH:$(npm config get prefix)/bin"
```

### "API key not found"
```bash
jarvis init
```

### "Node version error"
```bash
# Upgrade Node.js to 18+
# macOS: brew upgrade node
# Linux: see https://nodejs.org
```

---

## Support

- 📖 Docs: https://github.com/PsProsen-Dev/jarvis-qwen-cli
- 💬 Issues: https://github.com/PsProsen-Dev/jarvis-qwen-cli/issues
- 🗨️ Discussions: https://github.com/PsProsen-Dev/jarvis-qwen-cli/discussions

---

**Made with ❤️ by Prosenjit Paul (PsProsen-Dev)**
