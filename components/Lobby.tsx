import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Image as ImageIcon, FileText, Plus, Sun, Moon, ChevronLeft, User } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { DoornaItem } from '../types';
import { GlassCard } from './GlassCard';

interface LobbyProps {
  onOpenDoor: () => void;
  onSaveItem: (item: DoornaItem) => void;
  isVisible: boolean;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

type InputMode = 'text' | 'voice' | 'image' | 'file';

export const Lobby: React.FC<LobbyProps> = ({ onOpenDoor, onSaveItem, isVisible, theme, onToggleTheme }) => {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [mode, setMode] = useState<InputMode>('text');
  const [isRecording, setIsRecording] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  
  const [showSelector, setShowSelector] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isVisible && !isProcessing && !showSelector && mode === 'text') {
        setFeedback(null);
        setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isVisible, isProcessing, showSelector, mode]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() && !isRecording) return;

    setIsProcessing(true);
    setHasStarted(true); // Hide the tagline once interaction starts

    const text = input || (isRecording ? "Voice Note (Processed)" : "");
    setInput('');
    setIsRecording(false);
    inputRef.current?.blur();

    try {
      const result = await geminiService.routeInput(text);
      
      const newItem: DoornaItem = {
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        source: mode === 'voice' ? 'voice' : 'user',
        rawText: text,
        type: result.type,
        title: result.title,
        payload: result.payload,
        status: 'active'
      };

      onSaveItem(newItem);
      setFeedback(`${result.summary}: ${result.title}`);
      setMode('text');
      
      setTimeout(() => {
        setFeedback(null);
        setIsProcessing(false);
        inputRef.current?.focus();
      }, 2000);

    } catch (err) {
      setFeedback("Error processing request");
      setIsProcessing(false);
    }
  };

  const handleMicTap = () => {
    if (isRecording) {
        handleSubmit();
    } else {
        setIsRecording(true);
        setMode('voice');
        setFeedback("Listening...");
    }
  };

  const toggleSelector = (e: React.MouseEvent | React.TouchEvent) => {
      e.stopPropagation();
      setShowSelector(prev => !prev);
  };

  const selectFileMode = (m: InputMode) => {
      setMode(m);
      setShowSelector(false);
      setFeedback(`Mode switched to ${m}`);
      setTimeout(() => setFeedback(null), 1000);
  };

  const isDark = theme === 'dark';

  return (
    <motion.div 
      className="absolute inset-0 z-50 flex flex-col transition-colors duration-500"
      style={{ 
        // WARM CUTE GRADIENT for Light Mode
        background: isDark 
            ? 'linear-gradient(135deg, rgba(24, 24, 27, 0.2) 0%, rgba(39, 39, 42, 0.3) 100%)' 
            : 'linear-gradient(135deg, rgba(255, 248, 240, 0.4) 0%, rgba(255, 245, 235, 0.5) 100%)'
      }}
    >
      {/* Background Blur Layer */}
      <div className={`absolute inset-0 backdrop-blur-lg ${isDark ? 'bg-black/10' : 'bg-white/10'}`} />

      {/* 
        DOORNA LOGO (LOBBY VERSION)
        Placing it here ensures it sits ON TOP of the Lobby glass layer.
      */}
      <div 
        className={`
          absolute top-12 left-8 z-30 
          text-xl font-black tracking-[0.3em] uppercase 
          pointer-events-none transition-colors duration-500
          opacity-80
          ${isDark ? 'text-white/90' : 'text-stone-700/60'}
        `}
      >
        Doorna
      </div>

      {/* Visual Door Handle Indicator (Right side) */}
      <div className="absolute z-30 right-1.5 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 pointer-events-none opacity-80">
        <div className={`w-1 h-20 rounded-full backdrop-blur-md shadow-sm ${isDark ? 'bg-white/20' : 'bg-black/10'}`} />
        <motion.div
            animate={{ x: [-3, 3, -3], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        >
             <ChevronLeft size={16} className={isDark ? 'text-white/40' : 'text-black/30'} />
        </motion.div>
      </div>

      {/* Theme Toggle Top Right */}
      <button 
        onClick={onToggleTheme}
        className={`absolute top-10 right-8 z-30 w-10 h-10 flex items-center justify-center rounded-full active:scale-95 transition-all ${isDark ? 'text-white/60 hover:bg-white/10' : 'text-stone-500 hover:bg-stone-200/50'}`}
      >
          {isDark ? <Moon size={20} className="drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]" /> : <Sun size={20} />}
      </button>

      {/* Center Input Container */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center w-full px-5">
        
        {/* Tagline that disappears after interaction */}
        <AnimatePresence>
          {!hasStarted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className={`mb-3 text-center px-4 w-full`}
            >
              <h2 className={`text-base font-normal tracking-wide italic opacity-70 ${isDark ? 'text-white/80' : 'text-stone-600'}`}>
                "Try to organize without using your brain."
              </h2>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="w-full max-w-md relative group">
          {/* 
            SEARCH BAR (CURVED IN / INSET)
          */}
          <GlassCard
            className={`
              w-full h-14 
              transition-all duration-300
              ${isProcessing ? 'opacity-50 pointer-events-none' : 'opacity-100'}
              ${isRecording ? 'ring-2 ring-red-400/30' : ''}
            `}
            radius="9999px" // Fully rounded pill
            blur={40}
            theme={theme}
            opacity={isDark ? 0.15 : 0.3}
            style={{
              boxShadow: isDark 
                ? 'inset 0 2px 5px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.08)' 
                : 'inset 0 2px 6px rgba(160, 140, 120, 0.1), 0 1px 0 rgba(255,255,255,0.6)',
              backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.5)',
              ...(isRecording ? { backgroundColor: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(254, 202, 202, 0.2)' } : {})
            }}
          >
            {/* Inner Flex Wrapper for Correct Layout */}
            <div className="w-full h-full flex items-center pl-6 pr-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={isRecording ? "Recording..." : input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  placeholder={mode === 'voice' ? "Tap icon to stop..." : "What's in your mind?"}
                  disabled={isRecording}
                  // Font size adjusted slightly for slimmer bar
                  className={`flex-1 bg-transparent border-none outline-none text-[17px] font-normal min-w-0 ${isDark ? 'text-gray-200 placeholder-gray-600' : 'text-stone-800 placeholder-stone-400'}`}
                />

                <div className="flex items-center gap-1">
                    
                    {/* 1. Plus Button */}
                    <div className="relative">
                        <div 
                            className={`w-9 h-9 rounded-full active:scale-90 transition-all cursor-pointer flex items-center justify-center ${isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-black/5 text-stone-500'}`}
                            onClick={toggleSelector}
                        >
                            {mode === 'image' ? <ImageIcon size={20} className={isDark ? 'drop-shadow-[0_0_2px_rgba(255,255,255,0.3)]' : ''} /> : mode === 'file' ? <FileText size={20} /> : <Plus size={20} />}
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
                                    <GlassCard radius={16} theme={theme} blur={40} className="p-1.5 flex flex-col gap-1 w-[130px]">
                                        <button onClick={() => selectFileMode('image')} className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${isDark ? 'text-gray-300 hover:bg-white/10' : 'text-stone-600 hover:bg-stone-50'}`}>
                                            <ImageIcon size={16} /> Image
                                        </button>
                                        <button onClick={() => selectFileMode('file')} className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${isDark ? 'text-gray-300 hover:bg-white/10' : 'text-stone-600 hover:bg-stone-50'}`}>
                                            <FileText size={16} /> File
                                        </button>
                                    </GlassCard>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* 2. Voice Toggle */}
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
                                <motion.div 
                                    animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                                    className="absolute inset-0 bg-red-500 rounded-full"
                                />
                                <div className="w-2.5 h-2.5 bg-red-500 rounded-full relative z-10 shadow-lg shadow-red-500/50" />
                            </motion.div>
                        ) : (
                            <Mic size={20} className={isDark ? 'drop-shadow-[0_0_2px_rgba(255,255,255,0.3)]' : ''} />
                        )}
                    </div>

                    <button 
                    onClick={() => handleSubmit()}
                    disabled={!input.trim() && !isRecording}
                    className={`w-9 h-9 flex items-center justify-center transition-colors ${isDark ? 'text-blue-400 disabled:text-gray-600 drop-shadow-[0_0_2px_rgba(96,165,250,0.5)]' : 'text-blue-600 disabled:text-stone-300'}`}
                    >
                    <Send size={20} strokeWidth={2} />
                    </button>
                </div>
            </div>
          </GlassCard>
        </div>

        <div className="h-8 mt-6">
            <AnimatePresence>
            {feedback && (
                <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`text-sm font-medium tracking-wide mix-blend-overlay ${isDark ? 'text-white/50' : 'text-stone-500'}`}
                >
                {feedback}
                </motion.div>
            )}
            </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};