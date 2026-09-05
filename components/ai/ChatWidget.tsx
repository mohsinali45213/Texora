'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUp, MessageSquareText, Sparkle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { VoiceInputButton } from './VoiceInputButton';
import { aiReply, chatSuggestions, type ChatMessage } from '@/lib/ai-mock';
import { formatCurrency, cn } from '@/lib/utils';

const intro: ChatMessage = {
  id: 'intro',
  role: 'assistant',
  content:
    "I'm the Texora sourcing assistant. Ask me for fabrics by weight, composition, budget or end use — I search live marketplace inventory and can compare options for you.",
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([intro]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || thinking) return;
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'user', content: trimmed }]);
    setInput('');
    setThinking(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      });
      if (res.ok) {
        const reply = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: reply.content,
            products: reply.products,
          },
        ]);
      } else {
        throw new Error('Fallback to mock');
      }
    } catch (e) {
      // Fallback
      setTimeout(() => {
        const reply = aiReply(trimmed);
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: reply.content,
            products: reply.products,
          },
        ]);
        setThinking(false);
      }, 900);
    } finally {
      setThinking(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        aria-label="Open AI sourcing assistant"
        className="fixed bottom-5 right-4 z-40 h-12 rounded-full pl-4 pr-5 shadow-lift md:bottom-8 md:right-8"
      >
        <MessageSquareText className="h-4 w-4 mr-2" aria-hidden="true" />
        <span className="text-sm font-medium">Ask AI</span>
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="flex w-full flex-col gap-0 p-0 sm:max-w-md"
          aria-describedby={undefined}
        >
          <SheetHeader className="border-b px-5 py-4">
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-primary-foreground">
                <Sparkle className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex items-center justify-between w-full">
                <div>
                  <SheetTitle className="truncate text-base text-left">Sourcing Assistant</SheetTitle>
                  <SheetDescription className="text-xs text-left">
                    Grounded in live marketplace inventory
                  </SheetDescription>
                </div>
              </div>
            </div>
          </SheetHeader>

          <ScrollArea className="flex-1">
            <div className="space-y-5 px-5 py-5">
              {messages.map((message) => (
                <div key={message.id} className="space-y-2.5">
                  <div
                    className={cn(
                      'text-sm leading-relaxed',
                      message.role === 'user'
                        ? 'ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3.5 py-2.5 text-primary-foreground'
                        : 'text-foreground',
                    )}
                  >
                    {message.content}
                  </div>
                  {message.products?.length ? (
                    <div className="space-y-2">
                      {message.products.map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.id}`}
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-3 rounded-xl border p-2 transition-colors hover:border-primary/40 hover:bg-muted/50"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            loading="lazy"
                            width={64}
                            height={64}
                            className="h-12 w-12 shrink-0 rounded-lg object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{product.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatCurrency(product.price)}/m · MOQ {product.moq} m
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}

              {thinking ? (
                <p className="animate-pulse text-sm text-muted-foreground">Searching inventory…</p>
              ) : null}

              {messages.length === 1 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {chatSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => send(suggestion)}
                      className="rounded-full border px-3 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              ) : null}
              <div ref={endRef} />
            </div>
          </ScrollArea>

          <form
            className="border-t p-3"
            onSubmit={(event) => {
              event.preventDefault();
              send(input);
            }}
          >
            <div className="rounded-2xl border bg-background p-2 focus-within:border-primary/50">
              <Textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    send(input);
                  }
                }}
                placeholder="Ask about fabrics, MOQs, lead times…"
                aria-label="Message the sourcing assistant"
                className="min-h-11 resize-none border-0 bg-transparent p-1.5 shadow-none focus-visible:ring-0"
              />
              <div className="flex items-center justify-between gap-2 pt-1">
                <Badge variant="secondary" className="text-[11px] font-normal">
                  {messages.length > 1 ? `${messages.length - 1} turns` : 'Voice ready'}
                </Badge>
                <div className="flex items-center gap-1">
                  <VoiceInputButton onTranscript={(text) => setInput(text)} />
                  <Button
                    type="submit"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    disabled={!input.trim() || thinking}
                    aria-label="Send message"
                  >
                    <ArrowUp className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}
