#!/usr/bin/env bash

# ===================================================================
#  Jarvis By QWEN Code CLI - One-Line Installer
#  Usage: curl -fsSL https://jarvis.sh | bash
# ===================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

# ASCII Art
show_banner() {
    echo -e "${CYAN}"
    cat << "EOF"
     ██████╗ ██╗      ██████╗ ████████╗███████╗
    ██╔════╝ ██║     ██╔═══██╗╚══██╔══╝██╔════╝
    ██║  ███╗██║     ██║   ██║   ██║   █████╗  
    ██║   ██║██║     ██║   ██║   ██║   ██╔══╝  
    ╚██████╔╝███████╗╚██████╔╝   ██║   ███████╗
     ╚═════╝ ╚══════╝ ╚═════╝    ╚═╝   ╚══════╝
    
    🤖 AI Coding Assistant for Your Terminal
EOF
    echo -e "${NC}"
}

# Check OS
check_os() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        OS="macos"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        OS="linux"
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        OS="windows"
        echo -e "${RED}❌ This script is for macOS/Linux only${NC}"
        echo -e "${YELLOW}For Windows, run: iwr https://jarvis.sh -useb | iex${NC}"
        exit 1
    else
        OS="unknown"
    fi
}

# Check prerequisites
check_prereqs() {
    echo -e "${CYAN}🔍 Checking prerequisites...${NC}"
    
    # Node.js
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js not found${NC}"
        
        if [[ "$OS" == "macos" ]]; then
            echo -e "${YELLOW}Install with: brew install node${NC}"
        elif [[ "$OS" == "linux" ]]; then
            echo -e "${YELLOW}Install with:${NC}"
            echo "  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -"
            echo "  sudo apt-get install -y nodejs"
        fi
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        echo -e "${RED}❌ Node.js 18+ required (found: $(node -v))${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Node.js $(node -v)${NC}"
    
    # npm
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm not found${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ npm $(npm -v)${NC}"
    
    # Git (optional)
    if command -v git &> /dev/null; then
        echo -e "${GREEN}✅ git $(git --version | cut -d' ' -f3)${NC}"
    else
        echo -e "${YELLOW}⚠️  git not found (optional)${NC}"
    fi
    
    echo ""
}

# Install Jarvis
install_jarvis() {
    echo -e "${CYAN}📦 Installing Jarvis CLI...${NC}"
    echo ""
    
    # Install from npm
    npm install -g jarvis-qwen-cli 2>&1 | while read -r line; do
        echo -e "   ${GRAY}$line${NC}"
    done
    
    echo ""
    echo -e "${GREEN}✅ Jarvis installed successfully!${NC}"
    echo ""
}

# Show next steps
show_next_steps() {
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║           🚀 Jarvis Installation Complete!            ║${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${CYAN}Next steps:${NC}"
    echo ""
    echo -e "  ${YELLOW}1.${NC} Initialize with your API key:"
    echo -e "     ${GREEN}jarvis init${NC}"
    echo ""
    echo -e "  ${YELLOW}2.${NC} Start using in any project:"
    echo -e "     ${GREEN}cd your-project && jarvis${NC}"
    echo ""
    echo -e "  ${YELLOW}3.${NC} Try your first command:"
    echo -e "     ${GREEN}jarvis \"explain this codebase\"${NC}"
    echo ""
    echo -e "${CYAN}📖 Docs: https://github.com/PsProsen-Dev/jarvis-qwen-cli${NC}"
    echo -e "${CYAN}💬 Support: https://github.com/PsProsen-Dev/jarvis-qwen-cli/discussions${NC}"
    echo ""
    echo -e "${GREEN}Happy Coding! 🤖✨${NC}"
    echo ""
}

# Main
main() {
    show_banner
    check_os
    check_prereqs
    install_jarvis
    show_next_steps
}

main
