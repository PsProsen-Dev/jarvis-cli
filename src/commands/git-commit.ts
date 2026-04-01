import chalk from 'chalk';
import ora from 'ora';
import { CodeContext } from '../services/code-context';
import { QwenAI } from '../services/qwen-ai';
import { execa } from 'execa';

export async function gitCommit(options: any) {
  const spinner = ora('Analyzing changes...').start();
  
  try {
    // Stage all if --all flag is provided
    if (options.all) {
      spinner.text = 'Staging all changes...';
      await execa('git', ['add', '.']);
    }
    
    const context = new CodeContext(process.cwd());
    const diff = await context.getGitDiff();
    
    if (!diff.trim()) {
      spinner.fail(chalk.red('No staged changes found'));
      console.log(chalk.gray('Tip: Use --all to stage all changes automatically\n'));
      return;
    }
    
    spinner.text = 'Generating commit message...';
    const ai = new QwenAI();
    const message = await ai.generateCommitMessage(diff);
    
    spinner.succeed(chalk.green('Commit message generated!'));
    console.log(chalk.cyan('\n💡 Suggested commit message:\n'));
    console.log(chalk.yellow(message));
    console.log(chalk.gray('\nTo commit, run:'));
    console.log(chalk.cyan(`git commit -m "${message}"\n`));
    
    // Auto-commit if --message hint was provided
    if (options.message) {
      const confirm = await import('inquirer');
      const { doCommit } = await confirm.default.prompt([
        {
          type: 'confirm',
          name: 'doCommit',
          message: 'Commit with this message?',
          default: true
        }
      ]);
      
      if (doCommit) {
        await execa('git', ['commit', '-m', message]);
        console.log(chalk.green('✅ Committed successfully!\n'));
      }
    }
  } catch (error) {
    spinner.fail(chalk.red('Error: ' + (error as Error).message));
  }
}
