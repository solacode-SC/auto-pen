import { getSystemPrompt } from '@/lib/prompts';
import { VALID_WRITING_TYPES } from '@/lib/types';

describe('getSystemPrompt', () => {
  it('returns a non-empty string for every valid writing type', () => {
    VALID_WRITING_TYPES.forEach((type) => {
      const prompt = getSystemPrompt(type);
      expect(typeof prompt).toBe('string');
      expect(prompt.length).toBeGreaterThan(0);
    });
  });

  it('contains relevant keywords for each type', () => {
    expect(getSystemPrompt('email').toLowerCase()).toContain('email');
    
    const messagePrompt = getSystemPrompt('message').toLowerCase();
    expect(messagePrompt.includes('message') || messagePrompt.includes('casual')).toBe(true);
    
    expect(getSystemPrompt('comment').toLowerCase()).toContain('comment');
    
    const postPrompt = getSystemPrompt('post').toLowerCase();
    expect(postPrompt.includes('social media') || postPrompt.includes('post')).toBe(true);
    
    const tweetPrompt = getSystemPrompt('tweet').toLowerCase();
    expect(tweetPrompt.includes('twitter') || tweetPrompt.includes('x/twitter') || tweetPrompt.includes('post')).toBe(true);
    
    expect(getSystemPrompt('professional').toLowerCase()).toContain('professional');
    
    const casualPrompt = getSystemPrompt('casual').toLowerCase();
    expect(casualPrompt.includes('casual') || casualPrompt.includes('conversational')).toBe(true);
  });

  it('contains the base instruction about preserving meaning in all prompts', () => {
    VALID_WRITING_TYPES.forEach((type) => {
      const prompt = getSystemPrompt(type).toLowerCase();
      expect(prompt).toContain('preserve the original meaning');
    });
  });

  it('contains instruction to return ONLY the improved text in all prompts', () => {
    VALID_WRITING_TYPES.forEach((type) => {
      const prompt = getSystemPrompt(type).toLowerCase();
      expect(prompt.includes('return only the improved') || prompt.includes('return only the final')).toBe(true);
    });
  });

  it('contains instruction about grammar in all prompts', () => {
    VALID_WRITING_TYPES.forEach((type) => {
      const prompt = getSystemPrompt(type).toLowerCase();
      expect(prompt).toContain('grammar');
    });
  });
});
