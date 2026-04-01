import fetch from 'node-fetch';
import { getApiKey, getApiBaseUrl } from '../utils/env-check';
import chalk from 'chalk';

export interface QwenMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface QwenOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export class QwenAI {
  private apiKey: string;
  private baseUrl: string;
  
  constructor() {
    this.apiKey = getApiKey();
    this.baseUrl = getApiBaseUrl();
  }
  
  async chat(messages: QwenMessage[], options: QwenOptions = {}): Promise<string> {
    const {
      model = 'qwen-coder-plus',
      temperature = 0.7,
      maxTokens = 4096,
      stream = false
    } = options;
    
    const url = `${this.baseUrl}/services/aigc/text-generation/generate`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model,
        input: {
          messages
        },
        parameters: {
          temperature,
          max_tokens: maxTokens,
          result_format: 'message'
        }
      })
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Qwen API Error: ${response.status} - ${error}`);
    }
    
    const data: any = await response.json();
    return data.output?.choices?.[0]?.message?.content || 'No response from AI';
  }
  
  async chatWithStream(
    messages: QwenMessage[],
    onChunk: (chunk: string) => void,
    options: QwenOptions = {}
  ): Promise<string> {
    const {
      model = 'qwen-coder-plus',
      temperature = 0.7,
      maxTokens = 4096
    } = options;
    
    const url = `${this.baseUrl}/services/aigc/text-generation/generate`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model,
        input: {
          messages
        },
        parameters: {
          temperature,
          max_tokens: maxTokens,
          result_format: 'message',
          incremental_output: true
        }
      })
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Qwen API Error: ${response.status} - ${error}`);
    }
    
    const data: any = await response.json();
    const content = data.output?.choices?.[0]?.message?.content || '';
    
    if (content && onChunk) {
      onChunk(content);
    }
    
    return content;
  }
  
  async explainCode(code: string, language?: string): Promise<string> {
    const systemPrompt = `You are an expert code explainer. Explain code in a clear, concise manner.
Use Hinglish (70% Romanized Hindi + 30% English) for explanations.
Keep it practical and focused on what the code does.`;
    
    const userPrompt = language
      ? `Explain this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``
      : `Explain this code:\n\n\`\`\`\n${code}\n\`\`\``;
    
    const messages: QwenMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];
    
    return this.chat(messages, { model: 'qwen-coder-plus' });
  }
  
  async refactorCode(code: string, focus?: string): Promise<string> {
    const systemPrompt = `You are an expert code refactoring assistant.
Provide practical refactoring suggestions with code examples.
Use Hinglish for explanations.
Focus on: ${focus || 'readability, performance, and best practices'}`;
    
    const userPrompt = `Refactor this code:\n\n\`\`\`\n${code}\n\`\`\``;
    
    const messages: QwenMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];
    
    return this.chat(messages, { model: 'qwen-coder-plus' });
  }
  
  async generateCommitMessage(changes: string): Promise<string> {
    const systemPrompt = `You are an expert at writing git commit messages.
Follow conventional commit format: <type>(<scope>): <description>
Types: feat, fix, docs, style, refactor, test, chore
Use Hinglish for the description when appropriate.
Keep it concise and meaningful.`;
    
    const userPrompt = `Generate a commit message for these changes:\n\n${changes}`;
    
    const messages: QwenMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];
    
    return this.chat(messages, { model: 'qwen-coder-plus', maxTokens: 256 });
  }
  
  async analyzeCodebase(files: Array<{ path: string; content: string }>): Promise<string> {
    const systemPrompt = `You are a senior code reviewer. Analyze the codebase and provide insights.
Use Hinglish for explanations.
Focus on architecture, patterns, and potential improvements.`;
    
    const filesSummary = files
      .map(f => `## ${f.path}\n\n\`\`\`\n${f.content.substring(0, 1000)}...\n\`\`\``)
      .join('\n\n');
    
    const userPrompt = `Analyze this codebase:\n\n${filesSummary}`;
    
    const messages: QwenMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];
    
    return this.chat(messages, { model: 'qwen-coder-plus', maxTokens: 4096 });
  }
}

