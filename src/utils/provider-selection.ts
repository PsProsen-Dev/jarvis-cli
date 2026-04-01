/**
 * ===================================================================
 *  Jarvis Provider Selection UI
 *  Interactive provider switching
 * ===================================================================
 */

import chalk from 'chalk';
import inquirer from 'inquirer';
import { AuthService, ProviderType } from '../services/auth';

export interface ProviderOption {
  name: string;
  value: ProviderType;
  short: string;
  description: string;
  icon: string;
}

export const PROVIDER_OPTIONS: ProviderOption[] = [
  {
    name: '🔓 ChatGPT - OpenAI ChatGPT (OAuth)',
    value: 'chatgpt',
    short: 'ChatGPT',
    description: 'Use ChatGPT with OAuth authentication. Supports GPT-4, GPT-4 Turbo.',
    icon: '🔓'
  },
  {
    name: '🤖 Codex - OpenAI Codex (API Key / OAuth)',
    value: 'codex',
    short: 'Codex',
    description: 'OpenAI Codex for code tasks. Supports codexplan, codexspark.',
    icon: '🤖'
  },
  {
    name: '💎 Gemini - Google Gemini (API Key)',
    value: 'gemini',
    short: 'Gemini',
    description: 'Google Gemini via API Key. Free tier available.',
    icon: '💎'
  },
  {
    name: '💎 Gemini OAuth - Google Gemini (OAuth)',
    value: 'gemini-oauth',
    short: 'Gemini OAuth',
    description: 'Google Gemini via Google OAuth. Enterprise features.',
    icon: '💎'
  },
  {
    name: '🌐 OpenRouter - 100+ Models (API Key)',
    value: 'openrouter',
    short: 'OpenRouter',
    description: 'Access 100+ models via OpenRouter. Best variety.',
    icon: '🌐'
  },
  {
    name: '🐙 GitHub Copilot - Device Login',
    value: 'github-copilot',
    short: 'Copilot',
    description: 'GitHub Copilot via device code. For Copilot subscribers.',
    icon: '🐙'
  },
  {
    name: '🤖 Qwen - Alibaba Qwen (API Key)',
    value: 'qwen',
    short: 'Qwen',
    description: 'Alibaba Qwen via Dashscope. Best for coding.',
    icon: '🤖'
  }
];

export async function showProviderSelection(): Promise<ProviderType | null> {
  const authService = new AuthService();
  const providers = await authService.listProviders();
  
  // Add status indicators to options
  const choices = PROVIDER_OPTIONS.map(option => {
    const providerStatus = providers.find(p => p.provider === option.value);
    const isActive = providerStatus?.active;
    const isConfigured = providerStatus?.configured;
    
    let statusIndicator = '';
    if (isActive) {
      statusIndicator = chalk.yellow(' ●');
    } else if (isConfigured) {
      statusIndicator = chalk.green(' ✓');
    } else {
      statusIndicator = chalk.gray(' ○');
    }
    
    return {
      name: `${option.name}${statusIndicator}`,
      value: option.value,
      short: option.short
    };
  });
  
  choices.push({
    name: '❌ Cancel',
    value: null as any,
    short: 'Cancel'
  });
  
  const { selectedProvider } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedProvider',
      message: chalk.cyan('Select AI Provider:'),
      choices,
      pageSize: choices.length
    }
  ]);
  
  return selectedProvider;
}

export async function showQuickSwitch(): Promise<ProviderType | null> {
  const authService = new AuthService();
  const providers = await authService.listProviders();
  
  // Only show configured providers
  const configuredProviders = providers.filter(p => p.configured);
  
  if (configuredProviders.length === 0) {
    console.log(chalk.yellow('\n⚠️  No providers configured. Run ') + chalk.cyan('jarvis auth login') + chalk.yellow(' first.\n'));
    return null;
  }
  
  const choices = configuredProviders.map(p => {
    const option = PROVIDER_OPTIONS.find(o => o.value === p.provider);
    const isActive = p.active ? chalk.yellow(' (Current)') : '';
    return {
      name: `${option?.name || p.provider}${isActive}`,
      value: p.provider,
      short: option?.short || p.provider
    };
  });
  
  choices.push({
    name: '❌ Cancel',
    value: null as any,
    short: 'Cancel'
  });
  
  const { selectedProvider } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedProvider',
      message: chalk.cyan('Switch to:'),
      choices,
      pageSize: choices.length
    }
  ]);
  
  if (selectedProvider) {
    await authService.setActiveProvider(selectedProvider);
    const option = PROVIDER_OPTIONS.find(o => o.value === selectedProvider);
    console.log(chalk.green(`\n✅ Switched to ${option?.name}\n`));
  }
  
  return selectedProvider;
}

export async function showProviderStatus(): Promise<void> {
  const authService = new AuthService();
  const providers = await authService.listProviders();
  const activeProvider = providers.find(p => p.active);
  
  console.log(chalk.cyan('\n🌐 AI Provider Status\n'));
  console.log(chalk.gray('─'.repeat(60)));
  
  for (const provider of providers) {
    const option = PROVIDER_OPTIONS.find(o => o.value === provider.provider);
    if (!option) continue;
    
    const statusIcon = provider.active 
      ? chalk.yellow('●') 
      : provider.configured 
        ? chalk.green('✓') 
        : chalk.gray('○');
    
    const statusText = provider.active
      ? chalk.yellow('Active')
      : provider.configured
        ? chalk.green('Connected')
        : chalk.gray('Not configured');
    
    console.log(`${statusIcon} ${option.name}`);
    console.log(chalk.gray(`  ${option.description}`));
    console.log(chalk.gray(`  Status: ${statusText}\n`));
  }
  
  console.log(chalk.gray('─'.repeat(60)));
  
  if (activeProvider) {
    const option = PROVIDER_OPTIONS.find(o => o.value === activeProvider.provider);
    console.log(chalk.cyan(`\n✨ Currently using: ${option?.name}\n`));
  } else {
    console.log(chalk.yellow('\n⚠️  No active provider. Run ') + chalk.cyan('jarvis auth login') + chalk.yellow(' to get started.\n'));
  }
}
