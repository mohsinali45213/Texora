import { NextResponse } from 'next/server';
import { aiReply } from '@/lib/ai-mock';
import { ProductService } from '@/services/product.service';
import { callOpenRouter } from '@/lib/openrouter';

const AI_TIMEOUT_MS = 8000;

/**
 * Wraps a promise with a timeout. Returns the promise result or throws on timeout.
 */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms)
    ),
  ]);
}

export async function POST(request: Request) {
  let message = '';

  try {
    const body = await request.json();
    message = (body.message || '').trim();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // ── 1. Fetch relevant products from MongoDB ──────────────────────────────
    const productService = new ProductService();
    // We don't need process.env.HF_TOKEN anymore, we assume AI is always available via OpenRouter
    const results = await productService.searchProducts(message, true);
    const topProducts = results.slice(0, 3).map((p: any) => ({
      id: p.id,
      name: p.name,
      image: p.image || '/fabric-cotton.jpg',
      price: p.price,
      moq: p.moq,
      category: p.category,
      supplierName: p.supplierName,
    }));

    // ── 2. Build context summary for the AI ─────────────────────────────────
    const productContext =
      topProducts.length > 0
        ? topProducts
            .map(
              (p) =>
                `- ${p.name} (${p.category}) — ₹${p.price}/m, MOQ ${p.moq}m, by ${p.supplierName}`
            )
            .join('\n')
        : 'No matching products found in current inventory.';

    // ── 3. Try OpenRouter AI ────────────────────────────────────────
    try {
      const systemPrompt = `You are Texa, a helpful textile sourcing assistant for Texora — an AI-powered B2B fabric marketplace. 
You help buyers find fabrics and suppliers showcase their products.

IMPORTANT RULES:
- Only mention products that exist in the inventory provided below.
- Never invent products, prices, or suppliers.
- Be concise (2–3 sentences max), professional, and friendly.
- If no products match, say so honestly and ask for more details.
- Always end with a helpful follow-up question or suggestion.

Current inventory matching the query:
${productContext}`;

      const content = await withTimeout(
        callOpenRouter(systemPrompt, message, 200),
        AI_TIMEOUT_MS
      );

      return NextResponse.json({
        content: content || buildFallbackContent(topProducts, message),
        products: topProducts.length > 0 ? topProducts : undefined,
      });
    } catch (apiError) {
      console.warn('[AI Chat] OpenRouter API failed, using fallback:', apiError);
      // Fall through to deterministic fallback
    }

    // ── 4. Deterministic fallback ────────────────────────────────────────────
    const fallback = aiReply(message);
    return NextResponse.json({
      content:
        topProducts.length > 0
          ? `I found ${topProducts.length} option${topProducts.length > 1 ? 's' : ''} that may match what you're looking for. Would you like more details on any of these?`
          : fallback?.content ||
            "I couldn't find an exact match right now. Could you tell me more about what you need — fabric type, GSM, or budget?",
      products: topProducts.length > 0 ? topProducts : undefined,
    });
  } catch (error) {
    console.error('[AI Chat] Unhandled error:', error);
    return NextResponse.json({
      content:
        "I'm having a moment — please try again in a few seconds. In the meantime, you can browse the catalogue directly.",
      products: undefined,
    });
  }
}

function buildFallbackContent(products: any[], query: string): string {
  if (products.length === 0) {
    return `I couldn't find exact matches for "${query}". Try refining your search with fabric type, colour, or price range.`;
  }
  if (products.length === 1) {
    return `I found one option that might work — ${products[0].name} at ₹${products[0].price}/m. Would you like more details?`;
  }
  return `I found ${products.length} fabrics that could match your needs. Take a look and let me know if you'd like more details on any of them!`;
}

