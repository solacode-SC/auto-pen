export type ThemeMode = 'light' | 'dark';

export type AccentColor = 'coral' | 'purple' | 'blue' | 'green' | 'pink';

export interface AppSettings {
  apiKey: string;
  theme: ThemeMode;
  accent: AccentColor;
}

export const DEFAULT_SETTINGS: AppSettings = {
  apiKey: '',
  theme: 'light',
  accent: 'coral',
};

export const ACCENT_COLORS: { value: AccentColor; label: string; color: string }[] = [
  { value: 'coral', label: 'Coral', color: '#FF5964' },
  { value: 'purple', label: 'Purple', color: '#9B67E8' },
  { value: 'blue', label: 'Ocean', color: '#43B8E8' },
  { value: 'green', label: 'Mint', color: '#72D43C' },
  { value: 'pink', label: 'Rose', color: '#F26B8A' },
];

const STORAGE_KEY = 'polish-settings';

export function loadSettings(): AppSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      apiKey: typeof parsed.apiKey === 'string' ? parsed.apiKey : '',
      theme: parsed.theme === 'dark' ? 'dark' : 'light',
      accent: ACCENT_COLORS.some(a => a.value === parsed.accent) ? parsed.accent : 'coral',
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Silently fail if storage is unavailable
  }
}

export function getAccentVars(accent: AccentColor): Record<string, string> {
  const map: Record<AccentColor, { primary: string; hover: string }> = {
    coral: { primary: '#FF5964', hover: '#e84e58' },
    purple: { primary: '#9B67E8', hover: '#8a55d6' },
    blue: { primary: '#43B8E8', hover: '#359ecf' },
    green: { primary: '#72D43C', hover: '#62c032' },
    pink: { primary: '#F26B8A', hover: '#e05a79' },
  };
  return {
    '--accent': map[accent].primary,
    '--accent-hover': map[accent].hover,
  };
}

