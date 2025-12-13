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
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className="absolute inset-0 z-50 flex flex-col justify-end"
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      
      <GlassCard 
        className="relative z-10 h-2/3 w-full flex flex-col" 
        radius="32px 32px 0 0"
        theme={theme}
        blur={40}
        opacity={isDark ? 0.9 : 0.95}
      >
        <div className="p-6 pb-12 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 text-purple-500">
                    <Sparkles size={20} />
                    <span className="font-semibold tracking-wide">AI EDIT: {type}</span>
                </div>
                <button onClick={onClose} className={isDark ? "text-gray-400 hover:text-white" : "text-gray-400 hover:text-gray-600"}>
                    <X size={24} />
                </button>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4">
                <p className={isDark ? "text-gray-400" : "text-gray-500"}>Describe how you want to modify or organize this room.</p>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., Sort by date and remove duplicates..."
                    className={`w-full h-32 rounded-xl p-4 resize-none outline-none focus:ring-1 focus:ring-purple-500 placeholder-gray-400 ${isDark ? 'bg-black/20 text-gray-200 border-white/10' : 'bg-gray-50 text-gray-900 border-gray-200'} border`}
                />
            </div>

            <button 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl mt-4 transition-colors shadow-lg shadow-purple-900/20"
                onClick={onClose}
            >
                Apply Changes
            </button>
        </div>
      </GlassCard>
    </motion.div>
  );
};
