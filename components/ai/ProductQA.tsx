'use client';

import { useState } from 'react';
import { Sparkle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { VoiceInputButton } from './VoiceInputButton';
import { aiAnswer } from '@/lib/ai-mock';
import type { Product } from '@/types/product';

const presets = ['What is the MOQ?', 'How long is the lead time?', 'Which colours are in stock?'];

export function ProductQA({ product }: { product: Product }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const ask = async (text: string) => {
    if (!text.trim()) return;
    setQuestion(text);
    setLoading(true);
    setAnswer(null);

    // Try hitting the AI endpoint, if it fails, fallback to local mock
    try {
      const res = await fetch('/api/ai/qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text, productId: product.id }),
      });
      if (res.ok) {
        const data = await res.json();
        setAnswer(data.answer || aiAnswer(product, text));
      } else {
        setAnswer(aiAnswer(product, text));
      }
    } catch (e) {
      setAnswer(aiAnswer(product, text));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="gap-4 p-5">
      <div className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary/10 text-primary">
          <Sparkle className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <h3 className="text-base font-semibold">Ask about this product</h3>
          <p className="text-xs text-muted-foreground">
            Answers generated from this fabric&apos;s specification sheet.
          </p>
        </div>
      </div>

      <form
        className="flex items-center gap-2 mt-4"
        onSubmit={(event) => {
          event.preventDefault();
          ask(question);
        }}
      >
        <Input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="e.g. Can I get custom colours?"
          aria-label={`Ask a question about ${product.name}`}
        />
        <VoiceInputButton onTranscript={(text) => ask(text)} />
        <Button type="submit" disabled={loading || !question.trim()}>
          {loading ? 'Thinking…' : 'Ask'}
        </Button>
      </form>

      <div className="flex flex-wrap gap-2 mt-4">
        {presets.map((preset) => (
          <button
            key={preset}
            onClick={() => ask(preset)}
            className="rounded-full border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            {preset}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="animate-pulse text-sm text-muted-foreground mt-4">Reading the spec sheet…</p>
      ) : null}
      {answer ? (
        <div className="rounded-xl border bg-muted/40 p-4 text-sm leading-relaxed mt-4">{answer}</div>
      ) : null}
    </Card>
  );
}
