import { WritingType } from './types';
import { getSystemPrompt } from './prompts';

export async function improveText(text: string, type: WritingType, customApiKey?: string): Promise<string> {
  const apiKey = customApiKey?.trim() || process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY is not set. Please provide an API key in Settings or set DEEPSEEK_API_KEY.');
  }

  const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';
  const baseUrl = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';

  const systemPrompt = getSystemPrompt(type);

  try {
    const response = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text },
        ],
        temperature: 0.3,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      let errorMessage = `API request failed with status ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.error && errorData.error.message) {
          errorMessage += `: ${errorData.error.message}`;
        }
      } catch {
        // Ignore json parse error
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();

    if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
      throw new Error('Malformed response: missing choices array');
    }

    const content = data.choices[0]?.message?.content;
    if (typeof content !== 'string') {
      throw new Error('Malformed response: missing message content');
    }

    return content.trim();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unknown error occurred while communicating with DeepSeek API');
  }
}
