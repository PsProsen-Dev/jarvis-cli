import chalk from 'chalk';
import ora from 'ora';
import { QwenAI } from '../services/qwen-ai';
import { CodeContext } from '../services/code-context';
import { execa } from 'execa';

export class CommandHandler {
  private ai: QwenAI;
  private context: CodeContext;
  
  constructor(ai: QwenAI, context: CodeContext) {
    this.ai = ai;
    this.context = context;
  }
  
  async processCommand(prompt: string, options: any = {}) {
    const lowerPrompt = prompt.toLowerCase().trim();
    
    // Route to appropriate handler
    if (lowerPrompt.startsWith('explain')) {
      return this.handleExplain(prompt, options);
    } else if (lowerPrompt.startsWith('refactor')) {
      return this.handleRefactor(prompt, options);
    } else if (lowerPrompt.startsWith('commit') || lowerPrompt.includes('commit')) {
      return this.handleCommit(options);
    } else if (lowerPrompt.startsWith('status') || lowerPrompt.includes('status')) {
      return this.handleStatus();
    } else if (lowerPrompt.startsWith('search')) {
      return this.handleSearch(prompt, options);
    } else if (lowerPrompt.startsWith('test')) {
      return this.handleTest(prompt, options);
    } else if (lowerPrompt.startsWith('optimize')) {
      return this.handleOptimize(prompt, options);
    } else if (lowerPrompt.startsWith('doc')) {
      return this.handleDoc(prompt, options);
    } else if (lowerPrompt.startsWith('chat') || lowerPrompt.startsWith('/')) {
      return this.handleChat(prompt, options);
    } else {
      // Default: treat as chat
      return this.handleChat(prompt, options);
    }
  }
  
  private async handleExplain(prompt: string, options: any) {
    const spinner = ora('Analyzing code...').start();
    
    try {
      // Extract file name from prompt
      const match = prompt.match(/explain\s+(.+)/i);
      const fileName = match ? match[1].trim() : null;
      
      if (!fileName) {
        spinner.fail(chalk.red('Please specify a file to explain'));
        return;
      }
      
      const content = await this.context.getFileContent(fileName);
      if (!content) {
        spinner.fail(chalk.red(`File not found: ${fileName}`));
        return;
      }
      
      spinner.text = 'Generating explanation...';
      const explanation = await this.ai.explainCode(content, undefined);
      
      spinner.succeed(chalk.green('Done!'));
      console.log(chalk.cyan('\n📖 Explanation:\n'));
      console.log(chalk.white(explanation));
      console.log();
    } catch (error) {
      spinner.fail(chalk.red('Error: ' + (error as Error).message));
    }
  }
  
  private async handleRefactor(prompt: string, options: any) {
    const spinner = ora('Analyzing code for refactoring...').start();
    
    try {
      const match = prompt.match(/refactor\s+(.+)/i);
      const fileName = match ? match[1].trim() : null;
      
      if (!fileName) {
        spinner.fail(chalk.red('Please specify a file to refactor'));
        return;
      }
      
      const content = await this.context.getFileContent(fileName);
      if (!content) {
        spinner.fail(chalk.red(`File not found: ${fileName}`));
        return;
      }
      
      spinner.text = 'Generating refactoring suggestions...';
      const suggestions = await this.ai.refactorCode(content);
      
      spinner.succeed(chalk.green('Done!'));
      console.log(chalk.cyan('\n💡 Refactoring Suggestions:\n'));
      console.log(chalk.white(suggestions));
      console.log();
    } catch (error) {
      spinner.fail(chalk.red('Error: ' + (error as Error).message));
    }
  }
  
  private async handleCommit(options: any) {
    const spinner = ora('Analyzing git changes...').start();
    
    try {
      const diff = await this.context.getGitDiff();
      
      if (!diff.trim()) {
        spinner.fail(chalk.red('No staged changes found'));
        return;
      }
      
      spinner.text = 'Generating commit message...';
      const message = await this.ai.generateCommitMessage(diff);
      
      spinner.succeed(chalk.green('Commit message generated!'));
      console.log(chalk.cyan('\n💡 Suggested commit message:\n'));
      console.log(chalk.yellow(message));
      console.log(chalk.gray('\nTo commit, run:'));
      console.log(chalk.cyan(`git commit -m "${message}"\n`));
    } catch (error) {
      spinner.fail(chalk.red('Error: ' + (error as Error).message));
    }
  }
  
