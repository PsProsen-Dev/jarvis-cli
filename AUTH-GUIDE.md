# 🔐 Jarvis - Multi-Provider Authentication Guide

Jarvis supports **7+ AI providers** with flexible authentication options!

---

## 🌐 Supported Providers

| Provider | Authentication | Best For | Cost |
|----------|---------------|----------|------|
| **ChatGPT** | OAuth | General coding, reasoning | Free/Paid |
| **Codex** | API Key / OAuth | Code-specific tasks | Paid |
| **Gemini** | API Key | Fast responses, free tier | Free/Paid |
| **Gemini OAuth** | Google OAuth | Enterprise features | Paid |
| **OpenRouter** | API Key | 100+ models access | Pay-per-use |
| **GitHub Copilot** | Device Login | Copilot subscribers | $10/mo |
| **Qwen** | API Key | Best for coding | Pay-per-use |

---

## 🚀 Quick Start

### Step 1: Login to a Provider

```bash
jarvis auth login
```

Interactive menu se provider select karo!

### Step 2: Check Status

```bash
jarvis auth status
```

### Step 3: Start Using

```bash
cd your-project
jarvis
```

---

## 🔓 ChatGPT (OAuth)

### Setup

```bash
jarvis auth login chatgpt
```

### Flow:
1. Browser automatically opens
2. Sign in with your OpenAI/ChatGPT account
3. Authorize Jarvis
4. Redirect back to terminal - Done! ✅

### Models Available:
- GPT-4
- GPT-4 Turbo
- GPT-4o
- ChatGPT-4o-latest

---

## 🤖 Codex (API Key / OAuth)

### Option 1: API Key

```bash
jarvis auth login codex
# Select "API Key" option
# Enter your Codex API key
```

### Option 2: ChatGPT OAuth (Recommended)

```bash
jarvis auth login codex
# Select "ChatGPT Auth" option
# Complete OAuth flow
```

### Models Available:
- **codexplan** - GPT-5.4 with high reasoning
- **codexspark** - GPT-5.3 for fast loops

---

## 💎 Gemini (API Key)

### Get API Key:
1. Visit: https://aistudio.google.com/apikey
2. Create API key (free tier available!)
3. Copy the key

### Setup:
```bash
jarvis auth login gemini
# Paste your API key
```

### Models Available:
- gemini-2.0-flash (Free tier: 60 RPM, 1000 RPD)
- gemini-2.5-pro
- gemini-3-flash-preview
- gemini-3.1-pro-preview

---

## 💎 Gemini (OAuth)

### Setup:
```bash
jarvis auth login gemini-oauth
```

### Flow:
1. Browser opens for Google sign-in
2. Grant generative-language API access
3. Token saved automatically

### Best For:
- Enterprise users
- Higher rate limits
- Google Workspace integration

---

## 🌐 OpenRouter (API Key)

### Get API Key:
1. Visit: https://openrouter.ai/keys
2. Create account / Sign in
3. Generate API key

### Setup:
```bash
jarvis auth login openrouter
# Paste your API key
```

### Models Available (100+):
- **OpenAI:** GPT-4, GPT-4 Turbo, GPT-4o
- **Anthropic:** Claude 3, Claude 3.5
- **Google:** Gemini Pro, Gemini Ultra
- **Meta:** Llama 3, Llama 3.1
- **Mistral:** Mistral Large, Mixtral
- **And 90+ more!**

---

## 🐙 GitHub Copilot (Device Login)

### Setup:
```bash
jarvis auth login github-copilot
```

### Flow:
1. Terminal shows a code (e.g., `ABCD-1234`)
2. Visit: https://github.com/login/device
3. Enter the code
4. Authorize Jarvis
5. Terminal auto-detects - Done! ✅

### Requirements:
- Active GitHub Copilot subscription ($10/month)
- GitHub account

### Best For:
- Existing Copilot users
- IDE integration + CLI combo

---

## 🤖 Qwen (API Key)

### Get API Key:
1. Visit: https://dashscope.console.aliyun.com/
2. Sign in / Create account
3. Get API key from console

### Setup:
```bash
jarvis auth login qwen
# Paste your API key
```

### Models Available:
- qwen-coder-plus (Best for coding)
- qwen-coder-turbo
- qwen-max
- qwen-plus

---

## 🔄 Switching Providers

### Interactive Switch:
```bash
jarvis auth login
# Select from menu
```

### Quick Switch (Configured Only):
```bash
# Coming soon: jarvis auth switch
```

### Command Line:
```bash
jarvis auth login gemini
jarvis auth login chatgpt
jarvis auth login openrouter
```

---

## 📊 View Status

### Check All Providers:
```bash
jarvis auth status
```

Output example:
```
🔐 Authentication Status

Provider                  Status      Active
─────────────────────────────────────────────
  🔓 chatgpt              ✓ Connected  ● Active
  🤖 codex                ✓ Connected  
  💎 gemini               ✓ Connected  
  💎 gemini-oauth         ○ Not set    
  🌐 openrouter           ○ Not set    
  🐙 github-copilot       ○ Not set    
  🤖 qwen                 ○ Not set    
```

### List All Providers:
```bash
jarvis auth list
```

---

## 🚪 Logout

### Logout from One Provider:
```bash
jarvis auth logout chatgpt
```

### Logout from All:
```bash
jarvis auth logout
```

---

## 🛠️ Environment Variables

Alternative to interactive setup:

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

---

## 🔒 Security Notes

- ✅ All tokens encrypted with AES-256-CBC
- ✅ Stored locally in `~/.config/jarvis-qwen-cli/`
- ✅ No data sent to external servers except provider APIs
- ✅ OAuth tokens auto-refresh when expired
- ✅ Device codes expire after 15 minutes (GitHub)

---

## ⚠️ Troubleshooting

### "OAuth timeout"
- Browser didn't redirect back? Close and retry
- Check if port 8085/8086 is available
- Try: `jarvis auth logout` then `jarvis auth login`

### "Invalid API key"
- Double-check for typos
- Ensure key has correct permissions
- Regenerate key from provider dashboard

### "Device code expired" (GitHub)
- Codes expire in 15 minutes
- Run `jarvis auth login github-copilot` again
- Complete authorization faster

### "Token refresh failed"
- Run `jarvis auth logout` then `jarvis auth login`
- Check if your subscription is active

---

## 📚 Provider Comparison

| Feature | ChatGPT | Codex | Gemini | OpenRouter | Copilot | Qwen |
|---------|---------|-------|--------|------------|---------|------|
| **Free Tier** | ✓ | ✗ | ✓ | ✗ | ✗ | ✗ |
| **OAuth** | ✓ | ✓ | ✓ | ✗ | ✓ | ✗ |
| **API Key** | ✗ | ✓ | ✓ | ✓ | ✗ | ✓ |
| **Code Quality** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Speed** | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Price** | Free/$20 | Paid | Free/$ | Pay/use | $10/mo | Pay/use |

---

## 🎯 Recommendations

### For Students:
- **Gemini (Free tier)** - Best for learning
- **ChatGPT (Free)** - Good for general help

### For Professionals:
- **GitHub Copilot** - Best value if you use IDE
- **OpenRouter** - Most models for the price

### For Teams:
- **Gemini OAuth** - Enterprise features
- **OpenRouter** - Shared credits

### For Coding:
- **Qwen** - Best code generation
- **Codex** - Specialized for code

---

**Happy Coding with Jarvis! 🤖✨**
