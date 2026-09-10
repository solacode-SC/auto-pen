import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Page from '@/app/page';

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined),
  },
});

global.fetch = jest.fn();

describe('Page Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the main heading', () => {
    render(<Page />);
    expect(screen.getByText('Write rough.')).toBeInTheDocument();
  });

  it('renders the tagline', () => {
    render(<Page />);
    expect(screen.getByText('Send polished.')).toBeInTheDocument();
  });

  it('renders all writing type buttons', () => {
    render(<Page />);
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Message')).toBeInTheDocument();
    expect(screen.getByText('Comment')).toBeInTheDocument();
    expect(screen.getByText('Post')).toBeInTheDocument();
    expect(screen.getByText('Tweet')).toBeInTheDocument();
    expect(screen.getByText('Professional')).toBeInTheDocument();
    expect(screen.getByText('Casual')).toBeInTheDocument();
  });

  it('defaults to Message type selected', () => {
    render(<Page />);
    const messageButton = screen.getByRole('button', { name: /Message/i });
    expect(messageButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('can select a different type by clicking', () => {
    render(<Page />);
    const emailButton = screen.getByRole('button', { name: /Email/i });
    fireEvent.click(emailButton);
    expect(emailButton).toHaveAttribute('aria-pressed', 'true');
    // Previous selection should be deselected
    const messageButton = screen.getByRole('button', { name: /Message/i });
    expect(messageButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('renders the textarea with placeholder', () => {
    render(<Page />);
    const textarea = screen.getByPlaceholderText('Write your text here...');
    expect(textarea).toBeInTheDocument();
  });

  it('can enter text in the textarea', () => {
    render(<Page />);
    const textarea = screen.getByPlaceholderText('Write your text here...');
    fireEvent.change(textarea, { target: { value: 'test text' } });
    expect(textarea).toHaveValue('test text');
  });

  it('renders the Improve button', () => {
    render(<Page />);
    expect(screen.getByRole('button', { name: /Improve/i })).toBeInTheDocument();
  });

  it('shows validation error when clicking Improve with empty text', async () => {
    render(<Page />);
    const button = screen.getByRole('button', { name: /Improve/i });
    fireEvent.click(button);
    expect(await screen.findByText(/Write something first/i)).toBeInTheDocument();
  });

  it('shows loading state when API is called', async () => {
    (global.fetch as jest.Mock).mockImplementation(() =>
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, text: 'Polished text' })
      }), 200))
    );

    render(<Page />);
    const textarea = screen.getByPlaceholderText('Write your text here...');
    fireEvent.change(textarea, { target: { value: 'rough text' } });

    const button = screen.getByRole('button', { name: /Improve/i });
    fireEvent.click(button);

    expect(await screen.findByText(/Polishing/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText(/Polishing/i)).not.toBeInTheDocument());
  });

  it('successful API response shows result text', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, text: 'Polished result text' }),
    });

    render(<Page />);
    const textarea = screen.getByPlaceholderText('Write your text here...');
    fireEvent.change(textarea, { target: { value: 'rough text' } });

    const button = screen.getByRole('button', { name: /Improve/i });
    fireEvent.click(button);

    const result = await screen.findByText('Polished result text');
    expect(result).toBeInTheDocument();
  });

  it('shows copy button after successful result', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, text: 'Polished result' }),
    });

    render(<Page />);
    const textarea = screen.getByPlaceholderText('Write your text here...');
    fireEvent.change(textarea, { target: { value: 'rough text' } });

    fireEvent.click(screen.getByRole('button', { name: /Improve/i }));

    await screen.findByText('Polished result');
    expect(screen.getByRole('button', { name: /Copy/i })).toBeInTheDocument();
  });

  it('error state shows error message', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<Page />);
    const textarea = screen.getByPlaceholderText('Write your text here...');
    fireEvent.change(textarea, { target: { value: 'rough text' } });

    fireEvent.click(screen.getByRole('button', { name: /Improve/i }));

    expect(await screen.findByText(/Something went wrong/i)).toBeInTheDocument();
  });

  it('clear button clears the input', () => {
    render(<Page />);
    const textarea = screen.getByPlaceholderText('Write your text here...');
    fireEvent.change(textarea, { target: { value: 'rough text' } });

    const clearButton = screen.getByRole('button', { name: /Clear/i });
    fireEvent.click(clearButton);

    expect(textarea).toHaveValue('');
  });

  it('updates word and character counts', () => {
    render(<Page />);
    const textarea = screen.getByPlaceholderText('Write your text here...');
    fireEvent.change(textarea, { target: { value: 'hello world' } });

    expect(screen.getByText(/2 words/)).toBeInTheDocument();
    expect(screen.getByText(/11 characters/)).toBeInTheDocument();
  });
});
