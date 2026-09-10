/**
 * @jest-environment node
 */

import { POST } from '@/app/api/improve/route';
import { GET } from '@/app/api/health/route';
import { improveText } from '@/lib/deepseek';
import { checkRateLimit } from '@/lib/rate-limit';

jest.mock('@/lib/deepseek', () => ({
  improveText: jest.fn(),
}));

jest.mock('@/lib/rate-limit', () => ({
  checkRateLimit: jest.fn(),
}));

function createRequest(body: unknown): Request {
  return new Request('http://localhost:3000/api/improve', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/improve', () => {
    it('returns a successful response for a valid request', async () => {
      (checkRateLimit as jest.Mock).mockReturnValue({ allowed: true });
      (improveText as jest.Mock).mockResolvedValue('Improved text here');

      const req = createRequest({ text: 'hello', type: 'message' });
      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json).toEqual({ success: true, text: 'Improved text here' });
    });

    it('forwards custom API key from body to improveText', async () => {
      (checkRateLimit as jest.Mock).mockReturnValue({ allowed: true });
      (improveText as jest.Mock).mockResolvedValue('Improved with custom key');

      const req = createRequest({ text: 'hello', type: 'message', apiKey: 'sk-custom-123' });
      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json).toEqual({ success: true, text: 'Improved with custom key' });
      expect(improveText).toHaveBeenCalledWith('hello', 'message', 'sk-custom-123');
    });

    it('forwards custom API key from x-api-key header to improveText', async () => {
      (checkRateLimit as jest.Mock).mockReturnValue({ allowed: true });
      (improveText as jest.Mock).mockResolvedValue('Improved with header key');

      const req = new Request('http://localhost:3000/api/improve', {
        method: 'POST',
        body: JSON.stringify({ text: 'hello', type: 'message' }),
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'sk-header-key-456',
        },
      });
      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json).toEqual({ success: true, text: 'Improved with header key' });
      expect(improveText).toHaveBeenCalledWith('hello', 'message', 'sk-header-key-456');
    });

    it('returns a 500 when improveText throws an Error', async () => {
      (checkRateLimit as jest.Mock).mockReturnValue({ allowed: true });
      (improveText as jest.Mock).mockRejectedValue(new Error('DeepSeek API error'));

      const req = createRequest({ text: 'hello', type: 'message' });
      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(500);
      expect(json.success).toBe(false);
      expect(json.error).toBeDefined();
    });

    it('returns a 400 for a request with missing text', async () => {
      (checkRateLimit as jest.Mock).mockReturnValue({ allowed: true });

      const req = createRequest({ type: 'message' });
      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.success).toBe(false);
      expect(json.error).toBeDefined();
    });

    it('returns a 400 for a request with empty text', async () => {
      (checkRateLimit as jest.Mock).mockReturnValue({ allowed: true });

      const req = createRequest({ text: '   ', type: 'message' });
      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.success).toBe(false);
    });

    it('returns a 400 for an invalid type', async () => {
      (checkRateLimit as jest.Mock).mockReturnValue({ allowed: true });

      const req = createRequest({ text: 'hello', type: 'invalid_type' });
      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.success).toBe(false);
    });

    it('returns a 429 when rate limited', async () => {
      (checkRateLimit as jest.Mock).mockReturnValue({ allowed: false, retryAfterMs: 30000 });

      const req = createRequest({ text: 'hello', type: 'message' });
      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(429);
      expect(json.success).toBe(false);
      expect(json.error).toContain('Too many requests');
    });
  });

  describe('GET /api/health', () => {
    it('returns ok status', async () => {
      const res = await GET();
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json).toEqual({ status: 'ok' });
    });
  });
});
