export type AIProvider =
  | 'deepseek'
  | 'openai'
  | 'anthropic'
  | 'gemini'
  | 'groq'
  | 'openrouter'
  | 'custom';

export interface ProviderInfo {
  id: AIProvider;
  name: string;
  badge: string;
  description: string;
  placeholder: string;
  defaultModel: string;
  defaultBaseUrl: string;
  protocol: 'openai-compatible' | 'anthropic';
  detectPrefixes: string[];
}

export const PROVIDERS: Record<AIProvider, ProviderInfo> = {
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek',
    badge: '✦',
    description: 'DeepSeek Chat (V3 / R1) models for high quality writing enhancement.',
    placeholder: 'sk-...',
    defaultModel: 'deepseek-chat',
    defaultBaseUrl: 'https://api.deepseek.com',
    protocol: 'openai-compatible',
    detectPrefixes: [],
  },
  openai: {
    id: 'openai',
    name: 'OpenAI',
    badge: '⚡',
    description: 'GPT-4o Mini, GPT-4o, and other OpenAI models.',
    placeholder: 'sk-proj-... or sk-...',
    defaultModel: 'gpt-4o-mini',
    defaultBaseUrl: 'https://api.openai.com',
    protocol: 'openai-compatible',
    detectPrefixes: ['sk-proj-'],
  },
  anthropic: {
    id: 'anthropic',
    name: 'Anthropic',
    badge: ' Claude',
    description: 'Claude 3.5 Haiku, Claude 3.5 Sonnet, and other Anthropic Claude models.',
    placeholder: 'sk-ant-...',
    defaultModel: 'claude-3-5-haiku-20241022',
    defaultBaseUrl: 'https://api.anthropic.com',
    protocol: 'anthropic',
    detectPrefixes: ['sk-ant-'],
  },
  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    badge: '✦',
    description: 'Gemini 2.0 Flash, Gemini 1.5 Flash/Pro models via official OpenAI-compatible endpoint.',
    placeholder: 'AIzaSy...',
    defaultModel: 'gemini-2.0-flash',
    defaultBaseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
    protocol: 'openai-compatible',
    detectPrefixes: ['AIzaSy'],
  },
  groq: {
    id: 'groq',
    name: 'Groq',
    badge: '⚡',
    description: 'Ultra-fast Llama 3.3 70B and other open models on Groq LPUs.',
    placeholder: 'gsk_...',
    defaultModel: 'llama-3.3-70b-versatile',
    defaultBaseUrl: 'https://api.groq.com/openai',
    protocol: 'openai-compatible',
    detectPrefixes: ['gsk_'],
  },
  openrouter: {
    id: 'openrouter',
    name: 'OpenRouter',
    badge: '∞',
    description: 'Unified gateway to hundreds of AI models from multiple labs.',
    placeholder: 'sk-or-...',
    defaultModel: 'deepseek/deepseek-chat',
    defaultBaseUrl: 'https://openrouter.ai/api',
    protocol: 'openai-compatible',
    detectPrefixes: ['sk-or-'],
  },
  custom: {
    id: 'custom',
    name: 'Custom / Local',
    badge: '⚙',
    description: 'Connect to any OpenAI-compatible server (Ollama, LM Studio, vLLM, local gateway).',
    placeholder: 'API key (optional for local models)',
    defaultModel: 'llama3',
    defaultBaseUrl: 'http://localhost:11434/v1',
    protocol: 'openai-compatible',
    detectPrefixes: [],
  },
};

export const PROVIDER_LIST: ProviderInfo[] = Object.values(PROVIDERS);

/**
 * Detect provider from an API key format.
 */
export function detectProviderFromKey(key: string): AIProvider | null {
  const trimmed = key.trim();
  if (!trimmed) return null;

  for (const provider of PROVIDER_LIST) {
    for (const prefix of provider.detectPrefixes) {
      if (trimmed.startsWith(prefix)) {
        return provider.id;
      }
    }
  }

  return null;
}

export interface CompletionOptions {
  text: string;
  systemPrompt: string;
  apiKey?: string;
  provider?: AIProvider;
  model?: string;
  customBaseUrl?: string;
}

function resolveProviderEnvKey(provider: AIProvider): string | undefined {
  switch (provider) {
    case 'deepseek':
      return process.env.DEEPSEEK_API_KEY;
    case 'openai':
      return process.env.OPENAI_API_KEY;
    case 'anthropic':
      return process.env.ANTHROPIC_API_KEY;
    case 'gemini':
      return process.env.GEMINI_API_KEY;
    case 'groq':
      return process.env.GROQ_API_KEY;
    case 'openrouter':
      return process.env.OPENROUTER_API_KEY;
    case 'custom':
      return process.env.CUSTOM_API_KEY || process.env.AI_API_KEY;
  }
}

function resolveProviderEnvModel(provider: AIProvider): string | undefined {
  switch (provider) {
    case 'deepseek':
      return process.env.DEEPSEEK_MODEL;
    case 'openai':
      return process.env.OPENAI_MODEL;
    case 'anthropic':
      return process.env.ANTHROPIC_MODEL;
    case 'gemini':
      return process.env.GEMINI_MODEL;
    case 'groq':
      return process.env.GROQ_MODEL;
    case 'openrouter':
      return process.env.OPENROUTER_MODEL;
    case 'custom':
      return process.env.CUSTOM_MODEL || process.env.AI_MODEL;
  }
}

