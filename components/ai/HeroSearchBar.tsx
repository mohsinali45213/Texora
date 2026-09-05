'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AiSearchBar } from '@/components/ai/AiSearchBar';
import { ROUTES } from '@/constants';

export function HeroSearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [aiMode, setAiMode] = useState(true);

  const submit = (value: string) => {
    router.push(`${ROUTES.PRODUCTS}?q=${encodeURIComponent(value)}&ai=${aiMode}`);
  };

  return (
    <AiSearchBar
      value={query}
      onChange={setQuery}
      onSubmit={submit}
      aiMode={aiMode}
      onAiModeChange={setAiMode}
    />
  );
}
