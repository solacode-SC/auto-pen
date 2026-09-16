'use client';

import { useState, useCallback, useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import WritingTypeSelector from '@/components/WritingTypeSelector';
import WritingEditor from '@/components/WritingEditor';
import InputPanel from '@/components/InputPanel';
import ResultPanel from '@/components/ResultPanel';
import ImproveButton from '@/components/ImproveButton';
import PrivacyNotice from '@/components/PrivacyNotice';
import Footer from '@/components/Footer';
import { WritingType, DEFAULT_WRITING_TYPE } from '@/lib/types';
import { useSettings } from '@/components/SettingsProvider';

export default function Page() {
  const { settings } = useSettings();
  const [text, setText] = useState('');
  const [type, setType] = useState<WritingType>(DEFAULT_WRITING_TYPE);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleImprove = useCallback(async () => {
    if (!text.trim()) {
      setValidationError('Write something first ✦');
      return;
    }
    setValidationError('');
    setLoading(true);
    setError('');

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (settings?.apiKey) {
        headers['x-api-key'] = settings.apiKey;
      }

      const response = await fetch('/api/improve', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          text: text.trim(),
          type,
          apiKey: settings?.apiKey || undefined,
          provider: settings?.provider || undefined,
          model: settings?.model?.trim() || undefined,
          customBaseUrl: settings?.customBaseUrl?.trim() || undefined,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setResult(data.text);
      } else {
        setError(data.error || 'Something went wrong.');
      }
    } catch {
      setError('Something went wrong. Your text is still here. Try again.');
    } finally {
      setLoading(false);
    }
  }, [text, type, settings?.apiKey, settings?.provider, settings?.model, settings?.customBaseUrl]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = result;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Copy failed', err);
      }
      document.body.removeChild(textArea);
    }
  }, [result]);

  const handleClear = useCallback(() => {
    setText('');
    setValidationError('');
  }, []);

  const handleImproveAgain = useCallback(() => {
    handleImprove();
  }, [handleImprove]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (!loading && text.trim()) {
          handleImprove();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleImprove, loading, text]);

  return (
    <main>
      <Header />
      <Hero />
      <WritingTypeSelector selected={type} onSelect={setType} />
      <WritingEditor>
        <InputPanel 
          text={text} 
          onChange={(val) => { setText(val); setValidationError(''); }} 
          onClear={handleClear} 
        />
        <ResultPanel 
          result={result} 
          loading={loading} 
          error={error} 
          onCopy={handleCopy} 
          copied={copied} 
          onImproveAgain={handleImproveAgain} 
        />
      </WritingEditor>
      {validationError && (
        <div style={{ textAlign: 'center', color: 'var(--coral)', fontSize: '14px', fontWeight: 600, padding: '8px 16px', marginTop: '-4px', wordBreak: 'break-word' }}>
          {validationError}
        </div>
      )}
      <ImproveButton onClick={handleImprove} loading={loading} disabled={loading} />
      <PrivacyNotice />
      <Footer />
    </main>
  );
}
