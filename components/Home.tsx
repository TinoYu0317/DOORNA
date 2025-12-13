import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ViewMode, FrameType, DoornaItem } from '../types';
import { GlassFrame } from './GlassFrame';
import { Calendar as CalendarIcon, CheckSquare, Image as ImageIcon, Key, Banknote, StickyNote, Sun, Lock } from 'lucide-react';

interface HomeProps {
  viewMode: ViewMode;
  pageIndex: number;
  items: DoornaItem[];
  onFrameTap: (type: FrameType) => void;
  onFrameLongPress: (type: FrameType) => void;
  onPageChange: (index: number) => void;
  dragX: number;
  theme: 'light' | 'dark';
}

export const Home: React.FC<HomeProps> = ({ 
  viewMode, 
  pageIndex, 
  items, 
  onFrameTap, 
  onFrameLongPress, 
  dragX, 
  theme
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDark = theme === 'dark';
  
  // Widget Specific States
  const [calendarView, setCalendarView] = useState<'month' | 'week'>('month');

  const getItemsFor = (type: FrameType) => items.filter(i => i.type === type);

  const renderFrameContent = (type: FrameType) => {
    const frameItems = getItemsFor(type);
    const count = frameItems.length;
    const latest = frameItems[frameItems.length - 1];

    // --- KEY FRAME (SECURE FROSTED GLASS) ---
    if (type === FrameType.KEY) {
        return (
            <div className="h-full flex flex-col relative overflow-hidden">
                {/* 
                   Background: Blurred List of "Secrets" 
                */}
                <div 
                    className="flex-1 flex flex-col gap-2 opacity-50 filter blur-[5px] select-none transition-all duration-500 pt-1" 
                    style={{ maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)' }}
                >
                    {[1, 2, 3].map((_, i) => (
                        <div key={i} className="flex items-center justify-between px-1">
                             <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-white/10' : 'bg-stone-500/10'}`}>
                                    <Key size={14} className="opacity-50" />
                                </div>
                                <div className="space-y-1.5">
                                    <div className={`h-2 w-20 rounded-full ${isDark ? 'bg-white/20' : 'bg-stone-600/20'}`} />
                                    <div className={`h-1.5 w-12 rounded-full ${isDark ? 'bg-white/10' : 'bg-stone-500/10'}`} />
                                </div>
                             </div>
                             <div className={`text-[10px] tracking-[0.3em] opacity-30 ${isDark ? 'text-white' : 'text-black'}`}>•••••</div>
                        </div>
                    ))}
                </div>

                {/* Foreground: Biometric Lock UI */}
                <div className="absolute inset-0 z-20 flex flex-row items-center justify-center gap-3 pb-20">
                     <motion.div 
                        whileTap={{ scale: 0.95 }}
                        className={`
                            relative w-12 h-12 rounded-[18px] flex items-center justify-center
                            backdrop-blur-xl shadow-xl border
                            transition-all duration-300 group-active:scale-95
                            ${isDark 
                                ? 'bg-gradient-to-br from-white/10 to-white/5 border-white/20 text-white shadow-black/40' 
                                : 'bg-gradient-to-br from-white/80 to-white/40 border-white/60 text-stone-600 shadow-stone-300/40'}
                        `}
                    >
                        <Lock size={18} strokeWidth={2.5} />
                        
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 rounded-[18px] overflow-hidden pointer-events-none">
                            <motion.div 
                                animate={{ left: ['-100%', '200%'] }}
                                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: 1 }}
                                className={`absolute top-0 bottom-0 w-1/2 -skew-x-12 blur-md ${isDark ? 'bg-white/10' : 'bg-white/40'}`}
                            />
                        </div>
                    </motion.div>
                    
                    <div className="flex flex-col justify-center">
                        <div className={`text-xs font-bold tracking-[0.2em] uppercase ${isDark ? 'text-white/90' : 'text-stone-700'}`}>
                            Locked
                        </div>
                        <div className={`text-[9px] font-medium tracking-wide opacity-50 ${isDark ? 'text-white' : 'text-stone-600'}`}>
                            Tap to Authenticate
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // --- TODAY WIDGET ---
    if (type === FrameType.TODAY) {
        return (
            // Ensure full height containment and no overflow out of this div
            <div className="h-full flex flex-col overflow-hidden -mt-1">
                <div className="flex justify-between items-center mb-1 flex-shrink-0">
                    <span className={`text-[10px] font-bold tracking-wider uppercase opacity-70 ${isDark ? 'text-gray-400' : 'text-stone-500'}`}>
                        Upcoming
                    </span>
                    <span className="text-[10px] text-orange-500 font-bold tracking-wide">
                        {new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
                    </span>
                </div>

                <div 
                    className="flex-1 min-h-0 w-full overflow-y-auto no-scrollbar pb-2"
                    style={{
                        maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)'
                    }}
                >
                     <div className="flex flex-col gap-0.5">
                        {frameItems.map(i => (
                            <div key={i.id} className="flex flex-col gap-0.5 border-b border-dashed border-opacity-20 last:border-0 pb-1.5 pt-0.5 border-gray-400">
                                <div className="flex justify-between items-center">
                                    <div className={`text-xs font-semibold leading-tight truncate pr-2 ${i.status === 'done' ? 'text-stone-400 line-through' : isDark ? 'text-gray-200' : 'text-stone-800'}`}>
                                        {i.title}
                                    </div>
                                    <div className={`text-[10px] font-medium whitespace-nowrap flex-shrink-0 ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>{i.payload?.time}</div>
                                </div>
                                {i.payload?.location && (
                                    <div className={`text-[9px] truncate ${isDark ? 'text-gray-500' : 'text-stone-500'}`}>
                                        {i.payload.location}
                                    </div>
                                )}
                            </div>
                        ))}
                     </div>
                     {frameItems.length === 0 && <div className="text-stone-400 text-xs italic mt-2">All clear today</div>}
                </div>
            </div>
        )
    }

    // --- CALENDAR WIDGET ---
    if (type === FrameType.CALENDAR) {
        return (
            <div className="h-full flex flex-col pt-1">
                {/* Header */}
                <div className="flex justify-between items-start mb-2 pointer-events-none">
                     <span className={`text-xs font-bold tracking-wider uppercase ${isDark ? 'text-gray-500' : 'text-stone-400'}`}>
                         {calendarView === 'month' ? 'October' : 'Week 43'}
                     </span>
                     <span className="text-xs text-red-500 font-semibold">Today 25</span>
                </div>

                {calendarView === 'month' ? (
                    // MONTH GRID VIEW
                    <div className="flex-1 grid grid-cols-7 grid-rows-5 gap-0.5 text-center">
                        {['S','M','T','W','T','F','S'].map(d => (
                            <div key={d} className="text-[9px] text-stone-400 font-semibold uppercase">{d}</div>
                        ))}
                        {Array.from({length: 31}).map((_, i) => {
                            const day = i + 1;
                            const events = frameItems.filter(item => item.payload?.day === day);
                            const count = events.length;
                            
                            return (
                                <div key={i} className="flex flex-col items-center justify-start h-full pt-1">
                                    <span className={`text-[10px] ${day === 25 ? 'text-red-500 font-bold' : isDark ? 'text-gray-400' : 'text-stone-600'}`}>{day}</span>
                                    {count > 0 && (
                                        <div className={`mt-0.5 w-3 h-3 rounded-[3px] flex items-center justify-center text-[7px] font-bold ${day === 25 ? 'bg-red-500 text-white' : isDark ? 'bg-gray-700 text-gray-300' : 'bg-stone-500/20 text-stone-700'}`}>
                                            {count}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    // WEEK COLUMN VIEW
                    <div className="flex-1 grid grid-cols-7 gap-1 h-full">
                        {['M','T','W','T','F','S','S'].map((d, i) => {
                             const currentDay = 21 + i;
                             const events = frameItems.filter(item => item.payload?.day === currentDay);
                             const isToday = currentDay === 25;

                             return (
                                 <div key={i} className={`flex flex-col items-center h-full rounded-lg ${isToday ? 'bg-blue-500/10' : ''}`}>
                                     <div className="text-[9px] text-stone-400 font-medium mb-1">{d}</div>
                                     <div className={`text-xs font-medium mb-1 ${isToday ? 'text-blue-500' : isDark ? 'text-gray-300' : 'text-stone-700'}`}>{currentDay}</div>
                                     
                                     {/* Event Blocks */}
                                     <div className="flex-1 w-full px-0.5 space-y-0.5 flex flex-col justify-end pb-1">
                                         {events.map((ev, idx) => (
                                             <div key={idx} className={`w-full h-auto aspect-square rounded-sm ${isToday ? 'bg-blue-500' : isDark ? 'bg-gray-600' : 'bg-stone-300'}`} />
                                         ))}
                                     </div>
                                 </div>
                             )
                        })}
                    </div>
                )}
            </div>
        );
    }

    // --- FINANCE WIDGET ---
    if (type === FrameType.FINANCE) {
        return (
             <div className="h-full flex flex-col pt-0">
                 <div className={`text-xs font-medium uppercase tracking-wide mb-1 opacity-70 ${isDark ? 'text-gray-500' : 'text-stone-400'}`}>Total Balance</div>
                 <div className={`text-2xl font-light mb-3 ${isDark ? 'text-gray-100' : 'text-stone-800'}`}>$3,420.50</div>
                 <div className="space-y-2 flex-1 overflow-hidden">
                     {frameItems.slice(0, 3).map(i => (
                         <div key={i.id} className={`flex justify-between items-center text-sm border-b pb-2 last:border-0 ${isDark ? 'border-white/10' : 'border-stone-500/10'}`}>
                             <div className="flex flex-col">
                                 <span className={`font-medium truncate max-w-[100px] ${isDark ? 'text-gray-300' : 'text-stone-700'}`}>{i.title}</span>
                                 <span className="text-[10px] text-stone-500">{i.payload?.date}</span>
                             </div>
                             <span className={i.payload?.amount > 0 ? "text-green-500 font-medium" : isDark ? "text-gray-300 font-medium" : "text-stone-900 font-medium"}>
                                {i.payload?.amount > 0 ? '+' : ''}{i.payload?.amount?.toFixed(2)}
                             </span>
                         </div>
                     ))}
                 </div>
             </div>
        );
    }

    // --- GENERIC ---
    return (
      <div className="h-full flex flex-col justify-between">
        <div className={`text-3xl font-light ${isDark ? 'text-gray-200' : 'text-stone-800'}`}>
           {count > 0 ? count : ''}
        </div>
        <div className={`text-sm line-clamp-2 leading-relaxed font-medium ${isDark ? 'text-gray-400' : 'text-stone-500'}`}>
          {latest ? latest.title : "Empty"}
        </div>
      </div>
    );
  };

  const pages = [
    {
      id: 'page1',
      frames: [
        { type: FrameType.TODAY, title: 'Today', icon: <Sun size={18} />, span: 'col-span-2 row-span-1' },
        { type: FrameType.CALENDAR, title: '', icon: <CalendarIcon size={18} />, span: 'col-span-2 row-span-2' }, 
        { type: FrameType.REMINDER, title: 'Reminders', icon: <CheckSquare size={18} />, span: 'col-span-2 row-span-1' },
      ]
    },
    {
      id: 'page2',
      frames: [
        { type: FrameType.NOTE, title: 'Notes', icon: <StickyNote size={18} />, span: 'col-span-2 row-span-1' },
        { type: FrameType.GALLERY, title: 'Gallery', icon: <ImageIcon size={18} />, span: 'col-span-2 row-span-2' }, 
      ]
    },
    {
      id: 'page3',
      frames: [
        { type: FrameType.FINANCE, title: 'Finance', icon: <Banknote size={18} />, span: 'col-span-2 row-span-2' }, 
        { type: FrameType.KEY, title: 'Key', icon: <Key size={18} />, span: 'col-span-2 row-span-1' },
      ]
    }
  ];

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden flex"
      style={{ background: 'transparent' }}
    >
      <motion.div 
        className="flex w-full h-full"
        animate={{ 
          x: viewMode === ViewMode.SINGLE ? 0 : `calc(-${pageIndex * 100}% + ${dragX}px)`,
          flexDirection: viewMode === ViewMode.SINGLE ? 'column' : 'row'
        }}
        transition={{ type: "spring", stiffness: 300, damping: 35 }}
      >
        {viewMode === ViewMode.SINGLE ? (
            <div className="w-full min-h-full overflow-y-auto p-5 space-y-6 pt-14 pb-32 no-scrollbar">
                {pages.flatMap(p => p.frames).map((frame, i) => (
                    <GlassFrame 
                        key={frame.type} 
                        className="min-h-[160px] w-full"
                        title={frame.title}
                        icon={frame.icon}
                        theme={theme}
                        onClick={() => onFrameTap(frame.type)}
                        onIconClick={() => {
                            if (frame.type === FrameType.CALENDAR) {
                                setCalendarView(prev => prev === 'month' ? 'week' : 'month');
                            }
                            // Add other toggles here if needed
                        }}
                        onLongPress={() => onFrameLongPress(frame.type)}
                    >
                         {renderFrameContent(frame.type)}
                    </GlassFrame>
                ))}
            </div>
        ) : (
            pages.map((page, i) => (
                <div key={page.id} className="min-w-full h-full p-5 pt-14 grid grid-cols-2 grid-rows-4 gap-3">
                     {page.frames.map((frame) => (
                         <GlassFrame 
                            key={frame.type} 
                            className={`${frame.span}`}
                            title={frame.title}
                            icon={frame.icon}
                            theme={theme}
                            onClick={() => onFrameTap(frame.type)}
                            onIconClick={() => {
                                if (frame.type === FrameType.CALENDAR) {
                                    setCalendarView(prev => prev === 'month' ? 'week' : 'month');
                                }
                            }}
                            onLongPress={() => onFrameLongPress(frame.type)}
                        >
                            {renderFrameContent(frame.type)}
                        </GlassFrame>
                     ))}
                </div>
            ))
        )}
      </motion.div>

      {/* Page Indicators */}
      {viewMode === ViewMode.PAGED && (
          <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-2">
              {pages.map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${i === pageIndex ? 'scale-110 ' + (isDark ? 'bg-gray-200' : 'bg-stone-800') : (isDark ? 'bg-gray-600' : 'bg-stone-400/50')}`} 
                  />
              ))}
          </div>
      )}
    </div>
  );
};