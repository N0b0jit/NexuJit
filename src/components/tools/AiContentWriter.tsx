'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Copy, RefreshCw, Check, Target, AlertCircle, Key, Zap, ShieldCheck, Activity } from 'lucide-react';
import { Button, Input, Select, Card, Badge, Reveal } from '@/components/ui/Core';
import { motion, AnimatePresence } from 'framer-motion';

export default function AiContentWriter() {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Professional');
  const [length, setLength] = useState('Medium');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) setApiKey(savedKey);
  }, []);

  const saveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
  };

  const generateContent = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setResult('');
    setError('');

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic, tone, length, userApiKey: apiKey }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setResult(data.text);
    } catch (err: any) {
      setError(err.message || 'Transmission failed. Verify your nexus connection and API key.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Controls */}
        <div className="lg:col-span-5 space-y-8">
          <Card padding="p-8" className="shadow-2xl shadow-black/[0.02]">
            <div className="space-y-8">
              <div className="flex items-center gap-3 text-accent mb-2">
                <Target size={20} />
                <h3 className="font-bold text-lg">Content Settings</h3>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-fg-tertiary uppercase tracking-wider ml-1">Topic / Subject</label>
                  <Input
                    placeholder="e.g. Benefits of Sustainable Living"
                    value={topic}
                    onChange={(e: any) => setTopic(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-fg-tertiary uppercase tracking-wider ml-1">Tone</label>
                    <Select value={tone} onChange={(e: any) => setTone(e.target.value)}>
                      {['Professional', 'Friendly', 'Excited', 'Formal', 'Witty'].map(t => (
                        <option key={t}>{t}</option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-fg-tertiary uppercase tracking-wider ml-1">Length</label>
                    <Select value={length} onChange={(e: any) => setLength(e.target.value)}>
                      <option value="Short">Compact (300 words)</option>
                      <option value="Medium">Standard (600 words)</option>
                      <option value="Long">Extended (1000+ words)</option>
                    </Select>
                  </div>
                </div>

                <Button
                  variant="primary"
                  className="w-full h-14"
                  onClick={generateContent}
                  loading={loading}
                  disabled={!topic || loading}
                >
                  <Sparkles size={18} className="mr-2" />
                  {loading ? 'Generating Content...' : 'Generate AI Content'}
                </Button>
              </div>
            </div>
          </Card>

          <Card padding="p-8" className="bg-bg-secondary/50 border-dashed">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-fg-primary">
                <Key size={18} className="text-accent" />
                <span className="font-bold text-sm">Gemini API Key</span>
              </div>
              <button
                onClick={() => setShowKeyInput(!showKeyInput)}
                className="text-xs font-bold text-accent uppercase tracking-widest hover:underline"
              >
                {showKeyInput ? 'Hide' : 'Configure'}
              </button>
            </div>

            <AnimatePresence>
              {(showKeyInput || !apiKey) && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-4">
                  <Input
                    type="password"
                    placeholder="Enter your API Key..."
                    value={apiKey}
                    onChange={(e: any) => saveApiKey(e.target.value)}
                  />
                  <div className="flex items-start gap-3 p-4 bg-accent/5 rounded-xl border border-accent/10">
                    <ShieldCheck size={16} className="text-accent shrink-0 mt-0.5" />
                    <p className="text-[11px] text-fg-secondary leading-relaxed">Your API key is stored only in your local browser storage and never touches our servers.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>

        {/* Output */}
        <div className="lg:col-span-7">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Activity size={20} className="text-accent" />
              <h3 className="font-bold text-lg">AI Generated Content</h3>
            </div>
            {result && (
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                <span className="ml-2">{copied ? 'Copied' : 'Copy Text'}</span>
              </Button>
            )}
          </div>

          <div className={`
            min-h-[600px] rounded-2xl border border-border-strong bg-white dark:bg-bg-tertiary/20 p-8 md:p-12 transition-all duration-500
            ${loading ? 'opacity-50 grayscale shadow-inner' : 'shadow-2xl shadow-black/[0.02]'}
          `}>
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-full text-center space-y-6 pt-20">
                  <div className="relative">
                    <RefreshCw size={64} className="text-accent animate-spin opacity-20" />
                    <Sparkles size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-accent" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Writing in progress...</h3>
                    <p className="text-fg-tertiary text-sm">The AI is crafting your content. Please wait a moment.</p>
                  </div>
                </motion.div>
              ) : error ? (
                <motion.div key="error" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-full text-center space-y-6 pt-20">
                  <div className="bg-red-500/10 p-6 rounded-full text-red-500">
                    <AlertCircle size={40} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-red-500">Generation Failed</h4>
                    <p className="text-fg-secondary text-sm max-w-xs">{error}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={generateContent} className="text-red-500 border-red-500/20">Retry Generation</Button>
                </motion.div>
              ) : result ? (
                <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="prose prose-slate dark:prose-invert max-w-none">
                  {result.split('\n').map((line, i) => {
                    if (line.trim().startsWith('# ')) return <h1 key={i} className="text-3xl font-bold mb-6">{line.replace('# ', '')}</h1>;
                    if (line.trim().startsWith('## ')) return <h2 key={i} className="text-xl font-bold mt-8 mb-4">{line.replace('## ', '')}</h2>;
                    if (line.trim() === '') return <div key={i} className="h-4" />;
                    return <p key={i} className="text-fg-secondary leading-relaxed mb-4">{line}</p>;
                  })}
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full opacity-40 space-y-6 pt-20">
                  <div className="w-20 h-20 rounded-2xl bg-bg-tertiary flex items-center justify-center">
                    <Zap size={40} className="text-fg-tertiary" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-bold">Ready to write</h3>
                    <p className="text-xs text-fg-tertiary font-medium">Configure your settings and click generate to begin.</p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
