import { NextResponse } from 'next/server';
import { validateImproveRequest } from '@/lib/validation';
import { improveText } from '@/lib/deepseek';
import { checkRateLimit } from '@/lib/rate-limit';
import { WritingType } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anonymous';

    const rateLimitResult = checkRateLimit(ip);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please wait a moment.' },
        { status: 429 }
      );
    }

    const body = await req.json();

    const validation = validateImproveRequest(body);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    const { text, type, apiKey: bodyApiKey } = body as { text: string; type: WritingType; apiKey?: string };
    const {
      text,
      type,
      apiKey: bodyApiKey,
      provider: bodyProvider,
      model: bodyModel,
      customBaseUrl: bodyCustomBaseUrl,
    } = body as {
      text: string;
      type: WritingType;
      apiKey?: string;
      provider?: any;
      model?: string;
      customBaseUrl?: string;
    };

    const customApiKey = req.headers.get('x-api-key') || (typeof bodyApiKey === 'string' ? bodyApiKey : undefined);
    const improvedText = await improveText(text, type, customApiKey);
    const provider = (req.headers.get('x-provider') || bodyProvider || undefined) as any;
    const model = req.headers.get('x-model') || (typeof bodyModel === 'string' ? bodyModel : undefined);
    const customBaseUrl = req.headers.get('x-base-url') || (typeof bodyCustomBaseUrl === 'string' ? bodyCustomBaseUrl : undefined);

    const improvedText = await improveText(text, type, customApiKey, {
      provider,
      model,
      customBaseUrl,
    });
    const options = (provider || model || customBaseUrl)
      ? { provider, model, customBaseUrl }
      : undefined;

    const improvedText = options
      ? await improveText(text, type, customApiKey, options)
      : await improveText(text, type, customApiKey);

    return NextResponse.json({ success: true, text: improvedText });
  } catch (error) {
    console.error('Improve API error:', error instanceof Error ? error.message : 'Unknown error');
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Improve API error:', errorMsg);
    return NextResponse.json(
      { success: false, error: 'Unable to improve text. Please try again.' },
      { success: false, error: errorMsg || 'Unable to improve text. Please try again.' },
      { status: 500 }
    );
  }
}
