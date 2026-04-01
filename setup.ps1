# ===================================================================
#  Jarvis By QWEN Code CLI - Windows One-Line Installer
#  Usage: iwr https://jarvis.sh -useb | iex
# ===================================================================

# Colors
function Write-Header {
    Write-Host ""
    Write-Host "     ██████╗ ██╗      ██████╗ ████████╗███████╗" -ForegroundColor Cyan
    Write-Host "    ██╔════╝ ██║     ██╔═══██╗╚══██╔══╝██╔════╝" -ForegroundColor Cyan
    Write-Host "    ██║  ███╗██║     ██║   ██║   ██║   █████╗  " -ForegroundColor Cyan
    Write-Host "    ██║   ██║██║     ██║   ██║   ██║   ██╔══╝  " -ForegroundColor Cyan
    Write-Host "    ╚██████╔╝███████╗╚██████╔╝   ██║   ███████╗" -ForegroundColor Cyan
    Write-Host "     ╚═════╝ ╚══════╝ ╚═════╝    ╚═╝   ╚══════╝" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "    🤖 AI Coding Assistant for Your Terminal" -ForegroundColor Cyan
    Write-Host ""
}

function Write-Success {
    param($Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Error-Custom {
    param($Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Write-Info {
    param($Message)
    Write-Host "🔍 $Message" -ForegroundColor Cyan
}

function Write-Warning-Custom {
    param($Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

# Main
Write-Header

# Check Node.js
Write-Info "Checking prerequisites..."
try {
    $nodeVersion = node -v 2>&1
    $nodeMajor = $nodeVersion -replace 'v(\d+)\..*', '$1'
    
    if ([int]$nodeMajor -lt 18) {
        Write-Error-Custom "Node.js 18+ required (found: $nodeVersion)"
        Write-Host ""
        Write-Host "Please upgrade Node.js from: https://nodejs.org/" -ForegroundColor Yellow
        Write-Host ""
        exit 1
    }
    
    Write-Success "Node.js $nodeVersion"
} catch {
    Write-Error-Custom "Node.js not found"
    Write-Host ""
    Write-Host "Please install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

# Check npm
try {
    $npmVersion = npm -v 2>&1
    Write-Success "npm $npmVersion"
} catch {
    Write-Error-Custom "npm not found"
    exit 1
}

# Check git (optional)
try {
    $gitVersion = git --version 2>&1
    Write-Success "git $gitVersion"
} catch {
    Write-Warning-Custom "git not found (optional)"
}

Write-Host ""

# Install Jarvis
Write-Info "Installing Jarvis CLI..."
Write-Host ""

try {
    npm install -g jarvis-qwen-cli
} catch {
    Write-Error-Custom "Installation failed"
    Write-Host $_ -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Success "Jarvis installed successfully!"
Write-Host ""

# Show next steps
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Magenta
Write-Host "║           🚀 Jarvis Installation Complete!            ║" -ForegroundColor Magenta
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Magenta
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  1. Initialize with your API key:" -ForegroundColor White
Write-Host "     jarvis init" -ForegroundColor Green
Write-Host ""
Write-Host "  2. Start using in any project:" -ForegroundColor White
Write-Host "     cd your-project && jarvis" -ForegroundColor Green
Write-Host ""
Write-Host "  3. Try your first command:" -ForegroundColor White
Write-Host "     jarvis `"explain this codebase`"" -ForegroundColor Green
Write-Host ""
Write-Host "📖 Docs: https://github.com/PsProsen-Dev/jarvis-qwen-cli" -ForegroundColor Cyan
Write-Host ""
Write-Host "Happy Coding! 🤖✨" -ForegroundColor Green
Write-Host ""
