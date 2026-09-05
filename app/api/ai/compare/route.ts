import { NextResponse } from 'next/server';
import { callOpenRouter } from '@/lib/openrouter';
import { aiCompare } from '@/lib/ai-mock';

export async function POST(request: Request) {
  let products: any[] = [];
  try {
    const body = await request.json();
    products = body.products || [];

    if (!products || products.length < 2) {
      return NextResponse.json({ error: 'At least 2 products are required' }, { status: 400 });
    }

    const productNames = products.map((p: any) => `${p.name} (${p.fabricType}, ${p.price}/m, ${p.moq}m MOQ)`).join(' vs ');
    const systemPrompt = `You are a textile sourcing assistant. Compare the following fabrics and provide a concise summary of the trade-offs (max 3 sentences).`;
    const userMessage = productNames;

    const generatedText = await callOpenRouter(systemPrompt, userMessage, 150);

    return NextResponse.json({ summary: generatedText || aiCompare(products) });
  } catch (error) {
    console.error('AI Compare Error:', error);
    // Fallback to mock data if OpenRouter fails
    return NextResponse.json({ summary: aiCompare(products) });
  }
}
