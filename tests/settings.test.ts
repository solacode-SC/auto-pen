import {
  loadSettings,
  saveSettings,
  getAccentVars,
  DEFAULT_SETTINGS,
  ACCENT_COLORS,
  type AppSettings,
} from '@/lib/settings';

describe('Settings Library', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('loads default settings when localStorage is empty', () => {
    const settings = loadSettings();
    expect(settings).toEqual(DEFAULT_SETTINGS);
    expect(settings.theme).toBe('light');
    expect(settings.accent).toBe('coral');
    expect(settings.apiKey).toBe('');
  });

  it('saves and loads custom settings from localStorage', () => {
    const custom: AppSettings = {
      apiKey: 'sk-my-test-key',
      theme: 'dark',
      accent: 'purple',
    };

    saveSettings(custom);
    const loaded = loadSettings();

    expect(loaded).toEqual(custom);
    expect(loaded.theme).toBe('dark');
    expect(loaded.accent).toBe('purple');
    expect(loaded.apiKey).toBe('sk-my-test-key');
  });

  it('handles corrupted JSON in localStorage gracefully', () => {
    localStorage.setItem('polish-settings', '{corrupted json...');
    const loaded = loadSettings();
    expect(loaded).toEqual(DEFAULT_SETTINGS);
  });

  it('sanitizes invalid theme or accent values from storage', () => {
    localStorage.setItem(
      'polish-settings',
      JSON.stringify({
        apiKey: 12345, // invalid type
        theme: 'neon', // invalid theme
        accent: 'gold', // invalid accent
      })
    );

    const loaded = loadSettings();
    expect(loaded.apiKey).toBe('');
    expect(loaded.theme).toBe('light');
    expect(loaded.accent).toBe('coral');
  });

  it('returns valid CSS variables for all accent colors', () => {
    ACCENT_COLORS.forEach((accent) => {
      const vars = getAccentVars(accent.value);
      expect(vars['--accent']).toBeDefined();
      expect(vars['--accent']).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(vars['--accent-hover']).toBeDefined();
    });
  });
});

