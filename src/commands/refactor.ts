import chalk from 'chalk';
import ora from 'ora';
import { CodeContext } from '../services/code-context';
import { QwenAI } from '../services/qwen-ai';
import { promises as fs } from 'fs';

export async function refactorCode(file: string, options: any) {
  const spinner = ora('Reading file...').start();
  
  try {
    const context = new CodeContext(process.cwd());
    const content = await context.getFileContent(file);
    
    if (!content) {
      spinner.fail(chalk.red(`File not found: ${file}`));
      return;
    }
    
    spinner.text = 'Analyzing code...';
    const ai = new QwenAI();
    const suggestions = await ai.refactorCode(content, options.focus);
    
    spinner.succeed(chalk.green('Done!'));
    console.log(chalk.cyan(`\n💡 Refactoring suggestions for ${file}:\n`));
    console.log(chalk.white(suggestions));
    
    if (options.output) {
      console.log(chalk.gray(`\nSaving to ${options.output}...`));
      // Will be implemented in next iteration
    }
    
    console.log();
  } catch (error) {
    spinner.fail(chalk.red('Error: ' + (error as Error).message));
  }
}
