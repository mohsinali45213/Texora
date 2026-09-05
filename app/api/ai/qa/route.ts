import { NextResponse } from 'next/server';
import { aiAnswer } from '@/lib/ai-mock';
import { ProductService } from '@/services/product.service';
import { callOpenRouter } from '@/lib/openrouter';

const AI_TIMEOUT_MS = 8000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms)
    ),
  ]);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question, productId } = body;

    if (!question || !productId) {
      return NextResponse.json({ error: 'Question and productId are required' }, { status: 400 });
    }

    const productService = new ProductService();
    const product = await productService.getProductById(productId);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    try {
      const specs = product.specifications?.map((s: any) => `${s.label}: ${s.value}`).join('\n') || 'None';
      const colors = product.colors?.join(', ') || 'Standard';

      const systemPrompt = `You are a helpful product expert for Texora. Answer the buyer's question about the following product based ONLY on the provided details. Keep the answer brief (1-3 sentences), helpful, and do not make up any information.
      
Product Name: ${product.name}
Category: ${product.category}
Price: ₹${product.price}/m
MOQ: ${product.moq || 100} m
Lead Time: ${product.leadTimeDays || 14} days
Colors: ${colors}
Specifications:
${specs}`;

      const answer = await withTimeout(
        callOpenRouter(systemPrompt, question, 150),
        AI_TIMEOUT_MS
      );

      return NextResponse.json({ answer: answer || aiAnswer(product, question) });
    } catch (apiError) {
      console.warn('[AI QA] OpenRouter API failed, using fallback:', apiError);
    }

    return NextResponse.json({ answer: aiAnswer(product, question) });
  } catch (error) {
    console.error('[AI QA] Unhandled error:', error);
    return NextResponse.json({ answer: 'I cannot retrieve that information right now. Please check the specification sheet directly.' });
  }
}
