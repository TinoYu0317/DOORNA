import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Delete, X } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface KeypadProps {
  onUnlock: () => void;
  onCancel: () => void;
  theme: 'light' | 'dark';
}

export const Keypad: React.FC<KeypadProps> = ({ onUnlock, onCancel, theme }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const isDark = theme === 'dark';

  const handlePress = (num: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
      setError(false);
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  useEffect(() => {
    if (pin.length === 4) {
      if (pin === '0000') {
        setTimeout(() => onUnlock(), 200);
      } else {
        setError(true);
        setTimeout(() => setPin(''), 400);
      }
    }
  }, [pin, onUnlock]);

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 bg-black/20 backdrop-blur-md"
    >
        <GlassCard 
            theme={theme} 
            blur={60} 
            opacity={isDark ? 0.95 : 0.9} 
            radius={40}
            className="w-full max-w-[340px] p-6 flex flex-col items-center shadow-2xl"
        >
            <div className="w-full flex justify-end mb-4">
                <button onClick={onCancel} className={`p-2 rounded-full ${isDark ? 'hover:bg-white/10 text-white/50' : 'hover:bg-black/5 text-black/50'}`}>
                    <X size={20} />
                </button>
            </div>

            <div className="mb-8 flex flex-col items-center">
                <div className={`text-xs font-bold tracking-[0.2em] uppercase mb-6 ${isDark ? 'text-white/70' : 'text-stone-500'}`}>
                    Enter Passcode
                </div>
                
                {/* Dots */}
                <div className="flex gap-4 h-4">
                    {[0, 1, 2, 3].map(i => (
                        <motion.div
                            key={i}
                            animate={{ 
                                scale: pin.length > i ? 1 : 0.5,
                                backgroundColor: pin.length > i 
                                    ? (error ? '#EF4444' : (isDark ? '#FFF' : '#1C1917')) 
                                    : (isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)')
                            }}
                            className="w-3 h-3 rounded-full"
                        />
                    ))}
                </div>
                
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="absolute top-24 text-xs font-medium text-red-500 mt-2"
                        >
                            Incorrect Passcode
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="grid grid-cols-3 gap-4 w-full px-2">
                {keys.map((k, i) => {
                    if (k === '') return <div key={i} />;
                    if (k === 'del') {
                        return (
                            <button
                                key={k}
                                onClick={handleDelete}
                                className={`h-16 w-16 flex items-center justify-center rounded-full transition-all active:scale-90 mx-auto ${isDark ? 'text-white/70 hover:bg-white/10' : 'text-stone-600 hover:bg-black/5'}`}
                            >
                                <Delete size={24} />
                            </button>
                        );
                    }
                    return (
                        <button
                            key={k}
                            onClick={() => handlePress(k)}
                            className={`
                                h-16 w-16 rounded-full text-2xl font-light flex items-center justify-center mx-auto
                                transition-all active:scale-90
                                ${isDark 
                                    ? 'bg-white/5 hover:bg-white/10 text-white shadow-lg shadow-black/20' 
                                    : 'bg-white/50 hover:bg-white/80 text-stone-800 shadow-sm'}
                            `}
                        >
                            {k}
                        </button>
                    );
                })}
            </div>
            
            <div className={`mt-8 text-[10px] font-medium opacity-40 ${isDark ? 'text-white' : 'text-black'}`}>
                Hint: 0000
            </div>
        </GlassCard>
    </motion.div>
  );
};
