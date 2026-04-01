# 🤖 Jarvis By QWEN Code CLI

> **Your AI Coding Assistant in the Terminal** — Powered by Multiple AI Providers

[![npm version](https://img.shields.io/npm/v/jarvis-qwen-cli.svg)](https://www.npmjs.com/package/jarvis-qwen-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node version](https://img.shields.io/node/v/jarvis-qwen-cli.svg)](https://nodejs.org/)

---

## ✨ Features

- 🌐 **Multi-Provider Support** — ChatGPT, Codex, Gemini, OpenRouter, GitHub Copilot, Qwen
- 🔐 **Flexible Auth** — OAuth, API Key, Device Login options
- 🧠 **Code Explanation** — Complex code ko simple bhasha mein samjho
- 💡 **Refactoring Suggestions** — Code improve karne ke tips
- 📝 **Smart Git Commits** — Auto-generate meaningful commit messages
- 🔍 **Code Search** — Apne codebase mein kuch bhi dhundo
- 🤖 **Hinglish Support** — Hindi + English mein baat karo
- 🔌 **Plugin System** — Custom commands banao
- 📊 **Project Analysis** — Codebase insights paao

---

## 🚀 Quick Install

### macOS / Linux

```bash
curl -fsSL https://raw.githubusercontent.com/PsProsen-Dev/jarvis-qwen-cli/main/install.sh | bash
```

### Windows (PowerShell)

```powershell
iwr https://raw.githubusercontent.com/PsProsen-Dev/jarvis-qwen-cli/main/install.ps1 -useb | iex
```

### Manual Install (npm)

```bash
npm install -g jarvis-qwen-cli
```

---

## 📖 Setup

### 1️⃣ Authenticate with Your Provider

```bash
jarvis auth login
```

Interactive menu se provider select karo:

- 🔓 **ChatGPT** - OAuth (Free/Paid)
- 🤖 **Codex** - API Key / OAuth (Paid)
- 💎 **Gemini** - API Key (Free tier available!)
- 💎 **Gemini OAuth** - Google OAuth (Enterprise)
- 🌐 **OpenRouter** - API Key (100+ models)
- 🐙 **GitHub Copilot** - Device Login ($10/mo)
- 🤖 **Qwen** - API Key (Best for coding)

### 2️⃣ Check Status

```bash
jarvis auth status
```

### 3️⃣ Start Using

```bash
cd your-project
jarvis
```

---

## 🎯 Usage

### Interactive Mode

```bash
cd your-project
jarvis
```

Then start chatting:

```
jarvis> is file ko explain karo
jarvis> commit message bana do
jarvis> search for "useEffect"
jarvis> status dikhao
```

### Direct Commands

```bash
# Explain a file
jarvis "explain src/app.ts"

# Git commit
jarvis git commit

# Git status
jarvis git status

# Search codebase
jarvis "search for authentication"

# Refactor code
jarvis "refactor src/utils.ts"
```

---

## 📋 Commands

| Command | Description |
|---------|-------------|
| `jarvis` | Start interactive session |
| `jarvis auth login` | Authenticate with AI provider |
| `jarvis auth status` | Check auth status |
| `jarvis auth logout` | Logout from provider |
| `jarvis auth list` | List all providers |
| `jarvis <prompt>` | Chat with Jarvis |
| `jarvis git commit` | Generate commit message |
| `jarvis git status` | Show git status |
| `jarvis code explain <file>` | Explain code file |
| `jarvis code refactor <file>` | Get refactoring tips |
| `jarvis plugins list` | List installed plugins |
| `jarvis plugins init <name>` | Create new plugin |
| `jarvis doctor` | Check installation health |

---

## 💬 Example Session

```
🤖 Welcome to Jarvis - Your AI Coding Assistant!
   Type "help" for commands, "exit" to quit

jarvis> is file ko explain karo: src/index.ts

📖 Explanation:

Yeh file ek Express.js server setup kar rahi hai...
```

---

## 🔌 Plugin System

Create custom plugins:

```bash
jarvis plugins init my-plugin
```

This creates a plugin template at `~/.jarvis/plugins/my-plugin/`

### Example Plugin

```javascript
// ~/.jarvis/plugins/my-plugin/index.js
module.exports = {
  name: 'my-plugin',
  version: '1.0.0',
  
  async register(jarvis) {
    jarvis.addCommand('hello', async () => {
      console.log('Hello from my plugin!');
    });
  }
};
```

---

## ⚙️ Configuration

### Environment Variables

```bash
# ChatGPT
export CHATGPT_ACCESS_TOKEN="your-token"

# Codex
export CODEX_API_KEY="your-key"

# Gemini
export GEMINI_API_KEY="your-key"

# OpenRouter
export OPENROUTER_API_KEY="your-key"

# GitHub Copilot
export GITHUB_COPILOT_TOKEN="your-token"

# Qwen
export QWEN_API_KEY="your-key"
```

### Config File

Location: `~/.config/jarvis-qwen-cli/`

All authentication tokens are stored encrypted here.

---

## 🛠️ Development

### Clone & Install

```bash
git clone https://github.com/PsProsen-Dev/jarvis-qwen-cli.git
cd jarvis-qwen-cli
npm install
npm run build
npm link
```

### Commands

```bash
npm run dev      # Run in development mode
npm run build    # Build for production
npm run test     # Run tests
npm run lint     # Lint code
```

---

## 📚 Supported Languages

Jarvis understands code in:

- TypeScript / JavaScript
- Python
- Java
- C / C++
- Go
- Rust
- Ruby
- PHP
- SQL
- And more!

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repo
2. Create a branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License — see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with ❤️ by **Prosenjit Paul (PsProsen-Dev)**
- Powered by **Qwen AI** from Alibaba Cloud
- Inspired by **Jarvis** from Iron Man

---

## 📞 Support

- **Issues:** https://github.com/PsProsen-Dev/jarvis-qwen-cli/issues
- **Discussions:** https://github.com/PsProsen-Dev/jarvis-qwen-cli/discussions

---

**Happy Coding! 🚀**
