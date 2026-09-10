import { WritingType, VALID_WRITING_TYPES, MAX_INPUT_LENGTH } from './types';

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateImproveRequest(body: unknown): ValidationResult {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Invalid request body.' };
  }

  const { text, type } = body as Record<string, unknown>;

  if (text === undefined || text === null) {
    return { valid: false, error: 'Text is required.' };
  }

  if (typeof text !== 'string') {
    return { valid: false, error: 'Text must be a string.' };
  }

  if (text.trim().length === 0) {
    return { valid: false, error: 'Text cannot be empty.' };
  }

  if (text.length > MAX_INPUT_LENGTH) {
    return { valid: false, error: `Text exceeds maximum length of ${MAX_INPUT_LENGTH} characters.` };
  }

  if (!type) {
    return { valid: false, error: 'Writing type is required.' };
  }

  if (typeof type !== 'string') {
    return { valid: false, error: 'Writing type must be a string.' };
  }

  if (!VALID_WRITING_TYPES.includes(type as WritingType)) {
    return { valid: false, error: `Invalid writing type. Must be one of: ${VALID_WRITING_TYPES.join(', ')}.` };
  }

  return { valid: true };
}
