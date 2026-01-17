'use client';

import { useState } from 'react';
import { MessageSquarePlus, X, MessageCircle, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SuggestToolWidget() {
  const [isOpen, setIsOpen] = useState(false);

  // Replace with your actual contact details
  const whatsappNumber = '+8801997041499';
  const messengerUsername = 'yourpage';

  const handleWhatsApp = () => {
    const message = encodeURIComponent('Hi! I would like to suggest a new tool for SEOStudio:');
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  const handleMessenger = () => {
    window.open(`https://m.me/${messengerUsername}`, '_blank');
  };

  return (
    <div className="fixed bottom-8 right-8 z-[1000] font-body">
      <AnimatePresence>
        {!isOpen ? (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 px-6 py-4 bg-accent text-white rounded-2xl shadow-xl shadow-accent/30 font-bold text-sm tracking-tight"
            onClick={() => setIsOpen(true)}
          >
            <MessageSquarePlus size={20} />
            Suggest a Tool
          </motion.button>
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-[380px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden"
          >
            <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2 text-accent">
                <Sparkles size={18} className="fill-current" />
                <h3 className="font-heading text-lg font-bold text-fg-primary">Toolkit Insights</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-fg-tertiary transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8">
              <p className="text-fg-secondary text-sm leading-relaxed mb-8 text-center">
                Have an idea for a new tool? Our engineers are ready to build it. Send your suggestion directly!
              </p>

              <div className="space-y-4 mb-8">
                <button
                  onClick={handleWhatsApp}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-50 dark:border-slate-800 hover:border-[#25D366]/30 hover:bg-[#25D366]/5 group transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center group-hover:bg-[#25D366] group-hover:text-white transition-all">
                    <MessageCircle size={24} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-fg-primary">WhatsApp</p>
                    <p className="text-xs text-fg-tertiary">Direct to developer</p>
                  </div>
                </button>

                <button
                  onClick={handleMessenger}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-50 dark:border-slate-800 hover:border-[#0084FF]/30 hover:bg-[#0084FF]/5 group transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#0084FF]/10 text-[#0084FF] flex items-center justify-center group-hover:bg-[#0084FF] group-hover:text-white transition-all">
                    <Send size={24} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-fg-primary">Messenger</p>
                    <p className="text-xs text-fg-tertiary">Support channel</p>
                  </div>
                </button>
              </div>

              <div className="text-center">
                <p className="text-[11px] font-bold text-fg-tertiary uppercase tracking-widest">
                  Verified Strategy Deployment
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
