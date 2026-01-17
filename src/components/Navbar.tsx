'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Search, Menu, Sun, Moon, X, Sparkles, ChevronDown, BookOpen, Clock, LayoutGrid, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Magnetic } from './ui/Core';

export default function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'light';
    setIsDarkMode(theme === 'dark');
    document.documentElement.setAttribute('data-theme', theme);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const navLinks = [
    { label: 'AI Tools', href: '/#ai-tools', icon: Sparkles },
    { label: 'SEO Tools', href: '/#seo-tools', icon: LayoutGrid },
    { label: 'Utilities', href: '/#text-tools', icon: Zap },
  ];

  return (
    <nav
      className={`h-24 sticky top-0 z-[100] flex items-center transition-all duration-700 ${isScrolled
        ? 'glass border-b border-accent/20 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] py-2'
        : 'bg-transparent border-b border-transparent py-4'
        }`}
    >
      <div className="page-container w-full flex items-center justify-between gap-6">
        {/* Left Sector: Branding & Brief Links */}
        <div className="flex items-center gap-10">
          <Magnetic>
            <Link href="/" className="flex items-center gap-4 group shrink-0">
              <div className="w-12 h-12 bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10 shadow-lg transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 relative overflow-hidden">
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

          <div className="hidden xl:flex items-center gap-8">
            {navLinks.map((link) => (
              <Magnetic key={link.label}>
                <Link
                  href={link.href}
                  className="text-[10px] font-black text-fg-tertiary hover:text-accent transition-all uppercase tracking-widest relative group/nav"
                >
                  {link.label}
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover/nav:w-full transition-all duration-500" />
                </Link>
              </Magnetic>
            ))}
          </div>
        </div>

        {/* Center Sector: Command Hub (SearchBar) */}
        <div className="flex-1 max-w-2xl hidden md:block px-4">
          <div className="glass rounded-2xl p-1 bg-bg-tertiary/20 border border-accent/10 focus-within:ring-8 focus-within:ring-accent/5 transition-all focus-within:border-accent/40 focus-within:bg-white dark:focus-within:bg-slate-900 group">
            <SearchBar mini />
          </div>
        </div>

        {/* Right Sector: Global Controls */}
        <div className="flex items-center gap-3">
          <Magnetic>
            <button
              onClick={toggleTheme}
              className="w-12 h-12 flex items-center justify-center text-fg-secondary hover:bg-white dark:hover:bg-slate-800 hover:text-accent rounded-xl transition-all duration-500 glass border border-transparent hover:border-accent/20 group"
              title={isDarkMode ? 'Photon Sync' : 'Static Mode'}
            >
              {isDarkMode ? <Sun size={20} className="group-hover:rotate-90 transition-transform duration-700" /> : <Moon size={20} className="group-hover:-rotate-45 transition-transform duration-700" />}
            </button>
          </Magnetic>

          <div className="h-6 w-px bg-glass-border mx-2 hidden lg:block" />


          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-12 h-12 flex items-center justify-center text-fg-primary glass rounded-xl transition-all border border-accent/10"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Interaction Plate */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-24 z-[90] glass lg:hidden shadow-3xl overflow-hidden border-b border-accent/20"
          >
            <div className="p-10 space-y-12 bg-white/80 dark:bg-bg-primary/80 backdrop-blur-2xl">
              <div className="grid grid-cols-1 gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center px-8 py-6 rounded-3xl text-2xl font-black text-fg-primary hover:bg-accent/5 hover:text-accent transition-all font-heading glass border border-transparent hover:border-accent/10 group"
                  >
                    <link.icon size={24} className="mr-6 text-accent group-hover:scale-125 transition-transform" />
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="pt-10 border-t border-glass-border">
                <SearchBar />
                <Button variant="primary" size="xl" fullWidth className="mt-10 rounded-3xl font-black text-xl py-6 shimmer">
                  ACCESS LIBRARY <ChevronDown className="ml-2 -rotate-90" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

const ArrowRight = ({ size, className }: { size: number, className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 12h14m-7-7 7 7-7 7" />
  </svg>
);
