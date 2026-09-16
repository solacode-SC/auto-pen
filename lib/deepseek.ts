import { WritingType } from './types';
import { getSystemPrompt } from './prompts';
import { executeCompletion, AIProvider } from './providers';

export interface ImproveOptions {
  provider?: AIProvider;
  model?: string;
  customBaseUrl?: string;
}

export async function improveText(
  text: string,
  type: WritingType,
  customApiKey?: string,
  options?: ImproveOptions
): Promise<string> {
  const systemPrompt = getSystemPrompt(type);

  return executeCompletion({
    text,
    systemPrompt,
    apiKey: customApiKey,
    provider: options?.provider,
    model: options?.model,
    customBaseUrl: options?.customBaseUrl,
  });
}