function resolveProviderEnvBaseUrl(provider: AIProvider): string | undefined {
  switch (provider) {
    case 'deepseek':
      return process.env.DEEPSEEK_BASE_URL;
    case 'openai':
      return process.env.OPENAI_BASE_URL;
    case 'anthropic':
      return process.env.ANTHROPIC_BASE_URL;
    case 'gemini':
      return process.env.GEMINI_BASE_URL;
    case 'groq':
      return process.env.GROQ_BASE_URL;
    case 'openrouter':
      return process.env.OPENROUTER_BASE_URL;
    case 'custom':
      return process.env.CUSTOM_BASE_URL || process.env.AI_BASE_URL;
  }
}

function normalizeUrl(baseUrl: string, endpoint: string): string {
  let cleanBase = baseUrl.trim().replace(/\/+$/, '');
  let cleanEndpoint = endpoint.trim().replace(/^\/+/, '');

  // If endpoint is /v1/chat/completions and cleanBase already ends in /v1
  if (cleanBase.endsWith('/v1') && cleanEndpoint.startsWith('v1/')) {
    cleanEndpoint = cleanEndpoint.replace(/^v1\//, '');
  }

  return `${cleanBase}/${cleanEndpoint}`;
}

export async function executeCompletion(options: CompletionOptions): Promise<string> {
  const providerId: AIProvider = options.provider && PROVIDERS[options.provider]
    ? options.provider
    : (process.env.AI_PROVIDER as AIProvider) && PROVIDERS[process.env.AI_PROVIDER as AIProvider]
      ? (process.env.AI_PROVIDER as AIProvider)
      : 'deepseek';

  const providerConfig = PROVIDERS[providerId];

  // Resolve API Key
  let apiKey = options.apiKey?.trim() || resolveProviderEnvKey(providerId) || process.env.AI_API_KEY;
  if (!apiKey && providerId === 'deepseek') {
    apiKey = process.env.DEEPSEEK_API_KEY;
  }

  const baseUrl = options.customBaseUrl?.trim()
    || resolveProviderEnvBaseUrl(providerId)
    || providerConfig.defaultBaseUrl;

  const isLocalCustom = providerId === 'custom' && (baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1'));

  if (!apiKey && !isLocalCustom) {
    throw new Error(
      `API key is not configured for ${providerConfig.name}. Please enter your key in Settings or set ${providerId.toUpperCase()}_API_KEY.`
    );
  }

  // Resolve model
  const model = options.model?.trim()
    || resolveProviderEnvModel(providerId)
    || process.env.AI_MODEL
    || providerConfig.defaultModel;

  if (providerConfig.protocol === 'anthropic') {
    return executeAnthropicCompletion({
      text: options.text,
      systemPrompt: options.systemPrompt,
      apiKey: apiKey || '',
      baseUrl,
      model,
    });
  }

  return executeOpenAICompatibleCompletion({
    text: options.text,
    systemPrompt: options.systemPrompt,
    apiKey: apiKey || 'dummy-key',
    baseUrl,
    model,
    provider: providerId,
  });
}

async function executeOpenAICompatibleCompletion(params: {
  text: string;
  systemPrompt: string;
  apiKey: string;
  baseUrl: string;
  model: string;
  provider: AIProvider;
}): Promise<string> {
  const targetUrl = normalizeUrl(params.baseUrl, 'v1/chat/completions');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${params.apiKey}`,
  };

  if (params.provider === 'openrouter') {
    headers['HTTP-Referer'] = 'https://polish.app';
    headers['X-Title'] = 'Polish';
  }

  const response = await fetch(targetUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: params.model,
      messages: [
        { role: 'system', content: params.systemPrompt },
        { role: 'user', content: params.text },
      ],
      temperature: 0.3,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    let errorMessage = `API request to ${PROVIDERS[params.provider].name} failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData.error) {
        if (typeof errorData.error === 'string') {
          errorMessage += `: ${errorData.error}`;
        } else if (errorData.error.message) {
          errorMessage += `: ${errorData.error.message}`;
        }
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
}

async function executeAnthropicCompletion(params: {
  text: string;
  systemPrompt: string;
  apiKey: string;
  baseUrl: string;
  model: string;
}): Promise<string> {
  const targetUrl = normalizeUrl(params.baseUrl, 'v1/messages');

  const response = await fetch(targetUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': params.apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: params.model,
      system: params.systemPrompt,
      messages: [
        { role: 'user', content: params.text },
      ],
      max_tokens: 4096,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    let errorMessage = `Anthropic API request failed with status ${response.status}`;
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

  if (!data.content || !Array.isArray(data.content) || data.content.length === 0) {
    throw new Error('Malformed response from Anthropic: missing content array');
  }

  const textBlock = data.content.find((block: { type?: string; text?: string }) => block.type === 'text');
  const resultText = textBlock?.text || data.content[0]?.text;

  if (typeof resultText !== 'string') {
    throw new Error('Malformed response from Anthropic: missing text in content block');
  }

  return resultText.trim();
}

