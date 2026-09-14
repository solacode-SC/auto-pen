'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import {
  type AppSettings,
  type ThemeMode,
  type AccentColor,
  DEFAULT_SETTINGS,
  loadSettings,
  saveSettings,
  getAccentVars,
} from '@/lib/settings';
import { type AIProvider } from '@/lib/providers';

interface SettingsContextType {
  settings: AppSettings;
  updateApiKey: (key: string) => void;
  updateTheme: (theme: ThemeMode) => void;
  updateAccent: (accent: AccentColor) => void;
  updateProvider: (provider: AIProvider) => void;
  updateModel: (model: string) => void;
  updateCustomBaseUrl: (url: string) => void;
  hasApiKey: boolean;
}

const fallbackContext: SettingsContextType = {
  settings: DEFAULT_SETTINGS,
  updateApiKey: () => {},
  updateTheme: () => {},
  updateAccent: () => {},
  updateProvider: () => {},
  updateModel: () => {},
  updateCustomBaseUrl: () => {},
  hasApiKey: false,
};

const SettingsContext = createContext<SettingsContextType>(fallbackContext);

export function useSettings() {
  return useContext(SettingsContext) || fallbackContext;
}

export default function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [mounted, setMounted] = useState(false);

  // Load settings from localStorage on client mount
  useEffect(() => {
    setSettings(loadSettings());
    setMounted(true);
  }, []);

  // Apply theme + accent whenever settings change
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;

    // Theme mode
    if (settings.theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }

    // Accent color
    const vars = getAccentVars(settings.accent);
    for (const [key, val] of Object.entries(vars)) {
      root.style.setProperty(key, val);
    }

    // Persist
    saveSettings(settings);
  }, [settings, mounted]);

  const updateApiKey = useCallback((key: string) => {
    setSettings(prev => ({ ...prev, apiKey: key }));
  }, []);

  const updateTheme = useCallback((theme: ThemeMode) => {
    setSettings(prev => ({ ...prev, theme }));
  }, []);

  const updateAccent = useCallback((accent: AccentColor) => {
    setSettings(prev => ({ ...prev, accent }));
  }, []);

  const updateProvider = useCallback((provider: AIProvider) => {
    setSettings(prev => ({ ...prev, provider }));
  }, []);

  const updateModel = useCallback((model: string) => {
    setSettings(prev => ({ ...prev, model }));
  }, []);

  const updateCustomBaseUrl = useCallback((customBaseUrl: string) => {
    setSettings(prev => ({ ...prev, customBaseUrl }));
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateApiKey,
        updateTheme,
        updateAccent,
        updateProvider,
        updateModel,
        updateCustomBaseUrl,
        hasApiKey: settings.apiKey.trim().length > 0,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
