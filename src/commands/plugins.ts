import chalk from 'chalk';
import { promises as fs } from 'fs';
import { join } from 'path';

export async function listPlugins() {
  const pluginsDir = join(process.env.HOME || process.env.USERPROFILE || '', '.jarvis', 'plugins');
  
  try {
    const files = await fs.readdir(pluginsDir);
    
    if (files.length === 0) {
      console.log(chalk.yellow('\n📦 No plugins installed\n'));
      console.log(chalk.gray('Create a plugin with: jarvis plugins init <name>\n'));
      return;
    }
    
    console.log(chalk.cyan('\n📦 Installed Plugins:\n'));
    
    for (const file of files) {
      const stat = await fs.stat(join(pluginsDir, file));
      if (stat.isDirectory()) {
        console.log(chalk.white(`  - ${chalk.cyan(file)}`));
      }
    }
    
    console.log();
  } catch (error) {
    console.log(chalk.yellow('\n📦 No plugins installed\n'));
    console.log(chalk.gray('Create a plugin with: jarvis plugins init <name>\n'));
  }
}
