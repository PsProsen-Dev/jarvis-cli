#!/usr/bin/env node

/**
 * ===================================================================
 *  JARVIS BY QWEN CODE CLI 🤖
 *  Your AI Coding Assistant in the Terminal
 *  
 *  By Prosenjit Paul (PsProsen-Dev)
 * 
 *  Multi-Provider Support: ChatGPT, Codex, Gemini, OpenRouter, GitHub Copilot, Qwen
 * ===================================================================
 */

import { Command } from 'commander';
import { runInteractiveSession } from './commands/interactive';
import { explainCode } from './commands/explain';
import { refactorCode } from './commands/refactor';
import { gitCommit } from './commands/git-commit';
import { gitStatus } from './commands/git-status';
import { listPlugins } from './commands/plugins';
import { initPlugin } from './commands/plugin-init';
import { checkEnv } from './utils/env-check';
import chalk from 'chalk';
import ora from 'ora';
import { AuthService, ProviderType } from './services/auth';

const program = new Command();

program
  .name('jarvis')
  .description(chalk.cyan('🤖 Jarvis - Your AI Coding Assistant in the Terminal'))
  .version('1.0.0');

// Auth command - Multi-provider authentication
const auth = program.command('auth')
  .description('Manage AI provider authentication');

auth
  .command('login')
  .description('Authenticate with an AI provider')
  .argument('[provider]', 'Provider name', 'select')
  .action(async (provider) => {
    const authService = new AuthService();
    
    if (!provider || provider === 'select') {
      // Interactive provider selection
      const inquirer = await import('inquirer');
      const { selectedProvider } = await inquirer.default.prompt([
        {
          type: 'list',
          name: 'selectedProvider',
          message: 'Select AI provider to authenticate:',
          choices: [
            { name: '🔓 ChatGPT (OAuth)', value: 'chatgpt' },
            { name: '🤖 Codex (API Key / ChatGPT)', value: 'codex' },
            { name: '💎 Gemini (API Key)', value: 'gemini' },
            { name: '💎 Gemini (OAuth)', value: 'gemini-oauth' },
            { name: '🌐 OpenRouter (API Key)', value: 'openrouter' },
            { name: '🐙 GitHub Copilot (Device Login)', value: 'github-copilot' },
            { name: '🤖 Qwen (API Key)', value: 'qwen' }
          ]
        }
      ]);
      provider = selectedProvider;
    }
    
    try {
      switch (provider as ProviderType) {
        case 'chatgpt':
          await authService.authenticateChatGPT();
          break;
        case 'codex':
          await authService.authenticateCodex();
          break;
        case 'gemini':
          await authService.authenticateGemini();
          break;
        case 'gemini-oauth':
          await authService.authenticateGeminiOAuth();
          break;
        case 'openrouter':
          await authService.authenticateOpenRouter();
          break;
        case 'github-copilot':
          await authService.authenticateGitHubCopilot();
          break;
        case 'qwen':
          await authService.authenticateQwen();
          break;
        default:
          console.log(chalk.yellow('Unknown provider. Use "jarvis auth login" to select interactively.'));
      }
    } catch (error) {
      process.exit(1);
    }
  });

auth
  .command('logout')
  .description('Logout from AI provider')
  .argument('[provider]', 'Provider name (logout from all if not specified)')
  .action(async (provider) => {
    const authService = new AuthService();
    await authService.clearAuth(provider);
    console.log(chalk.green(`✅ Logged out ${provider ? `from ${provider}` : 'from all providers'}\n`));
  });

auth
  .command('status')
  .description('Show authentication status')
  .action(async () => {
    const authService = new AuthService();
    const providers = await authService.listProviders();
    
    console.log(chalk.cyan('\n🔐 Authentication Status\n'));
    console.log(chalk.gray('Provider                  Status      Active'));
    console.log(chalk.gray('─────────────────────────────────────────────'));
    
    const providerIcons: Record<string, string> = {
      chatgpt: '🔓',
      codex: '🤖',
      gemini: '💎',
      'gemini-oauth': '💎',
      openrouter: '🌐',
      'github-copilot': '🐙',
      qwen: '🤖'
    };
    
    for (const p of providers) {
      const icon = providerIcons[p.provider] || '•';
      const status = p.configured ? chalk.green('✓ Connected') : chalk.gray('○ Not set');
      const active = p.active ? chalk.yellow('● Active') : '';
      console.log(`  ${icon} ${p.provider.padEnd(20)}  ${status.padEnd(14)}  ${active}`);
    }
    
    console.log();
  });

