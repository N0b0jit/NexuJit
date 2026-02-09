'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Search, Menu, Sun, Moon, X, Sparkles, ChevronDown, BookOpen, Clock, LayoutGrid, Zap, Grid, ArrowRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import SearchBar from './SearchBar';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Magnetic } from './ui/Core';
import { categories } from '@/data/tools';

export default function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'light';
    setIsDarkMode(theme === 'dark');
    document.documentElement.setAttribute('data-theme', theme);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(event.target as Node)) {
        setIsToolsOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Tools', active: isToolsOpen, onClick: () => setIsToolsOpen(!isToolsOpen) },
    { label: 'Trending', href: '/#trending' },
  ];

  return (
    <nav
      className={`h-24 sticky top-0 z-[100] flex items-center transition-all duration-150 ${isScrolled
        ? 'glass border-b border-accent/20 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] py-2'
        : 'bg-transparent border-b border-transparent py-4'
        }`}
    >
      <div className="page-container w-full flex items-center justify-between gap-6">
        {/* Left Sector: Branding & Brief Links */}
        <div className="flex items-center gap-10">
          <Magnetic>
            <Link href="/" className="flex items-center gap-4 group shrink-0">
              <div className="w-12 h-12 bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 relative overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="NexuJit Logo"
                  width={32}
                  height={32}
                  className="object-contain drop-shadow-[0_0_15px_rgba(37,99,235,0.5)]"
                />
              </div>
              <div className="flex flex-col hidden sm:flex">
                <span className="font-heading text-xl font-black tracking-tighter text-fg-primary leading-tight group-hover:text-accent transition-colors">NexuJit</span>
                <span className="text-[9px] uppercase font-black text-accent tracking-[0.3em] leading-none opacity-80 shimmer">Your Lab. Your Rules.</span>
              </div>
            </Link>
          </Magnetic>

          <div className="hidden xl:flex items-center gap-8 relative">
            {navLinks.map((link) => (
              <div key={link.label} className="relative" ref={link.label === 'Tools' ? toolsRef : null}>
                <Magnetic>
                  {link.href ? (
                    <Link
                      href={link.href}
                      className="text-[10px] font-black text-fg-tertiary hover:text-accent transition-all uppercase tracking-widest relative group/nav"
                    >
                      {link.label}
                      <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover/nav:w-full transition-all duration-300" />
                    </Link>
                  ) : (
                    <button
                      onClick={link.onClick}
                      className={`text-[10px] font-black ${link.active ? 'text-accent' : 'text-fg-tertiary'} hover:text-accent transition-all uppercase tracking-widest flex items-center gap-1.5 group/nav`}
                    >
                      {link.label}
                      <ChevronDown size={14} className={`transition-transform duration-300 ${link.active ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                </Magnetic>

                {/* Desktop Tools Dropdown */}
                {link.label === 'Tools' && (
                  <AnimatePresence>
                    {isToolsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.1, ease: [0.23, 1, 0.32, 1] }}
                        className="absolute top-12 left-0 w-[600px] glass p-6 rounded-[2rem] border border-accent/10 shadow-3xl z-50 overflow-hidden"
                      >
                        <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                          {categories.map((cat) => (
                            <Link
                              key={cat.id}
                              href={`/#${cat.id}`}
                              onClick={() => setIsToolsOpen(false)}
                              className="flex items-start gap-4 p-4 rounded-2xl hover:bg-accent/5 border border-transparent hover:border-accent/10 transition-all group/cat"
                            >
                              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover/cat:scale-110 transition-transform">
                                <cat.icon size={18} />
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="text-xs font-black text-fg-primary group-hover/cat:text-accent transition-colors uppercase tracking-widest">{cat.title}</span>
                                <span className="text-[9px] text-fg-tertiary font-medium leading-tight line-clamp-2">{cat.description}</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                        <div className="mt-6 pt-4 border-t border-glass-border">
                          <Link href="/tools" onClick={() => setIsToolsOpen(false)} className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-accent hover:underline">
                            View All Engineering Modules <Grid size={12} />
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Center Sector: Command Hub (SearchBar) */}
        <div className="flex-1 max-w-xl hidden md:block px-4">
          <div className="glass rounded-2xl p-1 bg-bg-tertiary/20 border border-accent/10 focus-within:ring-8 focus-within:ring-accent/5 transition-all focus-within:border-accent/40 focus-within:bg-bg-primary group">
            <SearchBar mini />
          </div>
        </div>

        {/* Right Sector: Global Controls */}
        <div className="flex items-center gap-3">
          <Magnetic>
            <button
              onClick={toggleTheme}
              className="w-12 h-12 flex items-center justify-center text-fg-secondary hover:bg-bg-tertiary hover:text-accent rounded-xl transition-all duration-150 glass border border-transparent hover:border-accent/20 group"
              title={isDarkMode ? 'Photon Sync' : 'Static Mode'}
            >
              {isDarkMode ? <Sun size={20} className="group-hover:rotate-90 transition-transform duration-300" /> : <Moon size={20} className="group-hover:-rotate-45 transition-transform duration-300" />}
            </button>
          </Magnetic>

          <div className="h-6 w-px bg-glass-border mx-2 hidden lg:block" />

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden w-12 h-12 flex items-center justify-center text-fg-primary glass rounded-xl transition-all border border-accent/10"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Interaction Plate */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed inset-x-0 top-24 z-[90] glass xl:hidden shadow-3xl overflow-hidden border-b border-accent/20"
          >
            <div className="p-8 space-y-8 bg-white/95 dark:bg-bg-primary/95 backdrop-blur-2xl max-h-[80vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-4">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-6 py-4 rounded-2xl text-lg font-black text-fg-primary hover:bg-accent/5 hover:text-accent transition-all glass border border-transparent"
                >
                  HOME
                </Link>

                <div className="space-y-4">
                  <span className="text-[10px] font-black text-accent uppercase tracking-[0.4em] px-2">Sector Registry</span>
                  <div className="grid grid-cols-1 gap-2">
                    {categories.slice(0, 6).map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/#${cat.id}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-4 px-6 py-3 rounded-xl text-sm font-bold text-fg-secondary hover:bg-accent/5 hover:text-accent transition-all border border-transparent hover:border-accent/10"
                      >
                        <cat.icon size={16} />
                        {cat.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-glass-border space-y-6">
                <SearchBar />
                <Link href="/tools" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="primary" size="xl" fullWidth className="rounded-[2rem] font-black text-lg py-5 shimmer shadow-xl shadow-accent/20">
                    ACCESS LIBRARY <ArrowRight size={20} className="ml-3" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

