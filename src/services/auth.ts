/**
 * ===================================================================
 *  Jarvis Multi-Provider Authentication Service
 *  Supports: ChatGPT, Codex, Gemini, OpenRouter, GitHub Copilot
 * ===================================================================
 */

import Config from 'conf';
import chalk from 'chalk';
import ora from 'ora';
import { randomUUID } from 'crypto';
import { createServer, Server } from 'http';
import { parse } from 'url';
import open from 'open';

export type ProviderType = 
  | 'chatgpt' 
  | 'codex' 
  | 'gemini' 
  | 'gemini-oauth'
  | 'openrouter' 
  | 'github-copilot'
  | 'qwen';

export interface AuthConfig {
  provider: ProviderType;
  apiKey?: string;
  accessToken?: string;
  refreshToken?: string;
  tokenExpiry?: number;
  deviceCode?: string;
  userCode?: string;
  verificationUri?: string;
  expiresIn?: number;
  email?: string;
  accountId?: string;
}

export class AuthService {
  private config: Config;
  
  constructor() {
    this.config = new Config({ 
      projectName: 'jarvis-qwen-cli'
    });
  }
  
  // ========== Generic Auth Methods ==========
  
  async getActiveProvider(): Promise<ProviderType | null> {
    return this.config.get('activeProvider') as ProviderType | null;
  }
  
  async setActiveProvider(provider: ProviderType): Promise<void> {
    this.config.set('activeProvider', provider);
  }
  
  async getAuthConfig(provider?: ProviderType): Promise<AuthConfig | null> {
    const targetProvider = provider || await this.getActiveProvider();
    if (!targetProvider) return null;
    
    return this.config.get(`auth.${targetProvider}`) as AuthConfig | null;
  }
  
  async clearAuth(provider?: ProviderType): Promise<void> {
    if (provider) {
      this.config.delete(`auth.${provider}`);
      if (await this.getActiveProvider() === provider) {
        this.config.delete('activeProvider');
      }
    } else {
      this.config.clear();
    }
  }
  
  async listProviders(): Promise<Array<{ provider: ProviderType; configured: boolean; active: boolean }>> {
    const providers: ProviderType[] = ['chatgpt', 'codex', 'gemini', 'gemini-oauth', 'openrouter', 'github-copilot', 'qwen'];
    const activeProvider = await this.getActiveProvider();
    
    return providers.map(provider => ({
      provider,
      configured: this.config.has(`auth.${provider}`),
      active: activeProvider === provider
    }));
  }
  
  // ========== ChatGPT OAuth ==========
  
  async authenticateChatGPT(): Promise<AuthConfig> {
    const spinner = ora('Starting ChatGPT OAuth...').start();
    
    try {
      // ChatGPT OAuth flow
      const clientId = process.env.CHATGPT_CLIENT_ID || 'default-client';
      const redirectUri = 'http://localhost:8085/callback';
      const state = randomUUID();
      
      spinner.text = 'Opening browser for authentication...';
      
      const authUrl = `https://chatgpt.com/oauth/authorize?` + new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'model.request model.read',
        state: state
      });
      
      await open(authUrl);
      
      // Start local server to catch callback
      const authResult = await this.startOAuthServer(8085, state);
      
