# 📚 Jarvis CLI - Template Integration Guide

**Based on:** OpenClaw Documentation Templates  
**Integration Date:** April 2, 2026  
**Status:** ✅ Complete

---

## 🎯 Overview

This guide explains how to use OpenClaw-style templates in Jarvis CLI for consistent AI agent behavior and documentation.

---

## 📁 Template Files

| Template | Purpose | Location |
|----------|---------|----------|
| `AGENTS.md` | Agent protocols & instructions | `docs/templates/` |
| `SOUL.md` | Core identity & values | `docs/templates/` |
| `USER.md` | User preferences | `docs/templates/` |
| `HEARTBEAT.md` | Background tasks | `docs/templates/` |
| `TOOLS.md` | Tool configurations | `docs/templates/` |
| `MEMORY.md` | Memory structure | `docs/templates/` |

---

## 🚀 Quick Start

### 1. Copy Templates to Workspace

```bash
# From Jarvis CLI root
cp docs/templates/*.md /path/to/your/project/
```

### 2. Customize for Your Project

Edit each template:
- `AGENTS.md` - Update tool permissions
- `SOUL.md` - Define your agent's identity
- `USER.md` - Add your preferences
- `HEARTBEAT.md` - Set your reminders

### 3. Initialize Memory System

```bash
mkdir memory
touch memory/$(date +%Y-%m-%d).md
```

### 4. Start Jarvis

```bash
jarvis
```

---

## 📖 Template Usage

### AGENTS.md - Agent Configuration

**When to Use:**
- Setting up new workspace
- Defining agent behavior
- Establishing safety rules

**Key Sections:**
```markdown
## Agent Identity
## Session Startup Protocol
## Available Tools
## Safety Rules (Red Lines)
## Memory System
## Heartbeat System
## Communication Protocol
```

**Customization:**
- Update tool list for your project
- Define project-specific safety rules
- Add workflow examples

---

### SOUL.md - Agent Identity

**When to Use:**
- Defining agent personality
- Establishing ethical framework
- Setting long-term goals

**Key Sections:**
```markdown
## Core Identity
## Mission Statement
## Operating Principles
## Communication Ethos
## Ethical Framework
## Mental Models
## Personality Traits
```

**Customization:**
- Define your agent's name and personality
- Set communication style (language, tone)
- Establish ethical boundaries

---

### USER.md - User Profile

**When to Use:**
- Onboarding new users
- Documenting preferences
- Setting up workspace

**Key Sections:**
```markdown
## Basic Information
## Technical Profile
## Work Preferences
## Tool Preferences
## Learning Goals
## Security & Privacy
```

**Customization:**
- Add your technical stack
- Define communication preferences
- Set notification preferences

---

### HEARTBEAT.md - Background Tasks

**When to Use:**
- Setting up recurring tasks
- Managing reminders
- Tracking background operations

**Key Sections:**
```markdown
## Task Checklist
## Schedule Configuration
## Alert Thresholds
## Pending Reminders
## Heartbeat State
```

**Customization:**
- Add your recurring tasks
- Set your active hours
- Define alert priorities

---

### TOOLS.md - Tool Configuration

**When to Use:**
- Documenting available tools
- Setting tool permissions
- Configuring plugins

**Key Sections:**
```markdown
## Available Tools
## Tool Permissions
## Tool Configurations
## Plugin System
## Custom Scripts
```

**Customization:**
- List your project's tools
- Define permission levels
- Add custom aliases

---

### MEMORY.md - Memory Structure

**When to Use:**
- Setting up memory system
- Defining memory types
- Establishing curation process

**Key Sections:**
```markdown
## Memory Structure
## Memory Types
## Memory Writing Guidelines
## Memory Lifecycle
## Tag System
## Access Rules
```

**Customization:**
- Set retention periods
- Define tag categories
- Establish curation schedule

---

## 🔧 Integration with Jarvis CLI

### Step 1: Load Templates at Startup

Jarvis CLI automatically looks for these files in workspace root:

```typescript
// Jarvis reads these before every session
const configFiles = [
  'AGENTS.md',
  'SOUL.md', 
  'USER.md',
  'HEARTBEAT.md',
  'TOOLS.md',
  'MEMORY.md'
];
```

### Step 2: Parse Template Sections

```typescript
// Example: Parse AGENTS.md
function parseAgentsMD(content: string) {
  const sections = content.split(/^## /m);
  return {
    identity: extractSection(sections, 'Agent Identity'),
    tools: extractSection(sections, 'Available Tools'),
    safety: extractSection(sections, 'Safety Rules')
  };
}
```

