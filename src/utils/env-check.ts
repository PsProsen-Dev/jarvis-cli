import Config from 'conf';

export async function checkEnv(): Promise<boolean> {
  const config = new Config({ projectName: 'jarvis-qwen-cli' });
  const apiKey = config.get('apiKey');
  
  if (!apiKey) {
    // Check environment variable as fallback
    const envKey = process.env.QWEN_API_KEY || process.env.DASHSCOPE_API_KEY;
    if (!envKey) {
      return false;
    }
    return true;
  }
  
  return true;
}

export function getApiKey(): string {
  const config = new Config({ projectName: 'jarvis-qwen-cli' });
  const apiKey = config.get('apiKey');
  
  if (apiKey) {
    return apiKey as string;
  }
  
  return process.env.QWEN_API_KEY || process.env.DASHSCOPE_API_KEY || '';
}

export function getApiBaseUrl(): string {
  return process.env.QWEN_BASE_URL || 'https://dashscope.aliyuncs.com/api/v1';
}
