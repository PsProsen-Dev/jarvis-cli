import chalk from 'chalk';
import ora from 'ora';
import { CodeContext } from '../services/code-context';
import { QwenAI } from '../services/qwen-ai';

export async function explainCode(file: string, options: any) {
  const spinner = ora('Reading file...').start();
  
  try {
    const context = new CodeContext(process.cwd());
    const content = await context.getFileContent(file);
    
    if (!content) {
      spinner.fail(chalk.red(`File not found: ${file}`));
      return;
    }
    
    spinner.text = 'Generating explanation...';
    const ai = new QwenAI();
    const explanation = await ai.explainCode(content);
    
    spinner.succeed(chalk.green('Done!'));
    console.log(chalk.cyan(`\n📖 Explanation for ${file}:\n`));
    console.log(chalk.white(explanation));
    console.log();
  } catch (error) {
    spinner.fail(chalk.red('Error: ' + (error as Error).message));
  }
}
