import { glob } from 'glob';
import { promises as fs } from 'fs';
import { join, basename } from 'path';
import ignore from 'ignore';
import chalk from 'chalk';

export interface FileContext {
  path: string;
  content: string;
  language: string;
}

export class CodeContext {
  private rootDir: string;
  private ig: any;
  
  constructor(rootDir: string) {
    this.rootDir = rootDir;
    this.ig = ignore();
    this.loadIgnoreFiles();
  }
  
  private async loadIgnoreFiles() {
    const ignoreFiles = [
      '.gitignore',
      '.jarvisignore',
      '.dockerignore'
    ];
    
    for (const file of ignoreFiles) {
      try {
        const ignorePath = join(this.rootDir, file);
        const content = await fs.readFile(ignorePath, 'utf-8');
        this.ig.add(content);
      } catch (error) {
        // File doesn't exist, skip
      }
    }
    
    // Add default ignores
    this.ig.add([
      'node_modules/**',
      'dist/**',
      'build/**',
      '.git/**',
      '*.min.js',
      '*.bundle.js',
      'coverage/**',
      '.vscode/**',
      '.idea/**',
      '*.log',
      'npm-debug.log*',
      'yarn-debug.log*',
      'yarn-error.log*'
    ]);
  }
  
  async getFileContent(filePath: string): Promise<string | null> {
    try {
      const fullPath = join(this.rootDir, filePath);
      const content = await fs.readFile(fullPath, 'utf-8');
      return content;
    } catch (error) {
      return null;
    }
  }
  
  async getContextFiles(pattern?: string): Promise<FileContext[]> {
    const files: FileContext[] = [];
    
    try {
      const globPattern = pattern || '**/*.{ts,tsx,js,jsx,py,java,c,cpp,h,hpp,go,rs,rb,php,sql,md}';
      const allFiles = await glob(globPattern, {
        cwd: this.rootDir,
        nodir: true,
        dot: false
      });
      
      const allowedFiles = this.ig.filter(allFiles);
      
      for (const file of allowedFiles.slice(0, 50)) { // Limit to 50 files
        const content = await this.getFileContent(file);
        if (content) {
          files.push({
            path: file,
            content,
            language: this.detectLanguage(file)
          });
        }
      }
    } catch (error) {
      console.error(chalk.yellow('Warning: Could not gather all context files'));
    }
    
    return files;
  }
  
  async searchCode(query: string): Promise<Array<{ file: string; line: number; content: string }>> {
    const results: Array<{ file: string; line: number; content: string }> = [];
    
    try {
      const files = await this.getContextFiles();
      
      for (const file of files) {
        const lines = file.content.split('\n');
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].toLowerCase().includes(query.toLowerCase())) {
            results.push({
              file: file.path,
              line: i + 1,
              content: lines[i].trim()
            });
          }
        }
      }
    } catch (error) {
      // Ignore search errors
    }
    
    return results;
  }
  
  async getGitStatus(): Promise<{
    modified: string[];
    added: string[];
    deleted: string[];
    untracked: string[];
  }> {
    const { execa } = await import('execa');
    
    try {
      const { stdout } = await execa('git', ['status', '--porcelain'], {
        cwd: this.rootDir
      });
      
      const modified: string[] = [];
      const added: string[] = [];
      const deleted: string[] = [];
      const untracked: string[] = [];
      
      const lines = stdout.split('\n').filter(line => line.trim());
      
      for (const line of lines) {
        const status = line.substring(0, 2);
        const file = line.substring(3).trim();
        
        if (status.includes('M')) modified.push(file);
        if (status.includes('A')) added.push(file);
        if (status.includes('D')) deleted.push(file);
        if (status.includes('?')) untracked.push(file);
      }
      
      return { modified, added, deleted, untracked };
    } catch (error) {
      return { modified: [], added: [], deleted: [], untracked: [] };
    }
  }
  
  async getGitDiff(): Promise<string> {
    const { execa } = await import('execa');
    
    try {
      const { stdout } = await execa('git', ['diff', '--cached'], {
        cwd: this.rootDir
      });
      return stdout;
    } catch (error) {
      return '';
    }
  }
  
  private detectLanguage(filePath: string): string {
    const ext = basename(filePath).split('.').pop()?.toLowerCase();
    
    const languageMap: Record<string, string> = {
      ts: 'typescript',
      tsx: 'typescript',
      js: 'javascript',
      jsx: 'javascript',
      py: 'python',
      java: 'java',
      c: 'c',
      cpp: 'cpp',
      h: 'cpp',
      hpp: 'cpp',
      go: 'go',
      rs: 'rust',
      rb: 'ruby',
      php: 'php',
      sql: 'sql',
      md: 'markdown',
      json: 'json',
      yaml: 'yaml',
      yml: 'yaml',
      xml: 'xml',
      html: 'html',
      css: 'css',
      scss: 'scss',
      sh: 'bash'
    };
    
    return languageMap[ext || ''] || 'text';
  }
  
  async getProjectInfo(): Promise<{
    name: string;
    type: string;
    hasGit: boolean;
    files: number;
  }> {
    let name = basename(this.rootDir);
    let type = 'unknown';
    
    try {
      // Check for package.json
      const packageJson = await this.getFileContent('package.json');
      if (packageJson) {
        const pkg = JSON.parse(packageJson);
        name = pkg.name || name;
        type = 'nodejs';
      }
      
      // Check for requirements.txt
      const requirements = await this.getFileContent('requirements.txt');
      if (requirements) {
        type = 'python';
      }
      
      // Check for Cargo.toml
      const cargoToml = await this.getFileContent('Cargo.toml');
      if (cargoToml) {
        type = 'rust';
      }
      
      // Check for go.mod
      const goMod = await this.getFileContent('go.mod');
      if (goMod) {
        type = 'go';
      }
    } catch (error) {
      // Ignore parsing errors
    }
    
    // Check for git
    const { execa } = await import('execa');
    let hasGit = false;
    try {
      await execa('git', ['rev-parse', '--is-inside-work-tree'], {
        cwd: this.rootDir
      });
      hasGit = true;
    } catch (error) {
      hasGit = false;
    }
    
    // Count files
    const files = await this.getContextFiles();
    
    return { name, type, hasGit, files: files.length };
  }
}

