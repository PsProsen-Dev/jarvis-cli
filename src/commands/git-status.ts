import chalk from 'chalk';
import ora from 'ora';
import { CodeContext } from '../services/code-context';

export async function gitStatus() {
  const spinner = ora('Getting git status...').start();
  
  try {
    const context = new CodeContext(process.cwd());
    const status = await context.getGitStatus();
    
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
