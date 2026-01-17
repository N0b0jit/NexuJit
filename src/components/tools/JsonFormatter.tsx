'use client';

import { useState } from 'react';
import { Copy, Trash2, Check, Braces, Code2, Zap } from 'lucide-react';
import { Button, Textarea, Card } from '@/components/ui/Core';
import { motion, AnimatePresence } from 'framer-motion';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const processJson = (mode: 'format2' | 'format4' | 'minify') => {
    try {
      if (!input.trim()) return;
      const parsed = JSON.parse(input);

      let result = '';
      if (mode === 'format2') result = JSON.stringify(parsed, null, 2);
      if (mode === 'format4') result = JSON.stringify(parsed, null, 4);
      if (mode === 'minify') result = JSON.stringify(parsed);

      setOutput(result);
      setError('');
    } catch (e: any) {
      setError('System Error: ' + e.message);
      setOutput('');
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Input Panel */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-fg flex items-center gap-2">
              Source Payload <Braces size={12} className="text-accent" />
            </label>
            <Button variant="ghost" size="sm" onClick={clearAll} disabled={!input}>
              <Trash2 size={12} /> Clear
            </Button>
          </div>
          <Textarea
            value={input}
            onChange={(e: any) => setInput(e.target.value)}
            placeholder='Paste JSON here... e.g. {"status": "ok"}'
            className="flex-1 min-h-[400px] font-mono text-sm border-dashed"
          />
        </div>

        {/* Output Panel */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-fg flex items-center gap-2">
              Processed Logic <Code2 size={12} className="text-accent" />
            </label>
            {output && (
              <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            )}
          </div>
          <div className="relative flex-1 group">
            <Textarea
              readOnly
              value={output || (error ? error : '')}
              placeholder="Output will generate here..."
              className={`h-full min-h-[400px] font-mono text-sm bg-muted/10 ${error ? 'text-red-500 border-red-500/50' : ''}`}
            />
            {!output && !error && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <Braces size={64} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <Card className="p-4 flex flex-wrap items-center justify-center gap-4 bg-accent/5 border-accent/10">
        <span className="text-xs font-bold text-muted-fg mr-4 hidden md:inline uppercase tracking-widest">Compiler Controls</span>
        <Button variant="secondary" onClick={() => processJson('format2')} disabled={!input}>
          <Zap size={14} className="text-yellow-500" /> Format 2-Space
        </Button>
        <Button variant="secondary" onClick={() => processJson('format4')} disabled={!input}>
          <Zap size={14} className="text-yellow-500" /> Format 4-Space
        </Button>
        <Button variant="primary" onClick={() => processJson('minify')} disabled={!input}>
          <Zap size={14} fill="currentColor" /> Minify Content
        </Button>
      </Card>
    </div>
  );
}
