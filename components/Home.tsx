import React, { useRef, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ViewMode, FrameType, DoornaItem } from '../types';
import { GlassFrame } from './GlassFrame';
import { LongPressable } from './LongPressable';
import { Calendar as CalendarIcon, CheckSquare, Key, Banknote, StickyNote, Sun, Lock, Settings, Crown, Folder, MapPin, User, Shield, Info, ChevronRight, LogOut, FileText, Image as ImageIcon } from 'lucide-react';

interface HomeProps {
  viewMode: ViewMode;
  pageIndex: number;
  items: DoornaItem[];
  onFrameTap: (type: FrameType) => void;
  onFolderTap: (genre: string) => void;
  onItemLongPress: (item: DoornaItem) => void;
  onPageChange: (index: number) => void;
  dragX: number;
  theme: 'light' | 'dark';
}

export const Home: React.FC<HomeProps> = ({ 
  viewMode, 
  pageIndex, 
  items, 
  onFrameTap, 
  onFolderTap,
  onItemLongPress, 
  dragX, 
  theme
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDark = theme === 'dark';
  
  // Widget Specific States
  const [calendarView, setCalendarView] = useState<'month' | 'week'>('month');
  const [todayView, setTodayView] = useState<'schedule' | 'task'>('schedule');

  const getItemsFor = (type: FrameType) => items.filter(i => i.type === type);

  // --- ACCOUNT PAGE COMPONENT (Frameless & Polished) ---
  const AccountPage = () => {
    const menuGroups = [
        [
            { icon: <User size={18} />, label: 'Personal Information', sub: 'Name, Email, Phone' },
            { icon: <Shield size={18} />, label: 'Login & Security', sub: 'FaceID, Password' },
        ],
        [
            { icon: <Crown size={18} />, label: 'Subscription Plan', sub: 'Doorna Pro (Active)', highlight: true },
            { icon: <Banknote size={18} />, label: 'Payment Methods', sub: 'Apple Pay' },
        ],
        [
             { icon: <Info size={18} />, label: 'About Doorna', sub: 'v1.0.2 Beta' },
        ]
    ];

    return (
        <div className="w-full h-full flex flex-col pt-8 px-4 overflow-y-auto no-scrollbar touch-pan-y">
            {/* Header Profile */}
            <div className="flex flex-col items-center mb-10">
                 <div className="relative mb-5 transform transition-transform active:scale-95">
                     <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl shadow-2xl border-4 ${isDark ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-white/10' : 'bg-gradient-to-br from-indigo-100 to-white text-indigo-600 border-white'}`}>
                         J
                     </div>
                 </div>
                 <h2 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-stone-900'}`}>John Doe</h2>
                 <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-stone-400'}`}>john@doorna.app</p>
            </div>
            
            {/* Menu Groups */}
            <div className="space-y-6 w-full max-w-sm mx-auto pb-12">
                 {menuGroups.map((group, gIdx) => (
                     <div key={gIdx} className={`rounded-3xl overflow-hidden ${isDark ? 'bg-white/5' : 'bg-white/60 shadow-sm'}`}>
                         {group.map((item, i) => (
                             <div 
                                key={i} 
                                className={`
                                    flex items-center gap-4 p-4 cursor-pointer transition-colors
                                    ${isDark ? 'hover:bg-white/5 active:bg-white/10' : 'hover:bg-white/50 active:bg-white/80'}
                                    ${i !== group.length - 1 ? (isDark ? 'border-b border-white/5' : 'border-b border-stone-100') : ''}
                                `}
                            >
                                 <div className={`w-9 h-9 rounded-full flex items-center justify-center ${item.highlight ? 'bg-yellow-400 text-black' : (isDark ? 'bg-white/10 text-white' : 'bg-stone-100 text-stone-600')}`}>
                                     {item.icon}
                                 </div>
                                 <div className="flex-1 min-w-0">
                                     <div className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-stone-800'}`}>{item.label}</div>
                                     <div className={`text-[11px] truncate ${isDark ? 'text-white/40' : 'text-stone-500'}`}>{item.sub}</div>
                                 </div>
                                 <ChevronRight size={16} className={`opacity-20 ${isDark ? 'text-white' : 'text-black'}`} />
                             </div>
                         ))}
                     </div>
                 ))}

                 <button className={`w-full py-4 rounded-3xl text-sm font-semibold transition-transform active:scale-95 ${isDark ? 'bg-red-500/10 text-red-400' : 'bg-white text-red-500 shadow-sm'}`}>
                    Sign Out
                 </button>
                 
                 <div className={`text-center text-[10px] font-medium opacity-30 ${isDark ? 'text-white' : 'text-black'}`}>
                     Doorna Inc. • Build 2024.10
                 </div>
            </div>
        </div>
    );
  };

  const renderFrameContent = (type: FrameType) => {
    const frameItems = getItemsFor(type);
    const count = frameItems.length;
    const latest = frameItems[frameItems.length - 1];

    // --- KEY FRAME ---
    if (type === FrameType.KEY) {
        return (
            <div className="h-full flex flex-col relative overflow-hidden">
                <div 
                    className="flex-1 flex flex-col gap-3 opacity-50 filter blur-[4px] select-none transition-all duration-500 pt-1" 
                    style={{ maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)' }}
                >
                    {[1, 2, 3].map((_, i) => (
                        <div key={i} className="flex items-center justify-between px-1">
                             <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-white/10' : 'bg-stone-500/10'}`}>
                                    <Key size={14} className="opacity-50" />
                                </div>
                                <div className="space-y-1.5">
                                    <div className={`h-2 w-24 rounded-full ${isDark ? 'bg-white/10' : 'bg-black/5'}`} />
                                    <div className={`h-1.5 w-12 rounded-full ${isDark ? 'bg-white/5' : 'bg-black/5'}`} />
                                </div>
                             </div>
                        </div>
                    ))}
                </div>
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 pb-6">
                     <motion.div 
                        whileTap={{ scale: 0.95 }}
                        className={`
                            relative w-14 h-14 rounded-[22px] flex items-center justify-center
                            backdrop-blur-xl shadow-xl border
                            transition-all duration-300 group-active:scale-95
                            ${isDark 
                                ? 'bg-gradient-to-br from-white/10 to-white/5 border-white/20 text-white shadow-black/40' 
                                : 'bg-gradient-to-br from-white/80 to-white/40 border-white/60 text-stone-600 shadow-stone-300/40'}
                        `}
                    >
                        <Lock size={20} strokeWidth={2.5} />
                    </motion.div>
                    <div className="flex flex-col items-center">
                        <div className={`text-[10px] font-bold tracking-[0.2em] uppercase ${isDark ? 'text-white/90' : 'text-stone-600'}`}>
                            Locked
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // --- TODAY WIDGET ---
    if (type === FrameType.TODAY) {
        return (
            <div className="h-full flex flex-col overflow-hidden -mt-1">
                <div className="flex justify-between items-center mb-3 flex-shrink-0">
                    <span className={`text-[10px] font-bold tracking-wider uppercase opacity-60 ${isDark ? 'text-white' : 'text-black'}`}>
                        {todayView === 'schedule' ? 'Up Next' : 'Tasks'}
                    </span>
                    <span className="text-[10px] text-orange-500 font-bold tracking-wide">
                        Today
                    </span>
                </div>

                <div 
                    className="flex-1 min-h-0 w-full overflow-y-auto no-scrollbar pb-2 touch-pan-y"
                    style={{
                        maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)'
                    }}
                >
                     <div className="flex flex-col gap-3">
                        {frameItems.map(i => (
                            <LongPressable 
                                key={i.id} 
                                onLongPress={() => onItemLongPress(i)}
                                onClick={() => onFrameTap(type)}
                            >
                                <div className="flex flex-col gap-0.5">
                                    <div className="flex justify-between items-baseline">
                                        <div className={`text-xs font-semibold leading-tight truncate pr-2 ${i.status === 'done' ? 'text-stone-400 line-through decoration-stone-400/50' : isDark ? 'text-gray-100' : 'text-stone-800'}`}>
                                            {i.title}
                                        </div>
                                        <div className={`text-[10px] font-medium whitespace-nowrap flex-shrink-0 ${isDark ? 'text-orange-400/80' : 'text-orange-600/80'}`}>{i.payload?.time}</div>
                                    </div>
                                    {i.payload?.location && (
                                        <div className={`text-[9px] truncate opacity-60 flex items-center gap-1 ${isDark ? 'text-gray-300' : 'text-stone-600'}`}>
                                            <MapPin size={8} /> {i.payload.location}
                                        </div>
                                    )}
                                </div>
                            </LongPressable>
                        ))}
                     </div>
                     {frameItems.length === 0 && <div className="text-stone-400 text-xs italic mt-2 opacity-50">Nothing for today</div>}
                </div>
            </div>
        )
    }

    // --- CALENDAR WIDGET ---
    if (type === FrameType.CALENDAR) {
        return (
            <div className="h-full flex flex-col pt-1">
                <div className="flex justify-between items-start mb-2 pointer-events-none">
                     <span className={`text-[10px] font-bold tracking-wider uppercase opacity-60 ${isDark ? 'text-white' : 'text-black'}`}>
                         {calendarView === 'month' ? 'October' : 'W43'}
                     </span>
                </div>

                {calendarView === 'month' ? (
                    <div className="flex-1 grid grid-cols-7 grid-rows-5 gap-0.5 text-center items-center">
                        {['S','M','T','W','T','F','S'].map(d => (
                            <div key={d} className={`text-[8px] font-bold uppercase opacity-40 ${isDark ? 'text-white' : 'text-black'}`}>{d}</div>
                        ))}
                        {Array.from({length: 31}).map((_, i) => {
                            const day = i + 1;
                            const events = frameItems.filter(item => item.payload?.day === day);
                            const count = events.length;
                            const isToday = day === 25;
                            return (
                                <div key={i} className="flex flex-col items-center justify-center h-full relative">
                                    <span className={`
                                        w-5 h-5 flex items-center justify-center text-[10px] rounded-full z-10
                                        ${isToday 
                                            ? 'bg-red-500 text-white font-bold shadow-sm' 
                                            : (isDark ? 'text-gray-400' : 'text-stone-600 font-medium')}
                                    `}>
                                        {day}
                                    </span>
                                    {count > 0 && !isToday && (
                                        <div className={`absolute bottom-0.5 w-0.5 h-0.5 rounded-full ${isDark ? 'bg-white/50' : 'bg-stone-800/40'}`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex-1 grid grid-cols-7 gap-1 h-full">
                        {['M','T','W','T','F','S','S'].map((d, i) => {
                             const currentDay = 21 + i;
                             const events = frameItems.filter(item => item.payload?.day === currentDay);
                             const isToday = currentDay === 25;
                             return (
                                 <div key={i} className={`flex flex-col items-center h-full rounded-full py-1 ${isToday ? (isDark ? 'bg-white/10' : 'bg-black/5') : ''}`}>
                                     <div className={`text-[8px] font-bold opacity-40 mb-1 ${isDark ? 'text-white' : 'text-black'}`}>{d}</div>
                                     <div className={`text-[10px] font-medium mb-1 ${isToday ? (isDark ? 'text-white' : 'text-black') : (isDark ? 'text-gray-500' : 'text-stone-400')}`}>{currentDay}</div>
                                     <div className="flex flex-col gap-0.5 mt-auto pb-1">
                                         {events.map((ev, idx) => (
                                             <div key={idx} className={`w-1 h-1 rounded-full ${isToday ? 'bg-red-500' : isDark ? 'bg-white/30' : 'bg-black/20'}`} />
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

    // --- REMINDER WIDGET ---
    if (type === FrameType.REMINDER) {
        return (
             <div className="h-full flex flex-col pt-0">
                 <div className={`text-[10px] font-bold uppercase tracking-wider mb-2 opacity-60 ${isDark ? 'text-white' : 'text-black'}`}>Upcoming</div>
                 <div className="space-y-2 flex-1 overflow-y-auto no-scrollbar touch-pan-y" style={{ maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)' }}>
                     {frameItems.length === 0 ? (
                        <div className="text-[10px] opacity-40 italic">No reminders</div>
                     ) : (
                        frameItems.map(i => (
                            <LongPressable key={i.id} onLongPress={() => onItemLongPress(i)} onClick={() => onFrameTap(type)}>
                                <div className="flex items-start gap-2">
                                    <div className={`w-3 h-3 rounded border mt-0.5 flex-shrink-0 ${isDark ? 'border-white/30' : 'border-black/30'}`} />
                                    <div className="flex-1">
                                        <div className={`text-[11px] leading-tight font-medium ${isDark ? 'text-gray-200' : 'text-stone-700'}`}>{i.title}</div>
                                        {i.payload?.due && <div className={`text-[9px] opacity-50 ${isDark ? 'text-gray-400' : 'text-stone-500'}`}>{i.payload.due}</div>}
                                    </div>
                                </div>
                            </LongPressable>
                        ))
                     )}
                 </div>
             </div>
        )
    }

    // --- NOTE FRAME (APP LIBRARY MODE) ---
    if (type === FrameType.NOTE) {
        // Group items by genre
        const folders = useMemo(() => {
            const groups: Record<string, DoornaItem[]> = {};
            frameItems.forEach(item => {
                const g = item.genre || 'General';
                if (!groups[g]) groups[g] = [];
                groups[g].push(item);
            });
            return groups;
        }, [frameItems]);

        return (
            <div className="h-full flex flex-col pt-4 px-2">
                 {/* Custom Header */}
                <div className={`flex justify-between items-end mb-4`}>
                     <div>
                        <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 opacity-50 ${isDark ? 'text-white' : 'text-black'}`}>App Library</div>
                        <div className={`text-3xl font-light leading-none tracking-tight ${isDark ? 'text-white' : 'text-stone-800'}`}>Notes</div>
                     </div>
                     <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${isDark ? 'border-white/20 text-white/60' : 'border-black/10 text-stone-500'}`}>
                         {Object.keys(folders).length} FOLDERS
                     </div>
                </div>
                
                {/* Grid of "App Folders" - 2 COLUMNS */}
                <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-6 content-start px-1 overflow-y-auto no-scrollbar touch-pan-y">
                    {Object.entries(folders).map(([genre, items]) => (
                        <div key={genre} className="flex flex-col items-center gap-2 group cursor-pointer" onClick={() => onFolderTap(genre)}>
                            {/* App Icon Container - 2x2 Grid Inside */}
                            <div className={`
                                w-full aspect-square rounded-[24%] p-2.5
                                grid grid-cols-2 gap-1.5 overflow-hidden transition-transform duration-300 active:scale-95
                                ${isDark 
                                    ? 'bg-white/10 border border-white/5 backdrop-blur-md' 
                                    : 'bg-white/40 border border-white/40 shadow-sm backdrop-blur-md'}
                            `}>
                                {(items as DoornaItem[]).slice(0, 4).map((item, i) => (
                                    <div key={item.id} className={`rounded-[6px] relative overflow-hidden w-full h-full ${isDark ? 'bg-white/10' : 'bg-white shadow-sm'}`}>
                                        {item.payload?.image ? (
                                            <img src={item.payload.image} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center gap-[2px] p-1">
                                                {/* Mini Text Document Representation */}
                                                <div className={`w-3/4 h-[2px] rounded-full ${isDark ? 'bg-white/40' : 'bg-black/20'}`} />
                                                <div className={`w-1/2 h-[2px] rounded-full ${isDark ? 'bg-white/20' : 'bg-black/10'}`} />
                                                <div className={`w-2/3 h-[2px] rounded-full ${isDark ? 'bg-white/20' : 'bg-black/10'}`} />
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {/* Fill remaining slots if < 4 */}
                                {(items as DoornaItem[]).length < 4 && Array.from({length: 4 - (items as DoornaItem[]).length}).map((_, i) => (
                                    <div key={`empty-${i}`} className="w-full h-full" />
                                ))}
                            </div>
                            
                            {/* App Label */}
                            <span className={`text-xs font-medium tracking-tight text-center leading-none ${isDark ? 'text-gray-300' : 'text-stone-600'}`}>
                                {genre}
                            </span>
                        </div>
                    ))}
                    
                    {/* Add Folder Placeholder */}
                     <div className="flex flex-col items-center gap-2 opacity-40">
                        <div className={`w-full aspect-square rounded-[24%] flex items-center justify-center border-2 border-dashed ${isDark ? 'border-white/20' : 'border-stone-300'}`}>
                            <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center">
                                <div className="w-0.5 h-3 bg-current absolute" />
                                <div className="h-0.5 w-3 bg-current absolute" />
                            </div>
                        </div>
                        <span className={`text-xs font-medium ${isDark ? 'text-white' : 'text-black'}`}>New</span>
                     </div>
                </div>
            </div>
        );
    }

    // --- FINANCE FRAME ---
    if (type === FrameType.FINANCE) {
        return (
             <div className="h-full flex flex-col pt-0 relative overflow-hidden">
                 {/* Decorative Sparkline Background */}
                 <div className="absolute right-0 top-8 opacity-10 pointer-events-none">
                    <svg width="120" height="40" viewBox="0 0 120 40">
                         <path d="M0 35 C 20 35, 30 10, 50 20 C 70 30, 90 5, 120 15" fill="none" stroke="currentColor" strokeWidth="3" />
                    </svg>
                 </div>

                 <div className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 opacity-60 ${isDark ? 'text-white' : 'text-black'}`}>Total Balance</div>
                 <div className={`text-2xl font-medium mb-5 tracking-tight flex items-baseline gap-1 ${isDark ? 'text-white' : 'text-stone-900'}`}>
                    $3,420<span className="text-lg opacity-50 font-normal">.50</span>
                 </div>
                 
                 <div className="space-y-3 flex-1 overflow-hidden z-10">
                     {frameItems.slice(0, 3).map(i => (
                         <LongPressable 
                            key={i.id} 
                            onLongPress={() => onItemLongPress(i)}
                            onClick={() => onFrameTap(type)}
                         >
                            <div className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] ${isDark ? 'bg-white/10 text-white' : 'bg-stone-100 text-stone-600'}`}>
                                        {i.title.charAt(0)}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`text-[11px] font-medium truncate max-w-[100px] ${isDark ? 'text-gray-200' : 'text-stone-700'}`}>{i.title}</span>
                                        <span className={`text-[9px] ${isDark ? 'text-gray-500' : 'text-stone-400'}`}>{i.payload?.date}</span>
                                    </div>
                                </div>
                                <span className={`text-[11px] font-bold ${i.payload?.amount > 0 ? "text-green-500" : isDark ? "text-white" : "text-stone-900"}`}>
                                    {i.payload?.amount > 0 ? '+' : ''}{Math.abs(i.payload?.amount).toFixed(2)}
                                </span>
                            </div>
                         </LongPressable>
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
        <div className={`text-sm line-clamp-2 leading-relaxed font-medium opacity-80 ${isDark ? 'text-gray-400' : 'text-stone-600'}`}>
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
        { type: FrameType.FINANCE, title: 'Finance', icon: <Banknote size={18} />, span: 'col-span-2 row-span-2' }, 
        { type: FrameType.KEY, title: 'Key', icon: <Key size={18} />, span: 'col-span-2 row-span-1' },
      ]
    },
    {
      id: 'page3',
      frames: [
        // Note takes up full page (4 rows).
        { type: FrameType.NOTE, title: '', icon: undefined, span: 'col-span-2 row-span-4' },
      ]
    },
    {
      id: 'page4', // Special Account Page ID
      frames: [] // Frames ignored for special page 4
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
            <div className="w-full min-h-full overflow-y-auto p-5 space-y-4 pt-14 pb-32 no-scrollbar touch-pan-y">
                {pages.flatMap(p => p.frames).map((frame, i) => (
                    <GlassFrame 
                        key={frame.type + i} 
                        className="min-h-[160px] w-full"
                        title={frame.title}
                        icon={frame.icon}
                        theme={theme}
                        onClick={() => onFrameTap(frame.type)}
                        onIconClick={() => {
                            if (frame.type === FrameType.CALENDAR) {
                                setCalendarView(prev => prev === 'month' ? 'week' : 'month');
                            } else if (frame.type === FrameType.TODAY) {
                                setTodayView(prev => prev === 'schedule' ? 'task' : 'schedule');
                            }
                        }}
                    >
                         {renderFrameContent(frame.type)}
                    </GlassFrame>
                ))}
            </div>
        ) : (
            pages.map((page, i) => (
                <div key={page.id} className="min-w-full h-full p-5 pt-14">
                     {/* SPECIAL RENDER FOR PAGE 4 (SETTINGS) */}
                     {page.id === 'page4' ? (
                        <AccountPage />
                     ) : (
                        <div className="grid grid-cols-2 grid-rows-4 gap-3 h-full">
                            {page.frames.map((frame, idx) => (
                                <GlassFrame 
                                    key={frame.type + idx} 
                                    className={`${frame.span}`}
                                    title={frame.title}
                                    icon={frame.icon}
                                    theme={theme}
                                    onClick={() => onFrameTap(frame.type)}
                                >
                                    {renderFrameContent(frame.type)}
                                </GlassFrame>
                            ))}
                        </div>
                     )}
                </div>
            ))
        )}
      </motion.div>

      {/* Page Indicators */}
      {viewMode === ViewMode.PAGED && (
          <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-2.5 z-30 pointer-events-none">
              {pages.map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === pageIndex ? 'scale-125 ' + (isDark ? 'bg-white' : 'bg-stone-800') : (isDark ? 'bg-white/20' : 'bg-black/10')}`} 
                  />
              ))}
          </div>
      )}
    </div>
  );
};