      // Exchange code for token
      spinner.text = 'Exchanging authorization code...';
      const tokenResponse = await fetch('https://chatgpt.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: clientId,
          code: authResult.code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri
        })
      });
      
      if (!tokenResponse.ok) {
        throw new Error('Failed to get access token');
      }

      const tokens: any = await tokenResponse.json();

      const authConfig: AuthConfig = {
        provider: 'chatgpt',
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        tokenExpiry: Date.now() + (tokens.expires_in * 1000),
        email: tokens.email || 'user@chatgpt.com'
      };
      
      this.config.set('auth.chatgpt', authConfig);
      this.config.set('activeProvider', 'chatgpt');
      
      spinner.succeed(chalk.green('ChatGPT authenticated successfully!'));
      console.log(chalk.cyan(`   Logged in as: ${authConfig.email}\n`));
      
      return authConfig;
      
    } catch (error) {
      spinner.fail(chalk.red('ChatGPT OAuth failed: ' + (error as Error).message));
      throw error;
    }
  }
  
  // ========== Codex Auth ==========
  
  async authenticateCodex(): Promise<AuthConfig> {
    const spinner = ora('Setting up Codex authentication...').start();
    
    try {
      // Option 1: API Key
      const inquirer = await import('inquirer');
      const { method } = await inquirer.default.prompt([
        {
          type: 'list',
          name: 'method',
          message: 'Choose Codex authentication method:',
          choices: [
            { name: 'API Key', value: 'api-key' },
            { name: 'ChatGPT Auth (codexplan/codexspark)', value: 'chatgpt' }
          ]
        }
      ]);
      
      if (method === 'api-key') {
        const { apiKey } = await inquirer.default.prompt([
          {
            type: 'password',
            name: 'apiKey',
            message: 'Enter your Codex API key:',
            validate: (input: string) => input.length > 0 || 'API key is required'
          }
        ]);
        
        const authConfig: AuthConfig = {
          provider: 'codex',
          apiKey
        };
        
        this.config.set('auth.codex', authConfig);
        this.config.set('activeProvider', 'codex');
        
        spinner.succeed(chalk.green('Codex configured successfully!'));
        return authConfig;
      } else {
        // Use ChatGPT OAuth for Codex
        spinner.text = 'Using ChatGPT authentication for Codex...';
        const chatgptAuth = await this.authenticateChatGPT();
        
        const authConfig: AuthConfig = {
          provider: 'codex',
          accessToken: chatgptAuth.accessToken,
          refreshToken: chatgptAuth.refreshToken,
          tokenExpiry: chatgptAuth.tokenExpiry
        };
        
        this.config.set('auth.codex', authConfig);
        this.config.set('activeProvider', 'codex');
        
        spinner.succeed(chalk.green('Codex configured with ChatGPT auth!'));
        return authConfig;
      }
      
    } catch (error) {
      spinner.fail(chalk.red('Codex auth failed: ' + (error as Error).message));
      throw error;
    }
  }
  
  // ========== Gemini Auth (API Key + OAuth) ==========
  
  async authenticateGemini(): Promise<AuthConfig> {
    const spinner = ora('Setting up Gemini authentication...').start();
    
    try {
      const inquirer = await import('inquirer');
      const { method } = await inquirer.default.prompt([
        {
          type: 'list',
          name: 'method',
          message: 'Choose Gemini authentication method:',
          choices: [
            { name: 'API Key (Recommended)', value: 'api-key' },
            { name: 'Google OAuth', value: 'oauth' }
          ]
        }
      ]);
      
      if (method === 'api-key') {
        const { apiKey } = await inquirer.default.prompt([
          {
            type: 'password',
            name: 'apiKey',
            message: 'Enter your Gemini API key:',
            validate: (input: string) => input.length > 0 || 'API key is required'
          }
        ]);
        
        const authConfig: AuthConfig = {
          provider: 'gemini',
          apiKey
        };
        
        this.config.set('auth.gemini', authConfig);
        this.config.set('activeProvider', 'gemini');
        
        spinner.succeed(chalk.green('Gemini configured successfully!'));
        console.log(chalk.cyan('   Get your API key from: https://aistudio.google.com/apikey\n'));
        
        return authConfig;
      } else {
        return await this.authenticateGeminiOAuth();
      }
      
    } catch (error) {
      spinner.fail(chalk.red('Gemini auth failed: ' + (error as Error).message));
      throw error;
    }
  }
  
  async authenticateGeminiOAuth(): Promise<AuthConfig> {
    const spinner = ora('Starting Gemini OAuth...').start();
    
    try {
      const clientId = process.env.GEMINI_CLIENT_ID || 'default-client';
      const redirectUri = 'http://localhost:8086/callback';
      const state = randomUUID();
      
      spinner.text = 'Opening browser for Google authentication...';
      
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` + new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'https://www.googleapis.com/auth/generative-language',
        state: state,
        access_type: 'offline',
        prompt: 'consent'
      });
      
      await open(authUrl);
      
      const authResult = await this.startOAuthServer(8086, state);
      
      spinner.text = 'Exchanging authorization code...';
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: process.env.GEMINI_CLIENT_SECRET,
          code: authResult.code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri
        })
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to get access token');
      }

      const tokens: any = await tokenResponse.json();

      const authConfig: AuthConfig = {
        provider: 'gemini-oauth',
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        tokenExpiry: Date.now() + (tokens.expires_in * 1000)
      };
      
      this.config.set('auth.gemini-oauth', authConfig);
      this.config.set('activeProvider', 'gemini-oauth');
      
      spinner.succeed(chalk.green('Gemini OAuth configured successfully!'));
      
      return authConfig;
      
    } catch (error) {
      spinner.fail(chalk.red('Gemini OAuth failed: ' + (error as Error).message));
      throw error;
    }
  }
  
  // ========== OpenRouter Auth ==========
  
  async authenticateOpenRouter(): Promise<AuthConfig> {
    const spinner = ora('Setting up OpenRouter authentication...').start();
    
    try {
      console.log(chalk.cyan('\nðŸ“ Get your OpenRouter API key from:'));
      console.log(chalk.yellow('   https://openrouter.ai/keys\n'));
      
      const inquirer = await import('inquirer');
      const { apiKey } = await inquirer.default.prompt([
        {
          type: 'password',
          name: 'apiKey',
          message: 'Enter your OpenRouter API key:',
          validate: (input: string) => input.length > 0 || 'API key is required'
        }
      ]);
      
      const authConfig: AuthConfig = {
        provider: 'openrouter',
        apiKey
      };
      
      this.config.set('auth.openrouter', authConfig);
      this.config.set('activeProvider', 'openrouter');
      
      spinner.succeed(chalk.green('OpenRouter configured successfully!'));
      
      return authConfig;
      
    } catch (error) {
      spinner.fail(chalk.red('OpenRouter auth failed: ' + (error as Error).message));
      throw error;
    }
  }
  
  // ========== GitHub Copilot Device Login ==========
  
  async authenticateGitHubCopilot(): Promise<AuthConfig> {
    const spinner = ora('Starting GitHub Copilot device login...').start();
    
    try {
      // Step 1: Get device code
      spinner.text = 'Requesting device code from GitHub...';
      
      const deviceResponse = await fetch('https://github.com/login/device/code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          client_id: process.env.COPILOT_CLIENT_ID || 'Iv1.b507a08c87ecfe98'
        })
      });
      
      if (!deviceResponse.ok) {
        throw new Error('Failed to get device code');
      }
      
      const deviceData: any = await deviceResponse.json();
      
      const deviceCode = deviceData.device_code;
      const userCode = deviceData.user_code;
      const verificationUri = deviceData.verification_uri;
      const expiresIn = deviceData.expires_in;
      const interval = deviceData.interval || 5;
      
      // Show user code
      spinner.stop();
      console.log(chalk.cyan('\nðŸ” GitHub Copilot Authentication\n'));
      console.log(chalk.white('1. Open this URL in your browser:'));
      console.log(chalk.yellow(`   ${verificationUri}\n`));
      console.log(chalk.white('2. Enter this code:'));
      console.log(chalk.green(`   ${userCode}\n`));
      console.log(chalk.gray(`   Code expires in ${Math.floor(expiresIn / 60)} minutes\n`));
      
      spinner.start('Waiting for authorization...');
      
      // Poll for token
      const accessToken = await this.pollForToken(deviceCode, interval, expiresIn);
      
      const authConfig: AuthConfig = {
        provider: 'github-copilot',
        accessToken,
        tokenExpiry: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      };
      
      this.config.set('auth.github-copilot', authConfig);
      this.config.set('activeProvider', 'github-copilot');
      
      spinner.succeed(chalk.green('GitHub Copilot authenticated successfully!'));
      
      return authConfig;
      
    } catch (error) {
      spinner.fail(chalk.red('GitHub Copilot auth failed: ' + (error as Error).message));
      throw error;
    }
  }
  
  private async pollForToken(deviceCode: string, interval: number, expiresIn: number): Promise<string> {
    const startTime = Date.now();
    const maxTime = expiresIn * 1000;
    
    while (Date.now() - startTime < maxTime) {
      await new Promise(resolve => setTimeout(resolve, interval * 1000));
      
      const response = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          client_id: process.env.COPILOT_CLIENT_ID || 'Iv1.b507a08c87ecfe98',
          device_code: deviceCode,
          grant_type: 'urn:ietf:params:oauth:grant-type:device_code'
        })
      });
      
      const data: any = await response.json();
      
      if (data.access_token) {
        return data.access_token;
      }
      
      if (data.error === 'expired_token') {
        throw new Error('Device code expired. Please try again.');
      }
      
      // Continue polling for other errors (authorization_pending)
    }
    
    throw new Error('Authorization timeout. Please try again.');
  }
  
  // ========== Qwen Auth (API Key) ==========
  
  async authenticateQwen(): Promise<AuthConfig> {
    const spinner = ora('Setting up Qwen authentication...').start();
    
    try {
      const inquirer = await import('inquirer');
      const { apiKey } = await inquirer.default.prompt([
        {
          type: 'password',
          name: 'apiKey',
          message: 'Enter your Qwen API key:',
          validate: (input: string) => input.length > 0 || 'API key is required'
        }
      ]);
      
      const authConfig: AuthConfig = {
        provider: 'qwen',
        apiKey
      };
      
      this.config.set('auth.qwen', authConfig);
      this.config.set('activeProvider', 'qwen');
      
      spinner.succeed(chalk.green('Qwen configured successfully!'));
      console.log(chalk.cyan('   Get your API key from: https://dashscope.console.aliyun.com/\n'));
      
      return authConfig;
      
    } catch (error) {
      spinner.fail(chalk.red('Qwen auth failed: ' + (error as Error).message));
      throw error;
    }
  }
  
  // ========== OAuth Server Helper ==========
  
  private startOAuthServer(port: number, expectedState: string): Promise<{ code: string }> {
    return new Promise((resolve, reject) => {
      let server: Server;
      
      const timeout = setTimeout(() => {
        if (server) server.close();
        reject(new Error('OAuth timeout'));
      }, 5 * 60 * 1000); // 5 minutes
      
      server = createServer((req, res) => {
        const parsedUrl = parse(req.url || '', true);
        
        if (parsedUrl.pathname === '/callback') {
          const { code, state } = parsedUrl.query;
          
          if (state !== expectedState) {
            res.writeHead(400);
            res.end('Invalid state parameter');
            reject(new Error('State mismatch'));
            return;
          }
          
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(`
            <html>
              <head>
                <title>Authentication Successful</title>
                <style>
                  body { font-family: Arial; text-align: center; padding: 50px; }
                  h1 { color: #4CAF50; }
                  p { color: #666; }
                </style>
              </head>
              <body>
                <h1>âœ… Authentication Successful!</h1>
                <p>You can close this window and return to Jarvis CLI.</p>
              </body>
            </html>
          `);
          
          clearTimeout(timeout);
          server.close();
          resolve({ code: code as string });
        } else {
          res.writeHead(404);
          res.end('Not found');
        }
      });
      
      server.listen(port, () => {
        console.log(chalk.gray(`   OAuth server listening on port ${port}`));
      });
      
      server.on('error', reject);
    });
  }
  
  // ========== Token Management ==========
  
  async getAccessToken(provider?: ProviderType): Promise<string | null> {
    const authConfig = await this.getAuthConfig(provider);
    if (!authConfig) return null;
    
    // Check if token is expired
    if (authConfig.tokenExpiry && Date.now() > authConfig.tokenExpiry) {
      // Token expired, try to refresh
      if (authConfig.refreshToken) {
        await this.refreshToken(provider!);
        const newAuthConfig = await this.getAuthConfig(provider);
        return newAuthConfig?.accessToken || authConfig.apiKey || null;
      }
    }
    
    return authConfig.accessToken || authConfig.apiKey || null;
  }
  
  private async refreshToken(provider: ProviderType): Promise<void> {
    const authConfig = await this.getAuthConfig(provider);
    if (!authConfig || !authConfig.refreshToken) return;
    
    try {
      let tokenUrl = '';
      let params: Record<string, string> = {};
      
      if (provider === 'chatgpt' || provider === 'codex') {
        tokenUrl = 'https://chatgpt.com/oauth/token';
        params = {
          client_id: process.env.CHATGPT_CLIENT_ID || 'default-client',
          grant_type: 'refresh_token',
          refresh_token: authConfig.refreshToken
        };
      } else if (provider === 'gemini-oauth') {
        tokenUrl = 'https://oauth2.googleapis.com/token';
        params = {
          client_id: process.env.GEMINI_CLIENT_ID || 'default-client',
          client_secret: process.env.GEMINI_CLIENT_SECRET || '',
          grant_type: 'refresh_token',
          refresh_token: authConfig.refreshToken
        };
      }
      
      if (!tokenUrl) return;
      
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      
      if (response.ok) {
        const tokens: any = await response.json();
        authConfig.accessToken = tokens.access_token;
        authConfig.tokenExpiry = Date.now() + (tokens.expires_in * 1000);
        this.config.set(`auth.${provider}`, authConfig);
      }
    } catch (error) {
      console.error(chalk.yellow('Token refresh failed:'), (error as Error).message);
    }
  }
}


