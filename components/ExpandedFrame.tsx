import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FrameType, DoornaItem } from '../types';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface ExpandedFrameProps {
  type: FrameType;
  items: DoornaItem[];
  onClose: () => void;
  theme: 'light' | 'dark';
}

export const ExpandedFrame: React.FC<ExpandedFrameProps> = ({ type, items, onClose, theme }) => {
  const filteredItems = items.filter(i => i.type === type);
  const [calView, setCalView] = useState<'month' | 'week'>('month');
  const isDark = theme === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", duration: 0.4 }}
      className="absolute inset-0 z-40"
    >
      <GlassCard 
        radius={0} 
        theme={theme}
        blur={50}
        opacity={isDark ? 0.85 : 0.9}
        className="w-full h-full"
      >
        {/* Inner layout wrapper to ensure flex-1 works for scrolling list */}
        <div className="w-full h-full flex flex-col p-6 pt-12">
            <div className="flex justify-between items-center mb-6">
                <h2 className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{type}</h2>
                <button 
                onClick={onClose}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                <X size={20} />
                </button>
            </div>

            {/* Calendar Specific Controls */}
            {type === FrameType.CALENDAR && (
                <div className="flex flex-col mb-6">
                    <div className={`flex p-1 rounded-lg w-full mb-6 ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
                        <button 
                            onClick={() => setCalView('month')}
                            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
                                calView === 'month' 
                                    ? (isDark ? 'bg-white/10 shadow-sm text-white' : 'bg-white shadow-sm text-gray-900') 
                                    : (isDark ? 'text-gray-400' : 'text-gray-500')
                            }`}
                        >
                            Month
                        </button>
                        <button 
                            onClick={() => setCalView('week')}
                            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
                                calView === 'week' 
                                    ? (isDark ? 'bg-white/10 shadow-sm text-white' : 'bg-white shadow-sm text-gray-900') 
                                    : (isDark ? 'text-gray-400' : 'text-gray-500')
                            }`}
                        >
                            Week
                        </button>
                    </div>

                    {/* Fake Calendar Grid Viz */}
                    <div className={`border rounded-2xl p-4 shadow-sm mb-6 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'}`}>
                        <div className="flex justify-between items-center mb-4">
                            <span className={`font-semibold text-lg ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>October 2024</span>
                            <div className="flex gap-2">
                                <ChevronLeft size={20} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
                                <ChevronRight size={20} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
                            </div>
                        </div>
                        {calView === 'month' ? (
                            <div className="grid grid-cols-7 gap-y-4 text-center text-sm">
                                {['S','M','T','W','T','F','S'].map(d => <span key={d} className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{d}</span>)}
                                {Array.from({length: 31}).map((_, i) => (
                                    <span key={i} className={`py-1 ${i === 24 ? 'bg-red-500 text-white rounded-full' : (isDark ? 'text-gray-300' : 'text-gray-700')}`}>{i+1}</span>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {[21,22,23,24,25,26,27].map((d, i) => (
                                    <div key={d} className={`flex items-center gap-4 p-2 rounded-xl ${d === 25 ? (isDark ? 'bg-blue-900/20' : 'bg-blue-50') : ''}`}>
                                        <div className="flex flex-col items-center w-10">
                                            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{'MTWTFSS'[i]}</span>
                                            <span className={`font-semibold ${d === 25 ? 'text-blue-500' : (isDark ? 'text-gray-300' : 'text-gray-800')}`}>{d}</span>
                                        </div>
                                        <div className={`h-10 flex-1 rounded-lg border relative overflow-hidden ${isDark ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                                            {d === 25 && <div className={`absolute top-1 left-2 right-2 h-8 rounded flex items-center px-2 text-xs font-medium ${isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-200/50 text-blue-800'}`}>Design Review</div>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Items List */}
            <h3 className={`text-sm font-semibold uppercase tracking-wide mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                {type === FrameType.CALENDAR ? 'Upcoming Events' : type === FrameType.FINANCE ? 'Transactions' : 'Items'}
            </h3>
            
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pb-8">
                {filteredItems.length === 0 ? (
                <div className={`text-center mt-10 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Nothing here yet.</div>
                ) : (
                filteredItems.map(item => (
                    <div key={item.id} className={`border p-4 rounded-xl shadow-sm flex justify-between items-center ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-gray-200'}`}>
                    <div>
                        <div className={`text-base font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{item.title}</div>
                        <div className={`text-sm mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                            {item.payload?.date || item.rawText} 
                            {item.payload?.location ? ` • ${item.payload.location}` : ''}
                        </div>
                    </div>
                    {type === FrameType.FINANCE && (
                        <span className={item.payload?.amount > 0 ? "text-green-500 font-medium" : (isDark ? "text-gray-200 font-medium" : "text-gray-900 font-medium")}>
                                {item.payload?.amount > 0 ? '+' : ''}{item.payload?.amount?.toFixed(2)}
                        </span>
                    )}
                    </div>
                ))
                )}
            </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};