### Step 3: Apply Configuration

```typescript
// Apply agent protocols
if (config.safety.includes('No destructive commands')) {
  blockCommand('rm -rf');
}

// Apply communication style
if (config.communication.language === 'hinglish') {
  setLanguage('hinglish');
}
```

---

## 📊 Template Inheritance

```
OpenClaw Templates (Source)
         ↓
Jarvis Templates (Adapted)
         ↓
Your Project Templates (Customized)
```

### What to Keep from OpenClaw

✅ **Keep:**
- Overall structure
- Safety principles
- Memory system design
- Heartbeat concept

### What to Customize

✅ **Change:**
- Agent identity (SOUL.md)
- User preferences (USER.md)
- Tool list (TOOLS.md)
- Project workflows

---

## 🎯 Best Practices

### 1. Start Minimal

```bash
# Essential templates only
cp docs/templates/{AGENTS,SOUL,USER}.md ./
```

### 2. Iterate Gradually

```
Week 1: AGENTS.md + SOUL.md
Week 2: USER.md + TOOLS.md
Week 3: HEARTBEAT.md + MEMORY.md
```

### 3. Review Regularly

```bash
# Weekly review
every sunday:
  - Review AGENTS.md (update protocols)
  - Review USER.md (update preferences)
  - Curate MEMORY.md
```

---

## 🔍 Example: Full Integration

### Project Structure

```
my-project/
├── AGENTS.md              # ← Copied from templates
├── SOUL.md                # ← Copied from templates
├── USER.md                # ← Copied from templates
├── HEARTBEAT.md           # ← Copied from templates
├── TOOLS.md               # ← Copied from templates
├── MEMORY.md              # ← Copied from templates
├── memory/
│   ├── 2026-04-02.md      # Daily logs
│   └── heartbeat-state.json
└── src/                   # Your code
```

### Session Flow

```
1. User runs: jarvis
2. Jarvis loads: AGENTS.md, SOUL.md, USER.md
3. Jarvis checks: HEARTBEAT.md for pending tasks
4. Jarvis reads: memory/YYYY-MM-DD.md for context
5. Jarvis executes user's command
6. Jarvis logs action to memory
```

---

## ⚠️ Common Pitfalls

### ❌ Don't Over-Engineer

```markdown
# Bad: Too many rules upfront
## Rules (500 lines)
...

# Good: Start minimal, evolve
## Rules
1. Ask before destructive actions
2. Log everything
3. Use Hinglish
```

### ❌ Don't Ignore Memory

```markdown
# Bad: No memory system
[No memory/ folder]

# Good: Daily logs + curation
memory/
├── 2026-04-02.md
└── MEMORY.md
```

### ❌ Don't Set and Forget

```markdown
# Bad: Never update templates
Last Review: 2026-04-02 (never updated)

# Good: Monthly reviews
Last Review: 2026-05-02 (updated protocols)
```

---

## 📈 Migration from OpenClaw

### Step-by-Step

1. **Clone OpenClaw Templates**
   ```bash
   git clone https://github.com/openclaw/openclaw.git
   cp openclaw/docs/reference/templates/*.md ./
   ```

2. **Adapt for Jarvis CLI**
   - Replace `oca` commands with `jarvis`
   - Update agent identity
   - Customize for your workflow

3. **Test Integration**
   ```bash
   jarvis
   # Verify templates load correctly
   ```

4. **Deploy to GitHub**
   ```bash
   git add *.md
   git commit -m "docs: Add agent templates"
   git push
   ```

---

## 🎓 Learning Resources

### OpenClaw Documentation
- [AGENTS.md Guide](https://github.com/openclaw/openclaw/tree/main/docs/reference)
- [Template Structure](https://github.com/openclaw/openclaw/tree/main/docs/reference/templates)

### Jarvis CLI Documentation
- [README.md](../README.md)
- [AUTH-GUIDE.md](../AUTH-GUIDE.md)
- [QUICKSTART.md](../QUICKSTART.md)

---

## 📝 Template Update Log

| Date | Template | Changes |
|------|----------|---------|
| 2026-04-02 | All | Initial integration from OpenClaw |
| | | |

---

**_Templates are living documents. Evolve them as your workflow evolves._** 🚀

**Last Review:** April 2, 2026  
**Next Review:** May 2, 2026
