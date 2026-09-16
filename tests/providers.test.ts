import {
  PROVIDERS,
  PROVIDER_LIST,
  detectProviderFromKey,
  executeCompletion,
} from '@/lib/providers';

global.fetch = jest.fn();

describe('Providers Library', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.OPENAI_API_KEY;
    delete process.env.ANTHROPIC_API_KEY;
    delete process.env.DEEPSEEK_API_KEY;
    delete process.env.GEMINI_API_KEY;
    delete process.env.GROQ_API_KEY;
    delete process.env.OPENROUTER_API_KEY;
    delete process.env.CUSTOM_API_KEY;
    delete process.env.AI_API_KEY;
  });

  describe('Provider Definitions', () => {
    it('defines all required providers with valid config', () => {
      const expected = ['deepseek', 'openai', 'anthropic', 'gemini', 'groq', 'openrouter', 'custom'];
      expected.forEach((id) => {
        expect(PROVIDERS[id as keyof typeof PROVIDERS]).toBeDefined();
        expect(PROVIDERS[id as keyof typeof PROVIDERS].name).toBeTruthy();
        expect(PROVIDERS[id as keyof typeof PROVIDERS].defaultModel).toBeTruthy();
        expect(PROVIDERS[id as keyof typeof PROVIDERS].defaultBaseUrl).toBeTruthy();
      });
      expect(PROVIDER_LIST.length).toBe(7);
    });
  });

  describe('detectProviderFromKey', () => {
    it('detects Anthropic keys starting with sk-ant-', () => {
      expect(detectProviderFromKey('sk-ant-api03-xxxx')).toBe('anthropic');
    });

    it('detects OpenAI project keys starting with sk-proj-', () => {
      expect(detectProviderFromKey('sk-proj-xxxx')).toBe('openai');
    });

    it('detects Groq keys starting with gsk_', () => {
      expect(detectProviderFromKey('gsk_xxxx')).toBe('groq');
    });

    it('detects Gemini keys starting with AIzaSy', () => {
      expect(detectProviderFromKey('AIzaSyxxxx')).toBe('gemini');
    });

    it('detects OpenRouter keys starting with sk-or-', () => {
      expect(detectProviderFromKey('sk-or-xxxx')).toBe('openrouter');
    });

    it('returns null for unknown prefix or empty key', () => {
      expect(detectProviderFromKey('')).toBeNull();
      expect(detectProviderFromKey('sk-random-unknown-123')).toBeNull();
    });
  });

  describe('executeCompletion', () => {
    it('throws an error if no API key is provided and not local custom', async () => {
      await expect(
        executeCompletion({
          text: 'hello',
          systemPrompt: 'be clear',
          provider: 'openai',
        })
      ).rejects.toThrow(/API key is not configured for OpenAI/);
    });

    it('executes OpenAI-compatible completion successfully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [{ message: { content: 'Polished OpenAI text' } }],
        }),
      });

      const result = await executeCompletion({
        text: 'rough text',
        systemPrompt: 'polish text',
        apiKey: 'sk-proj-test1234',
        provider: 'openai',
      });

      expect(result).toBe('Polished OpenAI text');
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.openai.com/v1/chat/completions',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer sk-proj-test1234',
            'Content-Type': 'application/json',
          }),
        })
      );
    });

    it('executes Anthropic Messages API completion successfully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          content: [{ type: 'text', text: 'Polished Claude text' }],
        }),
      });

      const result = await executeCompletion({
        text: 'rough text',
        systemPrompt: 'polish text',
        apiKey: 'sk-ant-test1234',
        provider: 'anthropic',
      });

      expect(result).toBe('Polished Claude text');
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.anthropic.com/v1/messages',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'x-api-key': 'sk-ant-test1234',
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json',
          }),
        })
      );
    });

    it('allows custom local endpoints without requiring an API key', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [{ message: { content: 'Local Ollama text' } }],
        }),
      });

      const result = await executeCompletion({
        text: 'rough text',
        systemPrompt: 'polish text',
        provider: 'custom',
        customBaseUrl: 'http://localhost:11434/v1',
        model: 'llama3',
      });

      expect(result).toBe('Local Ollama text');
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:11434/v1/chat/completions',
        expect.any(Object)
      );
    });

    it('handles provider error responses with detailed messages', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({
          error: { message: 'Invalid API Key' },
        }),
      });

      await expect(
        executeCompletion({
          text: 'hello',
          systemPrompt: 'polish',
          apiKey: 'bad-key',
          provider: 'groq',
        })
      ).rejects.toThrow(/Invalid API Key/);
    });
  });
});