  private async handleStatus() {
    const spinner = ora('Getting git status...').start();
    
    try {
      const status = await this.context.getGitStatus();
      
      spinner.succeed(chalk.green('Git status'));
      
      if (status.modified.length === 0 && status.added.length === 0 && 
          status.deleted.length === 0 && status.untracked.length === 0) {
        console.log(chalk.green('\n✅ Working tree clean\n'));
        return;
      }
      
      console.log(chalk.cyan('\n📊 Git Status:\n'));
      
      if (status.modified.length > 0) {
        console.log(chalk.yellow('  Modified:'));
        status.modified.forEach(f => console.log(chalk.gray(`    ${f}`)));
      }
      
      if (status.added.length > 0) {
        console.log(chalk.green('  Added:'));
        status.added.forEach(f => console.log(chalk.gray(`    ${f}`)));
      }
      
      if (status.deleted.length > 0) {
        console.log(chalk.red('  Deleted:'));
        status.deleted.forEach(f => console.log(chalk.gray(`    ${f}`)));
      }
      
      if (status.untracked.length > 0) {
        console.log(chalk.blue('  Untracked:'));
        status.untracked.forEach(f => console.log(chalk.gray(`    ${f}`)));
      }
      
      console.log();
    } catch (error) {
      spinner.fail(chalk.red('Error: ' + (error as Error).message));
    }
  }
  
  private async handleSearch(prompt: string, options: any) {
    const spinner = ora('Searching codebase...').start();
    
    try {
      const match = prompt.match(/search\s+(.+)/i);
      const query = match ? match[1].trim() : prompt.replace('search', '').trim();
      
      if (!query) {
        spinner.fail(chalk.red('Please specify a search query'));
        return;
      }
      
      const results = await this.context.searchCode(query);
      
      spinner.succeed(chalk.green(`Found ${results.length} results`));
      
      if (results.length === 0) {
        console.log(chalk.gray('  No matches found\n'));
        return;
      }
      
      console.log(chalk.cyan(`\n🔍 Search results for "${query}":\n`));
      
      results.slice(0, 10).forEach(result => {
        console.log(chalk.white(`  ${result.file}:${result.line}`));
        console.log(chalk.gray(`    ${result.content}\n`));
      });
      
      if (results.length > 10) {
        console.log(chalk.gray(`  ... and ${results.length - 10} more results\n`));
      }
    } catch (error) {
      spinner.fail(chalk.red('Error: ' + (error as Error).message));
    }
  }
  
  private async handleChat(prompt: string, options: any) {
    const spinner = ora('Thinking...').start();
    
    try {
      // Remove "chat" prefix if present
      const message = prompt.replace(/^chat\s*/i, '').trim();
      
      // Get project context
      const projectInfo = await this.context.getProjectInfo();
      
      const systemPrompt = `You are Jarvis, an AI coding assistant.
You help developers with coding tasks in their terminal.
Use Hinglish (70% Romanized Hindi + 30% English) for responses.
Be concise, practical, and friendly.
Current project: ${projectInfo.name} (${projectInfo.type})`;
      
      const userMessage = message;
      
      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ];
      
      spinner.text = 'Generating response...';
      const response = await this.ai.chat(messages as any);
      
      spinner.succeed(chalk.green('Done!'));
      console.log(chalk.cyan('\n🤖 Jarvis:\n'));
      console.log(chalk.white(response));
      console.log();
    } catch (error) {
      spinner.fail(chalk.red('Error: ' + (error as Error).message));
    }
  }
  
  private async handleTest(prompt: string, options: any) {
    console.log(chalk.yellow('⚠️  Test generation coming soon!\n'));
  }
  
  private async handleOptimize(prompt: string, options: any) {
    console.log(chalk.yellow('⚠️  Code optimization coming soon!\n'));
  }
  
  private async handleDoc(prompt: string, options: any) {
    console.log(chalk.yellow('⚠️  Documentation generation coming soon!\n'));
  }
}
