import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SettingsPage from '@/app/settings/page';
import SettingsProvider from '@/components/SettingsProvider';

describe('Settings Page Component', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('renders Settings heading and navigation link', () => {
    render(
      <SettingsProvider>
        <SettingsPage />
      </SettingsProvider>
    );

    expect(screen.getByRole('heading', { name: /Settings/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/Back to Polish/i)).toBeInTheDocument();
  });

  it('allows user to enter and save API key', () => {
    render(
      <SettingsProvider>
        <SettingsPage />
      </SettingsProvider>
    );

    const input = screen.getByPlaceholderText('sk-...');
    fireEvent.change(input, { target: { value: 'sk-my-super-secret-key' } });
    expect(input).toHaveValue('sk-my-super-secret-key');

    const saveButton = screen.getByRole('button', { name: /Save Key/i });
    fireEvent.click(saveButton);

    expect(screen.getByText(/✓ Saved/i)).toBeInTheDocument();
  });

  it('allows user to switch theme mode', () => {
    render(
      <SettingsProvider>
        <SettingsPage />
      </SettingsProvider>
    );

    const darkModeBtn = screen.getByRole('button', { name: /Dark Mode/i });
    fireEvent.click(darkModeBtn);

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    const lightModeBtn = screen.getByRole('button', { name: /Light Mode/i });
    fireEvent.click(lightModeBtn);

    expect(document.documentElement.getAttribute('data-theme')).toBeNull();
  });

  it('allows user to change accent color', () => {
    render(
      <SettingsProvider>
        <SettingsPage />
      </SettingsProvider>
    );

    const purpleBtn = screen.getByRole('button', { name: /Purple/i });
    fireEvent.click(purpleBtn);

    expect(document.documentElement.style.getPropertyValue('--accent')).toBe('#9B67E8');
  });

  it('allows user to toggle API key visibility', () => {
    render(
      <SettingsProvider>
        <SettingsPage />
      </SettingsProvider>
    );

    const input = screen.getByPlaceholderText('sk-...');
    expect(input).toHaveAttribute('type', 'password');

    const toggleBtn = screen.getByRole('button', { name: /Show API key/i });
    fireEvent.click(toggleBtn);

    expect(input).toHaveAttribute('type', 'text');
  });
});
