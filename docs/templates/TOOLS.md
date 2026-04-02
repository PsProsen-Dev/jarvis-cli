# 🛠️ Tools Configuration

**Version:** 1.0.0  
**Last Updated:** April 2, 2026

---

## 🔧 Available Tools

### Core CLI Commands

| Command | Description | Status |
|---------|-------------|--------|
| `jarvis auth login` | Authenticate with AI provider | ✅ Active |
| `jarvis auth logout` | Logout from provider | ✅ Active |
| `jarvis auth status` | Check authentication status | ✅ Active |
| `jarvis auth list` | List all providers | ✅ Active |
| `jarvis git commit` | Generate commit message | ✅ Active |
| `jarvis git status` | Git status with AI | ✅ Active |
| `jarvis code explain` | Explain code files | ✅ Active |
| `jarvis code refactor` | Refactor suggestions | ✅ Active |
| `jarvis plugins list` | List installed plugins | ✅ Active |
| `jarvis plugins init` | Create new plugin | ✅ Active |

---

## 🔐 Tool Permissions

### Auto-Approved (No Confirmation)

```bash
# Read operations
jarvis --help
jarvis auth status
jarvis auth list
jarvis git status
jarvis code explain <file>
jarvis search <query>

# Write operations (safe)
jarvis auth login
jarvis plugins init <name>
```

### Confirmation Required

```bash
# Potentially destructive
jarvis code refactor <file> --output <file>  # Overwrites files
jarvis git commit --all                       # Stages all changes
```

---

## ⚙️ Tool Configurations

### Git Commit Tool

```json
{
  "maxMessageLength": 72,
  "style": "conventional",
  "types": ["feat", "fix", "docs", "style", "refactor", "test", "chore"],
  "autoStage": false,
  "signoff": false
}
```

### Code Explanation Tool

```json
{
  "defaultDepth": "detailed",
  "language": "hinglish",
  "includeExamples": true,
  "maxFileLength": 500
}
```

### Refactoring Tool

```json
{
  "focusAreas": ["performance", "readability", "security"],
  "autoApply": false,
  "createBackup": true,
  "suggestMultiple": true
}
```

---

## 🔌 Plugin System

### Installed Plugins

| Plugin | Version | Status | Commands |
|--------|---------|--------|----------|
| [None yet] | - | - | - |

### Plugin Development

```bash
# Create new plugin
jarvis plugins init my-plugin

# Plugin structure
~/.jarvis/plugins/
└── my-plugin/
    ├── index.js       # Main plugin code
    ├── package.json   # Plugin metadata
    └── README.md      # Documentation
```

### Plugin Template

```javascript
// ~/.jarvis/plugins/my-plugin/index.js
module.exports = {
  name: 'my-plugin',
  version: '1.0.0',
  description: 'Plugin description',
  
  async init(jarvis) {
    console.log('Plugin loaded!');
  },
  
  async register(jarvis) {
    jarvis.addCommand('my-command', async (args) => {
      // Command implementation
      console.log('Command executed!');
    });
  }
};
```

---

## 🌐 AI Provider Tools

### Provider-Specific Commands

| Provider | Commands | Notes |
|----------|----------|-------|
| **ChatGPT** | OAuth flow | Browser required |
| **Gemini** | API key / OAuth | Free tier available |
| **GitHub Copilot** | Device login | Subscription required |
| **OpenRouter** | API key | 100+ models |
| **Qwen** | API key | Best for coding |

### Provider Switching

```bash
# Interactive selection
jarvis auth login

# Direct provider
jarvis auth login gemini
jarvis auth login chatgpt
jarvis auth login github-copilot
```

---

## 📊 Tool Usage Statistics

| Tool | Times Used | Last Used |
|------|------------|-----------|
| `jarvis auth login` | 0 | N/A |
| `jarvis git commit` | 0 | N/A |
| `jarvis code explain` | 0 | N/A |
| `jarvis search` | 0 | N/A |

---

## 🔧 Custom Tool Scripts

### Quick Aliases

Add to `~/.bashrc` or `~/.zshrc`:

```bash
# Jarvis shortcuts
alias j='jarvis'
alias jl='jarvis auth login'
alias js='jarvis auth status'
alias jg='jarvis git commit'
alias je='jarvis code explain'
```

### PowerShell Shortcuts

Add to `$PROFILE`:

```powershell
# Jarvis shortcuts
function j { jarvis $args }
function jl { jarvis auth login }
function js { jarvis auth status }
function jg { jarvis git commit }
function je { jarvis code explain }
```

---

## ⚠️ Tool Safety Notes

### Never Do Without Asking

1. Delete files outside workspace
2. Run `sudo` commands
3. Install system packages
4. Modify system configuration
5. Access credentials/secrets

### Always Log

1. API calls (excluding credentials)
2. File modifications
3. Git operations
4. External service calls

---

## 📝 Tool Request Log

| Date | Tool | Purpose | Status |
|------|------|---------|--------|
| 2026-04-02 | Initial setup | Template creation | ✅ Complete |

---

**_Add new tools and configurations as they become available._** 🔧

**Last Review:** April 2, 2026  
**Next Review:** May 2, 2026
