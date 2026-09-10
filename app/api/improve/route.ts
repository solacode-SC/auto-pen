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
    const customApiKey = req.headers.get('x-api-key') || (typeof bodyApiKey === 'string' ? bodyApiKey : undefined);
    const improvedText = await improveText(text, type, customApiKey);

    return NextResponse.json({ success: true, text: improvedText });
  } catch (error) {
    console.error('Improve API error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { success: false, error: 'Unable to improve text. Please try again.' },
      { status: 500 }
    );
  }
}
