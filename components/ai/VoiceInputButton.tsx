'use client';

import { useEffect, useRef, useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type SpeechRecognitionLike = {
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: { 0: { transcript: string } }[] }) => void) | null;
  onend: (() => void) | null;
  continuous: boolean;
  interimResults: boolean;
  lang: string;
};

export function VoiceInputButton({
  onTranscript,
  className,
}: {
  onTranscript: (text: string) => void;
  className?: string;
}) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => () => recognitionRef.current?.stop(), []);

  const start = () => {
    const w = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;

    if (!Ctor) {
      // Graceful demo fallback when the browser has no Web Speech API.
      setListening(true);
      window.setTimeout(() => {
        setListening(false);
        onTranscript('Show me organic cotton jersey under ₹500 per metre');
      }, 1400);
      return;
    }

    const recognition = new Ctor();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript;
      if (transcript) onTranscript(transcript);
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  const stop = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  return (
    <Button
      type="button"
      variant={listening ? 'default' : 'ghost'}
      size="icon"
      aria-label={listening ? 'Stop voice input' : 'Start voice input'}
      aria-pressed={listening}
      className={cn('relative rounded-full h-8 w-8', className)}
      onClick={listening ? stop : start}
    >
      {listening ? (
        <>
          <span className="absolute inset-0 animate-ping rounded-full bg-primary/40" aria-hidden="true" />
          <MicOff className="relative h-4 w-4" aria-hidden="true" />
        </>
      ) : (
        <Mic className="h-4 w-4" aria-hidden="true" />
      )}
    </Button>
  );
}
