#!/usr/bin/env bash

# ===================================================================
#  Jarvis By QWEN Code CLI - Installation Script
#  For macOS and Linux
# ===================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}"
echo "🤖 Jarvis - AI Coding Assistant"
echo "   Powered by Qwen AI"
echo -e "${NC}"
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo ""
    echo "Please install Node.js first:"
    echo "  macOS:  brew install node"
    echo "  Linux:  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -"
    echo "          sudo apt-get install -y nodejs"
    echo ""
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js 18 or higher is required${NC}"
    echo "Current version: $(node -v)"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v) detected${NC}"

# Check for npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ npm $(npm -v) detected${NC}"
echo ""

# Install globally
echo -e "${CYAN}📦 Installing Jarvis CLI...${NC}"
npm install -g jarvis-qwen-cli

echo ""
echo -e "${GREEN}✅ Jarvis installed successfully!${NC}"
echo ""
echo -e "${CYAN}🚀 Next steps:${NC}"
echo ""
echo "  1. Initialize Jarvis with your API key:"
echo -e "     ${YELLOW}jarvis init${NC}"
echo ""
echo "  2. Start using Jarvis in any project:"
echo -e "     ${YELLOW}jarvis${NC}"
echo ""
echo -e "${CYAN}📖 Documentation: https://github.com/PsProsen-Dev/jarvis-qwen-cli${NC}"
echo ""
