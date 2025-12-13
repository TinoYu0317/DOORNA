import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FrameType } from '../types';
import { Sparkles, X } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface AIEditProps {
  type: FrameType;
  onClose: () => void;
  theme: 'light' | 'dark';
}

export const AIEdit: React.FC<AIEditProps> = ({ type, onClose, theme }) => {
  const [prompt, setPrompt] = useState('');
  const isDark = theme === 'dark';

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        className="relative z-10 w-full max-w-sm"
      >
        <GlassCard 
          className="w-full flex flex-col overflow-hidden" 
          radius={32}
          theme={theme}
          blur={50}
          opacity={isDark ? 0.95 : 0.95}
        >
            {/* Doorna Logo Header */}
            <div className="pt-8 text-center">
                <div className={`text-base font-black tracking-[0.3em] uppercase opacity-70 ${isDark ? 'text-white' : 'text-stone-600'}`}>
                    Doorna
                </div>
            </div>

            <div className="p-6 pb-8 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2 text-purple-500">
                        <Sparkles size={18} />
                        <span className="font-semibold text-sm tracking-wide">EDIT {type}</span>
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-4">
                    <p className={`text-sm text-center ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        How should the AI reorganize this frame?
                    </p>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., Sort by date, remove completed items..."
                        className={`w-full h-32 rounded-2xl p-4 resize-none outline-none text-base focus:ring-1 focus:ring-purple-500/50 placeholder-gray-400 ${isDark ? 'bg-black/30 text-gray-200 border border-white/10' : 'bg-gray-50 text-gray-900 border border-gray-200'}`}
                    />
                </div>

                <div className="flex gap-3 mt-6">
                    <button 
                        onClick={onClose}
                        className={`flex-1 py-3.5 rounded-xl font-medium text-sm transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
                    >
                        Cancel
                    </button>
                    <button 
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl text-sm transition-colors shadow-lg shadow-purple-900/20"
                        onClick={onClose}
                    >
                        Apply
                    </button>
                </div>
            </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};