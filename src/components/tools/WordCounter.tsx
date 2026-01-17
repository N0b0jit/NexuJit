'use client';

import { useState } from 'react';
import { Copy, Trash2, AlignLeft, Clock, BookOpen, RotateCcw, Sparkles } from 'lucide-react';
import { Button, Textarea, Card, Badge } from '@/components/ui/Core';

export default function WordCounter() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;
  const sentenceCount = text.split(/[.!?]+/).filter(Boolean).length;
  const paraCount = text.split(/\n\s*\n/).filter(Boolean).length;

  const readingTime = Math.ceil(wordCount / 225);
  const speakingTime = Math.ceil(wordCount / 130);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => setText('');

  const handleSample = () => {
    setText("SEOStudio is a professional toolkit designed for modern content creators. This is a sample text to demonstrate the word counter's lightning-fast processing capabilities. Our platform processes all data locally in your browser, ensuring maximum privacy and zero latency. Try it now with your own content!");
  };

  return (
    <div className="space-y-8">
      {/* Stat Badges Row */}
      <div className="flex flex-wrap gap-4 justify-center">
        {[
          { label: 'Words', value: wordCount },
          { label: 'Characters', value: charCount },
          { label: 'Sentences', value: sentenceCount },
          { label: 'Paragraphs', value: paraCount },
        ].map((stat) => (
          <div key={stat.label} className="bg-black border border-zinc-900 px-8 py-5 text-center min-w-[140px] shadow-[0_0_10px_rgba(0,0,0,0.5)]">
            <div className="text-[10px] font-heading text-zinc-600 uppercase tracking-widest mb-2">{stat.label}</div>
            <div className="text-2xl font-heading text-white tracking-widest">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="space-y-10">
        <Textarea
          placeholder="ENTER_PAYLOAD_HERE..."
          value={text}
          onChange={(e: any) => setText(e.target.value)}
          className="min-h-[400px] text-lg p-10 font-body uppercase tracking-wider"
        />

        {/* Action Buttons Centered */}
        <div className="flex flex-wrap justify-center gap-6">
          <Button variant="primary" size="lg" onClick={handleCopy} disabled={!text} className="min-w-[200px]">
            <Copy size={18} className="mr-3" />
            {copied ? 'EXEC_SUCCESS' : 'COPY_BUFFER'}
          </Button>
          <Button variant="secondary" size="lg" onClick={handleSample} className="min-w-[200px]">
            <Sparkles size={18} className="mr-3" />
            LOAD_SAMPLE
          </Button>
          <Button variant="outline" size="lg" onClick={handleClear} disabled={!text} className="min-w-[200px]">
            <RotateCcw size={18} className="mr-3" />
            WIPE_DATA
          </Button>
        </div>
      </div>

      {/* Analysis Section */}
      {text && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-zinc-900">
          <div className="flex items-center gap-8 p-10 hover:bg-zinc-950 transition-all border-r border-zinc-900">
            <div className="w-16 h-16 border border-blue-500/30 flex items-center justify-center text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <Clock size={32} />
            </div>
            <div>
              <div className="text-[10px] font-heading text-zinc-600 uppercase tracking-[0.3em] mb-2">READ_TIME_EST</div>
              <div className="text-2xl font-heading text-white tracking-widest">~ {readingTime} MIN</div>
            </div>
          </div>
          <div className="flex items-center gap-8 p-10 hover:bg-zinc-950 transition-all">
            <div className="w-16 h-16 border border-accent/30 flex items-center justify-center text-accent shadow-[0_0_15px_rgba(150,1,248,0.2)]">
              <BookOpen size={32} />
            </div>
            <div>
              <div className="text-[10px] font-heading text-zinc-600 uppercase tracking-[0.3em] mb-2">SPEAK_TIME_EST</div>
              <div className="text-2xl font-heading text-white tracking-widest">~ {speakingTime} MIN</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
