import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ViewMode, FrameType, DoornaItem } from '../types';
import { GlassFrame } from './GlassFrame';
import { Calendar, CheckSquare, Image as ImageIcon, Key, Banknote, StickyNote, Sun, MoreHorizontal, Lock, Wifi, CreditCard, Shield } from 'lucide-react';

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
  const [todayView, setTodayView] = useState<'list' | 'schedule'>('list');

  const getItemsFor = (type: FrameType) => items.filter(i => i.type === type);

  const renderFrameContent = (type: FrameType) => {
    const frameItems = getItemsFor(type);
    const count = frameItems.length;
    const latest = frameItems[frameItems.length - 1];

    // --- KEY FRAME (SECURE FROSTED GLASS) ---
    if (type === FrameType.KEY) {
        return (
            <div className="h-full flex flex-col relative overflow-hidden rounded-xl">
                {/* Content Container - We blur THIS content directly for a smoother look */}
                <div className="relative flex-1 flex flex-col justify-center">
                    {/* Background Pattern of "Sensitive Data" */}
                    <div className="space-y-4 opacity-40 filter blur-[5px] select-none scale-105 origin-center transform transition-all duration-500" aria-hidden="true">
                        {/* Generate some fake rows if empty or mix with real ones for the visual effect */}
                        {(frameItems.length > 0 ? frameItems : [1,2,3]).slice(0,4).map((item, idx) => {
                            const title = typeof item === 'object' ? item.title : ['Main Card', 'Netflix', 'WiFi'][idx] || 'Secure';
                            return (
                                <div key={idx} className={`flex items-center gap-3 px-1`}>
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-white/10' : 'bg-stone-500/10'}`}>
                                        <Key size={14} className="opacity-50" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className={`h-2 w-20 rounded-full ${isDark ? 'bg-white/20' : 'bg-stone-500/20'}`} />
                                        <div className={`h-1.5 w-12 rounded-full ${isDark ? 'bg-white/10' : 'bg-stone-500/10'}`} />
                                    </div>
                                    <div className={`text-xs font-bold tracking-widest opacity-30 ${isDark ? 'text-white' : 'text-black'}`}>••••••</div>
                                </div>
                            )
                        })}
                    </div>

                    {/* The "Frosted Privacy" Overlay */}
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
                        <div className={`
                            relative w-14 h-14 rounded-full flex items-center justify-center 
                            backdrop-blur-md shadow-2xl transition-transform duration-300 group-active:scale-95
                            ${isDark 
                                ? 'bg-gradient-to-br from-white/10 to-white/5 border border-white/10 text-white' 
                                : 'bg-gradient-to-br from-white/60 to-white/30 border border-white/40 text-stone-600'}
                        `}>
                            <Lock size={22} strokeWidth={2} />
                            {/* Subtle shine on lock */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />
                        </div>
                        <span className={`mt-3 text-[9px] font-bold tracking-[0.25em] uppercase opacity-70 ${isDark ? 'text-white/60' : 'text-stone-600'}`}>
                            Locked
                        </span>
                    </div>
                </div>
            </div>
        )
    }

    // --- TODAY WIDGET ---
    if (type === FrameType.TODAY) {
        return (
            <div className="h-full flex flex-col">
                <div className="flex justify-between items-center mb-2">
                    <span className={`text-xs font-bold tracking-wider uppercase ${isDark ? 'text-gray-500' : 'text-stone-400'}`}>
                        {todayView === 'list' ? 'Priorities' : 'Timeline'}
                    </span>
                    <span className="text-xs text-orange-500 font-semibold">
                        {new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
                    </span>
                </div>

                {todayView === 'list' ? (
                    // LIST MODE
                    <div className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
                         {frameItems.map(i => (
                             <div key={i.id} className="flex items-center gap-3 p-1">
                                 {/* Darker checkbox border for transparent glass */}
                                 <div className={`w-4 h-4 rounded border ${i.status === 'done' ? 'bg-stone-300 border-stone-300' : 'border-stone-500/30'}`} />
                                 <div className={`text-sm ${i.status === 'done' ? 'text-stone-400 line-through' : isDark ? 'text-gray-200' : 'text-stone-700'}`}>
                                     {i.title}
                                 </div>
                                 <div className="ml-auto text-xs text-stone-400">{i.payload?.time}</div>
                             </div>
                         ))}
                         {frameItems.length === 0 && <div className="text-stone-400 text-sm italic mt-4">All clear today</div>}
                    </div>
                ) : (
                    // SCHEDULE MODE (24hr)
                    <div className="flex-1 relative overflow-y-auto no-scrollbar pt-2">
                        {/* Darker guideline for transparent glass */}
                        <div className={`absolute left-8 top-0 bottom-0 w-px ${isDark ? 'bg-gray-700' : 'bg-stone-500/20'}`} />
                        
                        {[7,8,9,10,11,12,13,14,15,16,17,18].map(hour => {
                            const event = frameItems.find(i => i.payload?.time && i.payload.time.startsWith(hour.toString().padStart(2,'0')));
                            
                            return (
                                <div key={hour} className="flex items-start mb-4 relative h-10">
                                    <div className="w-6 text-[10px] text-stone-400 text-right mr-3 pt-0.5">{hour}</div>
                                    
                                    {event ? (
                                        <div className={`flex-1 border-l-2 border-orange-400 p-1.5 rounded-r-md ${isDark ? 'bg-orange-900/20' : 'bg-orange-50/50'}`}>
                                            <div className={`text-xs font-medium leading-none ${isDark ? 'text-gray-200' : 'text-stone-800'}`}>{event.title}</div>
                                        </div>
                                    ) : (
                                        // Darker separator line
                                        <div className={`flex-1 border-t mt-2 ${isDark ? 'border-gray-800' : 'border-stone-500/10'}`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
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
             <div className="h-full flex flex-col pt-2">
                 <div className={`text-sm font-medium uppercase tracking-wide mb-1 ${isDark ? 'text-gray-500' : 'text-stone-400'}`}>Total Balance</div>
                 <div className={`text-3xl font-light mb-6 ${isDark ? 'text-gray-100' : 'text-stone-800'}`}>$3,420.50</div>
                 <div className="space-y-3 flex-1 overflow-hidden">
                     {frameItems.slice(0, 3).map(i => (
                         // Increased separator contrast
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
        { type: FrameType.CALENDAR, title: '', icon: null, span: 'col-span-2 row-span-2' }, 
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
            <div className="w-full min-h-full overflow-y-auto p-6 space-y-6 pt-14 pb-32 no-scrollbar">
                {pages.flatMap(p => p.frames).map((frame, i) => (
                    <GlassFrame 
                        key={frame.type} 
                        className="min-h-[160px] w-full"
                        title={frame.title}
                        icon={frame.icon}
                        theme={theme}
                        onClick={() => onFrameTap(frame.type)}
                        onLongPress={() => onFrameLongPress(frame.type)}
                    >
                         {renderFrameContent(frame.type)}
                    </GlassFrame>
                ))}
            </div>
        ) : (
            pages.map((page, i) => (
                <div key={page.id} className="min-w-full h-full p-6 pt-14 grid grid-cols-2 grid-rows-4 gap-4">
                     {page.frames.map((frame) => (
                         <GlassFrame 
                            key={frame.type} 
                            className={`${frame.span}`}
                            title={frame.title}
                            icon={frame.icon}
                            theme={theme}
                            onClick={() => {
                                if (frame.type === FrameType.CALENDAR) {
                                    setCalendarView(prev => prev === 'month' ? 'week' : 'month');
                                } else if (frame.type === FrameType.TODAY) {
                                    setTodayView(prev => prev === 'list' ? 'schedule' : 'list');
                                } else {
                                    onFrameTap(frame.type);
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