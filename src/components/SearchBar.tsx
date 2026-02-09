'use client';

import { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, X, Command, ArrowRight, Zap, TrendingUp, Sparkles, CornerDownLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { categories } from '@/data/tools';
import { motion, AnimatePresence } from 'framer-motion';
import { Magnetic } from './ui/Core';

interface SearchItem {
  name: string;
  href: string;
  description: string;
  category: string;
}

export default function SearchBar({ mini = false }: { mini?: boolean }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const allTools: SearchItem[] = categories.flatMap(cat =>
    cat.tools.map(tool => ({
      ...tool,
      category: cat.title
    }))
  );

  useEffect(() => {
    if (query.trim().length > 0) {
      const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 0);

      const filtered = allTools.filter(tool => {
        const searchableText = `${tool.name} ${tool.description} ${tool.category}`.toLowerCase();
        return terms.every(term => searchableText.includes(term));
      }).slice(0, 10);

      setResults(filtered);
      setIsOpen(true);
      setActiveIndex(filtered.length > 0 ? 0 : -1);
    } else {
      setResults([]);
      setIsOpen(false);
      setActiveIndex(-1);
    }
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && results[activeIndex]) {
        router.push(results[activeIndex].href);
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className="relative w-full" ref={searchRef} onKeyDown={handleKeyDown}>
      <div className="relative group">
        <div className={`absolute left-6 top-1/2 -translate-y-1/2 text-fg-tertiary transition-all duration-500 z-10 ${isOpen ? 'text-accent scale-110' : 'group-hover:text-fg-primary'}`}>
          <SearchIcon size={mini ? 18 : 26} className="stroke-[3]" />
        </div>

        <input
          ref={inputRef}
          type="text"
          placeholder={mini ? "Find intelligence..." : "Search through 300+ laboratory modules..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 0 && setIsOpen(true)}
          className={`
            w-full bg-bg-tertiary/60 dark:bg-bg-tertiary/30 backdrop-blur-xl border-2 border-transparent rounded-[1.25rem] md:rounded-[2rem] outline-none transition-all duration-300
            placeholder:text-fg-tertiary/60 font-black focus:ring-[12px] focus:ring-accent/5 focus:border-accent/20 text-fg-primary
            ${mini ? 'h-14 pl-14 pr-14 text-sm' : 'h-20 md:h-24 pl-16 pr-16 text-lg md:text-2xl tracking-tighter'}
            ${isOpen && results.length > 0 ? 'rounded-b-none' : ''}
          `}
        />

        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setQuery('')}
                className="p-2 hover:bg-bg-tertiary rounded-full text-fg-tertiary transition-colors"
              >
                <X size={20} strokeWidth={3} />
              </motion.button>
            )}
          </AnimatePresence>

          {!query && !mini && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass border border-accent/10 opacity-40 group-hover:opacity-100 transition-opacity">
              <Command size={12} strokeWidth={3} className="text-fg-tertiary" />
              <span className="text-[10px] font-black text-fg-tertiary uppercase tracking-widest leading-none">K</span>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className={`absolute top-full left-1/2 -translate-x-1/2 glass mt-4 rounded-3xl shadow-[0_40px_120px_-20px_rgba(0,0,0,0.5)] z-[200] overflow-hidden border border-accent/20 ${mini ? 'w-[100vw] max-w-4xl' : 'w-full'}`}
          >
            <div className="p-6 space-y-3">
              {results.length > 0 ? (
                <>
                  <div className="px-5 py-3 flex items-center justify-between border-b border-glass-border mb-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-fg-tertiary">Intelligence Results</span>
                    <Sparkles size={12} className="text-accent animate-pulse" />
                  </div>
                  {results.map((tool, index) => (
                    <Magnetic key={tool.name}>
                      <div
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => {
                          router.push(tool.href);
                          setIsOpen(false);
                        }}
                        className={`
                          group flex items-center gap-6 p-6 rounded-2xl cursor-pointer transition-all duration-300
                          ${index === activeIndex ? 'bg-accent/10 border border-accent/20' : 'hover:bg-bg-tertiary/40 border border-transparent'}
                        `}
                      >
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl ${index === activeIndex ? 'bg-accent text-white scale-110' : 'bg-bg-tertiary text-fg-tertiary'}`}>
                          <Zap size={24} fill={index === activeIndex ? "currentColor" : "none"} />
                        </div>
                        <div className="flex-1">
                          <div className={`text-xl font-black transition-colors ${index === activeIndex ? 'text-accent' : 'text-fg-primary'}`}>
                            {tool.name}
                          </div>
                          <div className="text-[10px] text-fg-tertiary font-black uppercase tracking-[0.3em] opacity-60">
                            Sector Cluster: {tool.category}
                          </div>
                        </div>
                        <div className={`flex items-center gap-3 transition-all duration-500 ${index === activeIndex ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                          <span className="text-[10px] font-black uppercase tracking-widest text-accent">Initialize</span>
                          <CornerDownLeft size={18} className="text-accent" />
                        </div>
                      </div>
                    </Magnetic>
                  ))}
                </>
              ) : (
                <div className="p-16 text-center">
                  <div className="w-20 h-20 bg-bg-tertiary rounded-[2rem] flex items-center justify-center mx-auto mb-10 opacity-30">
                    <SearchIcon size={40} />
                  </div>
                  <p className="text-xl font-black text-fg-primary mb-2">No matching modules found</p>
                  <p className="text-sm text-fg-tertiary uppercase tracking-widest font-black">Refine your search parameters</p>
                </div>
              )}

              {/* Suggestions Layer when results are low or query is early */}
              {!query && (
                <div className="p-4 pt-0">
                  <div className="px-5 py-4 border-t border-glass-border flex items-center gap-3">
                    <TrendingUp size={16} className="text-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-fg-tertiary">System Favourites</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {['YouTube SEO', 'Article Rewriter', 'Convert PDF', 'Code Minifier'].map(term => (
                      <Magnetic key={term}>
                        <button
                          onClick={() => setQuery(term)}
                          className="w-full flex items-center gap-3 p-4 rounded-xl glass border border-transparent hover:border-accent/20 hover:text-accent transition-all text-sm font-black text-fg-secondary"
                        >
                          <Zap size={14} />
                          {term}
                        </button>
                      </Magnetic>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-bg-tertiary/50 dark:bg-bg-tertiary/20 px-10 py-5 flex justify-between items-center text-[10px] font-black text-fg-tertiary uppercase tracking-[0.3em] border-t border-glass-border">
              <span className="shimmer">{results.length} Clusters Located</span>
              <div className="flex gap-8">
                <span className="flex items-center gap-3"><CornerDownLeft size={12} /> ENTER</span>
                <span className="flex items-center gap-3">&uarr;&darr; SCAN</span>
                <span className="flex items-center gap-3">ESC CLOSE</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
