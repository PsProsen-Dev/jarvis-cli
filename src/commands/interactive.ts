import chalk from 'chalk';
import inquirer from 'inquirer';
import { QwenAI } from '../services/qwen-ai';
import { CodeContext } from '../services/code-context';
import { CommandHandler } from '../commands/handler';

interface SessionOptions {
  context?: string;
  file?: string;
  model?: string;
  verbose?: boolean;
  interactive?: boolean;
  initialPrompt?: string;
}

export async function runInteractiveSession(options: SessionOptions) {
  const qwenAI = new QwenAI();
  const codeContext = new CodeContext(options.context || process.cwd());
  const commandHandler = new CommandHandler(qwenAI, codeContext);
  
  console.log(chalk.cyan('\n🤖 Welcome to Jarvis - Your AI Coding Assistant!'));
  console.log(chalk.gray('   Type "help" for commands, "exit" to quit\n'));
  
  // If initial prompt provided, process it
  if (options.initialPrompt) {
    await commandHandler.processCommand(options.initialPrompt, options);
    return;
  }
  
  // Interactive loop
  while (true) {
    try {
      const { prompt } = await inquirer.prompt([
        {
          type: 'input',
          name: 'prompt',
          message: chalk.cyan('jarvis>'),
          prefix: ''
        }
      ]);
      
      const trimmedPrompt = prompt.trim().toLowerCase();
      
      // Exit commands
      if (['exit', 'quit', 'q', 'bye'].includes(trimmedPrompt)) {
        console.log(chalk.cyan('\n👋 Jarvis signing off. Happy coding, Sir!\n'));
        break;
      }
      
      // Help command
      if (trimmedPrompt === 'help') {
        showHelp();
        continue;
      }
      
      // Clear command
      if (trimmedPrompt === 'clear' || trimmedPrompt === 'cls') {
        console.clear();
        continue;
      }
      
      // Empty input
      if (!prompt.trim()) {
        continue;
      }
      
      // Process command
      await commandHandler.processCommand(prompt, options);
      
    } catch (error) {
      if ((error as any).isTtyError) {
        // Terminal closed
        break;
      }
      console.error(chalk.red('Error:'), (error as Error).message);
      if (options.verbose) {
        console.error(error);
      }
    }
  }
}

function showHelp() {
  console.log(chalk.cyan('\n📖 Jarvis Commands:\n'));
  console.log(chalk.white('  ') + chalk.cyan('explain <file>') + chalk.gray('     - Explain a code file'));
  console.log(chalk.white('  ') + chalk.cyan('refactor <file>') + chalk.gray('    - Refactor code with suggestions'));
  console.log(chalk.white('  ') + chalk.cyan('commit') + chalk.gray('            - Create intelligent commit message'));
  console.log(chalk.white('  ') + chalk.cyan('status') + chalk.gray('            - Git status with AI insights'));
  console.log(chalk.white('  ') + chalk.cyan('search <query>') + chalk.gray('    - Search codebase'));
  console.log(chalk.white('  ') + chalk.cyan('test <file>') + chalk.gray('       - Generate tests for file'));
  console.log(chalk.white('  ') + chalk.cyan('optimize <file>') + chalk.gray('   - Optimize code performance'));
  console.log(chalk.white('  ') + chalk.cyan('doc <file>') + chalk.gray('        - Generate documentation'));
  console.log(chalk.white('  ') + chalk.cyan('chat <message>') + chalk.gray('    - Chat with Jarvis (Hinglish supported!)'));
  console.log(chalk.white('  ') + chalk.cyan('clear') + chalk.gray('             - Clear screen'));
  console.log(chalk.white('  ') + chalk.cyan('exit') + chalk.gray('              - Exit Jarvis\n'));
  
  console.log(chalk.gray('  💡 Tip: You can ask questions in Hinglish like:'));
  console.log(chalk.gray('     "is file ko explain karo"'));
  console.log(chalk.gray('     "commit message bana do"\n'));
}
