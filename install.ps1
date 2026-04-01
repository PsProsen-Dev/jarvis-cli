# ===================================================================
#  Jarvis By QWEN Code CLI - Installation Script
#  For Windows (PowerShell)
# ===================================================================

Write-Host ""
Write-Host "🤖 Jarvis - AI Coding Assistant" -ForegroundColor Cyan
Write-Host "   Powered by Qwen AI" -ForegroundColor Cyan
Write-Host ""

# Check for Node.js
try {
    $nodeVersion = node -v 2>&1
    Write-Host "✅ Node.js $nodeVersion detected" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

# Check npm
try {
    $npmVersion = npm -v 2>&1
    Write-Host "✅ npm $npmVersion detected" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not installed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Installing Jarvis CLI..." -ForegroundColor Cyan
Write-Host ""

# Install globally
npm install -g jarvis-qwen-cli

Write-Host ""
Write-Host "✅ Jarvis installed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Next steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  1. Initialize Jarvis with your API key:"
Write-Host "     jarvis init" -ForegroundColor Yellow
Write-Host ""
Write-Host "  2. Start using Jarvis in any project:"
Write-Host "     jarvis" -ForegroundColor Yellow
Write-Host ""
Write-Host "📖 Documentation: https://github.com/PsProsen-Dev/jarvis-qwen-cli" -ForegroundColor Cyan
Write-Host ""
