import { validateImproveRequest } from '@/lib/validation';
import { MAX_INPUT_LENGTH, VALID_WRITING_TYPES } from '@/lib/types';

describe('validateImproveRequest', () => {
  it('rejects an empty body (null/undefined)', () => {
    expect(validateImproveRequest(null).valid).toBe(false);
    expect(validateImproveRequest(undefined).valid).toBe(false);
  });

  it('rejects a missing text field', () => {
    expect(validateImproveRequest({ type: 'message' }).valid).toBe(false);
  });

  it('rejects empty text (whitespace only)', () => {
    expect(validateImproveRequest({ text: '   ', type: 'message' }).valid).toBe(false);
  });

  it('rejects text that is not a string', () => {
    expect(validateImproveRequest({ text: 123, type: 'message' }).valid).toBe(false);
    expect(validateImproveRequest({ text: {}, type: 'message' }).valid).toBe(false);
  });

  it('rejects a missing type field', () => {
    expect(validateImproveRequest({ text: 'Hello' }).valid).toBe(false);
  });

  it('rejects an invalid type', () => {
    expect(validateImproveRequest({ text: 'Hello', type: 'blog' }).valid).toBe(false);
  });

  it('rejects oversized text', () => {
    const oversizedText = 'a'.repeat(MAX_INPUT_LENGTH + 1);
    expect(validateImproveRequest({ text: oversizedText, type: 'message' }).valid).toBe(false);
  });

  it('accepts all valid types', () => {
    VALID_WRITING_TYPES.forEach((type) => {
      const result = validateImproveRequest({ text: 'Hello', type });
      expect(result.valid).toBe(true);
    });
  });

  it('accepts a valid request with text and type', () => {
    const result = validateImproveRequest({ text: 'Valid text input', type: 'email' });
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });
});
