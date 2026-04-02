# 🧠 Memory System

**Version:** 1.0.0  
**Last Updated:** April 2, 2026

---

## 📋 Memory Structure

```
memory/
├── MEMORY.md                        # Long-term curated memory
├── heartbeat-state.json             # Background task state
├── 2026-04-02.md                    # Daily logs (YYYY-MM-DD format)
├── 2026-04-03.md
└── ...
```

---

## 📝 Memory Types

### Short-Term Memory (Daily Logs)

**Location:** `memory/YYYY-MM-DD.md`

**Purpose:** Raw activity logs, actions taken, decisions made

**Access:** All sessions (main + background)

**Retention:** 90 days (auto-archive older)

### Long-Term Memory (Curated)

**Location:** `MEMORY.md`

**Purpose:** Important learnings, user preferences, project insights

**Access:** Main sessions only (not background/group)

**Retention:** Permanent (manual curation)

### State Memory (System)

**Location:** `memory/heartbeat-state.json`

**Purpose:** Track last run times, pending tasks

**Access:** Background sessions

**Retention:** Until task completion

---

## 📖 Memory Writing Guidelines

### What to Log

✅ **Always Log:**
- Commands executed
- Files modified
- Errors encountered
- User decisions
- Important discoveries

❌ **Never Log:**
- API keys or credentials
- Personal sensitive data
- Full conversation transcripts (summarize instead)

### Format Standard

```markdown
## [Timestamp] - [Activity]

**Action:** What was done
**Result:** Outcome
**Learnings:** Key takeaways
**Tags:** #important #coding #debug
```

---

## 🔄 Memory Lifecycle

### Daily Flow

```
Morning Session → Load today's log
     ↓
During Session → Append actions
     ↓
End of Session → Review & tag important
     ↓
Weekly Review → Curate to MEMORY.md
```

### Weekly Curation (Sunday)

1. **Review** all daily logs from the week
2. **Extract** important learnings
3. **Update** MEMORY.md with insights
4. **Archive** old logs (90+ days)

---

## 🏷️ Tag System

### Tag Categories

| Tag | Purpose | Example |
|-----|---------|---------|
| `#important` | Critical learnings | Major discoveries |
| `#coding` | Code-related | New patterns learned |
| `#debug` | Debugging sessions | Bug fixes |
| `#user-pref` | User preferences | Communication style |
| `#project` | Project insights | Architecture decisions |
| `#error` | Errors & fixes | Common mistakes |

---

## 📊 Memory Access Rules

### Session Types

| Session Type | Daily Logs | MEMORY.md | State |
|--------------|------------|-----------|-------|
| **Main** | ✅ Read/Write | ✅ Read/Write | ✅ Read |
| **Background** | ✅ Write only | ❌ No access | ✅ Read/Write |
| **Group** | ❌ No access | ❌ No access | ✅ Read |

### Privacy Boundaries

```
┌─────────────────────────────────────────┐
│           Memory Access Levels          │
│                                         │
│  Public ←→ Private ←→ Confidential     │
│                                         │
│  Daily logs (90d) → MEMORY.md → Never  │
└─────────────────────────────────────────┘
```

---

## 🗄️ Example Daily Log

```markdown
# 2026-04-02 - Thursday

## 09:00 - Session Start

**Action:** Jarvis CLI initialization
**Result:** Templates created (AGENTS.md, SOUL.md, USER.md)
**Learnings:** OpenClaw templates integrate well with Jarvis
**Tags:** #important #project #jarvis

## 10:30 - Code Explanation

**Action:** Explained src/services/auth.ts to user
**Result:** User understood OAuth flow
**Learnings:** Prefer Hinglish for technical explanations
**Tags:** #user-pref #coding

## 14:00 - Git Commit

**Action:** Generated commit message for auth updates
**Result:** Commit pushed to GitHub
**Learnings:** Conventional commits working well
**Tags:** #coding #git

## 18:00 - Session End

**Summary:** 3 templates created, 1 commit pushed
**Pending:** Complete remaining templates
**Tags:** #summary
```

---

## 🧩 Curated Memory Example

```markdown
# Long-Term Memory

## User Preferences

- **Language:** Hinglish (70% Hindi + 30% English)
- **Tone:** Professional but friendly
- **Addressal:** "Sir" (context-dependent)
- **Emoji Usage:** Moderate, contextual

## Project Conventions

- **Git:** Conventional commits
- **Documentation:** Markdown with tables
- **Code Style:** TypeScript strict mode

## Important Learnings

### AI Provider Priority
1. Gemini (free tier) - General tasks
2. Qwen - Code generation
3. ChatGPT - Complex reasoning

### Jarvis CLI Architecture
- Multi-provider auth system
- Plugin-based extensibility
- Memory system for continuity
```

---

## ⚙️ Memory Configuration

```json
{
  "retention": {
    "dailyLogs": 90,
    "curated": "permanent",
    "state": "until-complete"
  },
  "access": {
    "mainSession": ["daily", "curated", "state"],
    "backgroundSession": ["daily-write", "state"],
    "groupSession": ["state"]
  },
  "curation": {
    "frequency": "weekly",
    "day": "sunday",
    "autoArchive": true
  }
}
```

---

## 🔒 Security Notes

### Memory Safety

1. **Never share MEMORY.md** in group chats
2. **Sanitize logs** before external sharing
3. **Encrypt** sensitive configurations
4. **Review** before committing to git

### Backup Strategy

```bash
# Weekly backup
cp -r memory/ ~/backups/jarvis-memory-$(date +%Y%m%d)/

# Monthly archive
tar -czf jarvis-memory-$(date +%Y%m).tar.gz memory/
```

---

## 📈 Memory Stats

| Metric | Value |
|--------|-------|
| **Total Daily Logs** | 1 |
| **Curated Entries** | 0 |
| **Oldest Log** | 2026-04-02 |
| **Storage Used** | < 1 MB |

---

**_Memory is the foundation of continuity. Write clearly, curate wisely._** 🧠

**Last Review:** April 2, 2026  
**Next Review:** April 9, 2026 (Weekly)