auth
  .command('list')
  .description('List all available providers')
  .action(async () => {
    const authService = new AuthService();
    const providers = await authService.listProviders();
    
    console.log(chalk.cyan('\n🌐 Available AI Providers\n'));
    
    const providerInfo: Record<string, { name: string; auth: string; desc: string }> = {
      chatgpt: { name: 'ChatGPT', auth: 'OAuth', desc: 'OpenAI ChatGPT with OAuth' },
      codex: { name: 'Codex', auth: 'API Key / OAuth', desc: 'OpenAI Codex (codexplan/codexspark)' },
      gemini: { name: 'Gemini', auth: 'API Key', desc: 'Google Gemini via API Key' },
      'gemini-oauth': { name: 'Gemini', auth: 'OAuth', desc: 'Google Gemini via Google OAuth' },
      openrouter: { name: 'OpenRouter', auth: 'API Key', desc: '100+ models via OpenRouter' },
      'github-copilot': { name: 'GitHub Copilot', auth: 'Device Login', desc: 'GitHub Copilot via device code' },
      qwen: { name: 'Qwen', auth: 'API Key', desc: 'Alibaba Qwen via Dashscope' }
    };
    
    for (const p of providers) {
      const info = providerInfo[p.provider];
      const status = p.configured ? chalk.green('✓') : chalk.gray('○');
      const active = p.active ? chalk.yellow(' ●') : '';
      console.log(`${status} ${info.name.padEnd(18)} (${info.auth.padEnd(15)})${active}`);
      console.log(chalk.gray(`   ${info.desc}\n`));
    }
  });

program
  .argument('[prompt]', 'Your instruction for Jarvis (Hinglish supported!)')
  .option('-c, --context <path>', 'Specify code context directory', process.cwd())
  .option('-f, --file <file>', 'Focus on specific file')
  .option('-m, --model <model>', 'AI model to use', 'qwen-coder-plus')
  .option('-v, --verbose', 'Enable verbose output')
  .option('--no-interactive', 'Non-interactive mode (for scripts)')
  .action(async (prompt, options) => {
    const spinner = ora('Initializing Jarvis...').start();

    try {
      // Check environment
      const envOk = await checkEnv();
      if (!envOk) {
        spinner.fail(chalk.red('Environment check failed'));
        console.log(chalk.yellow('\n📖 Run ') + chalk.cyan('jarvis auth login') + chalk.yellow(' to set up your API key\n'));
        process.exit(1);
      }

      spinner.succeed(chalk.green('Jarvis initialized!'));
      
      // If no prompt, start interactive session
      if (!prompt) {
        await runInteractiveSession(options);
      } else {
        // Direct command mode
        console.log(chalk.cyan('\n🤖 Jarvis: ') + chalk.white(`Processing: "${prompt}"\n`));
        // Will be handled by sub-commands in future
        await runInteractiveSession({ ...options, initialPrompt: prompt });
      }
    } catch (error) {
      spinner.fail(chalk.red('Error: ' + (error as Error).message));
      if (options.verbose) {
        console.error(error);
      }
      process.exit(1);
    }
  });

// Git commands
const git = program.command('git')
  .description('Git workflow commands');

git
  .command('commit')
  .description('Create intelligent commit messages')
  .option('-m, --message <message>', 'Custom commit message hint')
  .option('-a, --all', 'Stage all changes before committing')
  .action(async (options) => {
    await gitCommit(options);
  });

git
  .command('status')
  .description('Show git status with AI insights')
  .action(async () => {
    await gitStatus();
  });

// Code analysis commands
const code = program.command('code')
  .description('Code analysis and refactoring');

code
  .command('explain <file>')
  .description('Explain a code file')
  .option('-d, --depth <level>', 'Explanation depth (basic|detailed|deep)', 'detailed')
  .action(async (file, options) => {
    await explainCode(file, options);
  });

code
  .command('refactor <file>')
  .description('Refactor code with AI suggestions')
  .option('-o, --output <file>', 'Output file path')
  .option('--focus <area>', 'Focus area (performance|readability|security)')
  .action(async (file, options) => {
    await refactorCode(file, options);
  });

// Plugin system
const plugins = program.command('plugins')
  .description('Manage Jarvis plugins');

plugins
  .command('list')
  .description('List installed plugins')
  .action(async () => {
    await listPlugins();
  });

plugins
  .command('init <name>')
  .description('Initialize a new plugin')
  .action(async (name) => {
    await initPlugin(name);
  });

// Setup command
program
  .command('init')
  .description('Initialize Jarvis with your API key')
  .action(async () => {
    const inquirer = await import('inquirer');
    const { apiKey } = await inquirer.default.prompt([
      {
        type: 'password',
        name: 'apiKey',
        message: 'Enter your Qwen AI API key:',
        validate: (input) => input.length > 0 || 'API key is required'
      }
    ]);
    
    const Config = (await import('conf')).default;
    const config = new Config({ projectName: 'jarvis-qwen-cli' });
    config.set('apiKey', apiKey);
    
    console.log(chalk.green('\n✅ Jarvis initialized successfully!'));
    console.log(chalk.cyan('🚀 You can now use Jarvis in any project!\n'));
  });

program
  .command('doctor')
  .description('Check Jarvis installation and configuration')
  .action(async () => {
    console.log(chalk.cyan('\n🔍 Jarvis Health Check\n'));
    console.log(chalk.white('Checking environment...'));
    await checkEnv();
    console.log(chalk.green('✅ All systems operational!\n'));
  });

program.parse();
