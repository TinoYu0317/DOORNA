import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DoornaItem } from '../types';
import { X, Send, Mic, Image as ImageIcon, FileText, Plus } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface AIEditProps {
  item: DoornaItem;
  onClose: () => void;
  theme: 'light' | 'dark';
}

export const AIEdit: React.FC<AIEditProps> = ({ item, onClose, theme }) => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showSelector, setShowSelector] = useState(false);
  const [mode, setMode] = useState<'text' | 'voice' | 'image' | 'file'>('text');
  
  const isDark = theme === 'dark';
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = () => {
    if (!input.trim() && !isRecording) return;
    console.log(`AI Edit for Item ${item.id}:`, input);
    onClose();
  };

  const handleMicTap = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      setMode('voice');
    }
  };

  const toggleSelector = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSelector(prev => !prev);
  };

  const selectFileMode = (m: 'image' | 'file') => {
      setMode(m);
      setShowSelector(false);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-6">
        {/* Backdrop */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={onClose}
        />

        {/* Centered Frame Modal */}
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-[360px]"
        >
            <GlassCard 
                radius={40}
                theme={theme}
                blur={60}
                opacity={isDark ? 0.95 : 0.9}
                className="p-6 flex flex-col gap-6 shadow-2xl overflow-visible"
                style={{
                    backgroundColor: isDark ? 'rgba(20,20,25,0.85)' : 'rgba(255,255,255,0.85)'
                }}
            >
                {/* Header Section */}
                <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                        <span className={`text-[10px] font-bold uppercase tracking-wider opacity-50 ${isDark ? 'text-white' : 'text-black'}`}>
                            Doorna AI
                        </span>
                        <span className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Refine Item
                        </span>
                    </div>
                    <button 
                        onClick={onClose}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors -mr-2 -mt-2 ${isDark ? 'hover:bg-white/10 text-white/50' : 'hover:bg-black/5 text-black/40'}`}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Context Box - Showing user what they are editing */}
                <div className={`p-3 rounded-2xl flex flex-col gap-1 ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
                    <span className={`text-[10px] font-bold uppercase opacity-40 ${isDark ? 'text-white' : 'text-black'}`}>Selected</span>
                    <div className={`text-sm font-medium line-clamp-2 ${isDark ? 'text-gray-200' : 'text-stone-700'}`}>
                        {item.title}
                    </div>
                    {item.payload?.date && (
                        <div className={`text-[10px] opacity-60 ${isDark ? 'text-gray-400' : 'text-stone-500'}`}>{item.payload.date} {item.payload.time}</div>
                    )}
                </div>

                {/* Input Bar (Lobby Style) */}
                <div className="relative group z-20">
                     <GlassCard
                        className={`
                        w-full h-14 
                        transition-all duration-300
                        ${isRecording ? 'ring-2 ring-red-400/30' : ''}
                        `}
                        radius="9999px"
                        blur={40}
                        theme={theme}
                        opacity={isDark ? 0.15 : 0.3}
                        style={{
                            boxShadow: isDark 
                                ? 'inset 0 2px 5px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.08)' 
                                : 'inset 0 2px 6px rgba(160, 140, 120, 0.1), 0 1px 0 rgba(255,255,255,0.6)',
                            backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.5)',
                        }}
                    >
                        <div className="w-full h-full flex items-center pl-5 pr-1.5">
                             <input
                                ref={inputRef}
                                type="text"
                                value={isRecording ? "Recording..." : input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                                placeholder="Change time, rewrite, move..."
                                disabled={isRecording}
                                className={`flex-1 bg-transparent border-none outline-none text-[16px] font-normal min-w-0 ${isDark ? 'text-gray-200 placeholder-gray-600' : 'text-stone-800 placeholder-stone-400'}`}
                            />

                            <div className="flex items-center gap-1">
                                {/* Plus/Selector */}
                                <div className="relative">
                                     <div 
                                        className={`w-9 h-9 rounded-full active:scale-90 transition-all cursor-pointer flex items-center justify-center ${isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-black/5 text-stone-500'}`}
                                        onClick={toggleSelector}
                                    >
                                        {mode === 'image' ? <ImageIcon size={18} className={isDark ? 'drop-shadow-[0_0_2px_rgba(255,255,255,0.3)]' : ''} /> : mode === 'file' ? <FileText size={18} /> : <Plus size={20} />}
                                    </div>
                                    <AnimatePresence>
                                        {showSelector && (
                                            <motion.div 
                                                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                                animate={{ opacity: 1, scale: 1, y: -70 }}
                                                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                                                className="absolute bottom-full right-[-10px] mb-0 pb-3 flex flex-col items-center"
                                                onMouseLeave={() => setShowSelector(false)}
                                            >   
                                                <GlassCard radius={16} theme={theme} blur={40} className="p-1.5 flex flex-col gap-1 w-[130px] shadow-xl">
                                                    <button onClick={() => selectFileMode('image')} className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-colors ${isDark ? 'text-gray-300 hover:bg-white/10' : 'text-stone-600 hover:bg-stone-50'}`}>
                                                        <ImageIcon size={14} /> Image
                                                    </button>
                                                    <button onClick={() => selectFileMode('file')} className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-colors ${isDark ? 'text-gray-300 hover:bg-white/10' : 'text-stone-600 hover:bg-stone-50'}`}>
                                                        <FileText size={14} /> File
                                                    </button>
                                                </GlassCard>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Mic */}
                                <div 
                                    className={`w-9 h-9 rounded-full active:scale-90 transition-all cursor-pointer flex items-center justify-center ${isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-black/5 text-stone-500'}`}
                                    onClick={(e) => { e.stopPropagation(); handleMicTap(); }}
                                >
                                    {isRecording ? (
                                        <motion.div 
                                            className="relative flex items-center justify-center"
                                        >
                                            <motion.div 
                                                animate={{ scale: [1, 2], opacity: [0.3, 0] }}
                                                transition={{ repeat: Infinity, duration: 1.5 }}
                                                className="absolute inset-0 bg-red-500 rounded-full"
                                            />
                                            <div className="w-2.5 h-2.5 bg-red-500 rounded-full relative z-10 shadow-lg shadow-red-500/50" />
                                        </motion.div>
                                    ) : (
                                        <Mic size={20} className={isDark ? 'drop-shadow-[0_0_2px_rgba(255,255,255,0.3)]' : ''} />
                                    )}
                                </div>

                                {/* Send */}
                                <button 
                                    onClick={handleSubmit}
                                    disabled={!input.trim() && !isRecording}
                                    className={`w-9 h-9 flex items-center justify-center transition-colors ${isDark ? 'text-blue-400 disabled:text-gray-600 drop-shadow-[0_0_2px_rgba(96,165,250,0.5)]' : 'text-blue-600 disabled:text-stone-300'}`}
                                >
                                    <Send size={20} strokeWidth={2} />
                                </button>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            </GlassCard>
        </motion.div>
    </div>
  );
};