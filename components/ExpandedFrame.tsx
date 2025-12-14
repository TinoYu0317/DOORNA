import React, { useState, useMemo, useEffect } from 'react';
import { motion, useDragControls, PanInfo, AnimatePresence } from 'framer-motion';
import { FrameType, DoornaItem } from '../types';
import { X, ChevronLeft, ChevronRight, User, Shield, Info, LogOut, ChevronRight as ChevronRightIcon, Crown, Search, FolderOpen, ArrowLeft, FileText, Image as ImageIcon } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { LongPressable } from './LongPressable';

interface ExpandedFrameProps {
  type: FrameType;
  items: DoornaItem[];
  initialGenre?: string | null;
  onClose: () => void;
  onItemLongPress: (item: DoornaItem) => void;
  theme: 'light' | 'dark';
}

export const ExpandedFrame: React.FC<ExpandedFrameProps> = ({ type, items, initialGenre, onClose, onItemLongPress, theme }) => {
  const [calView, setCalView] = useState<'month' | 'week'>('month');
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Note Folder State
  const [openFolder, setOpenFolder] = useState<string | null>(initialGenre || null);

  useEffect(() => {
    if (initialGenre) setOpenFolder(initialGenre);
  }, [initialGenre]);

  const isDark = theme === 'dark';
  const controls = useDragControls();

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onClose();
    }
  };

  // Filter Logic
  const filteredItems = useMemo(() => {
      let base = items.filter(i => i.type === type);
      if (searchQuery) {
          const q = searchQuery.toLowerCase();
          base = base.filter(i => 
            i.title.toLowerCase().includes(q) || 
            i.rawText.toLowerCase().includes(q) ||
            i.genre?.toLowerCase().includes(q)
          );
      }
      return base;
  }, [items, type, searchQuery]);

  // Grouping Logic for Notes
  const noteFolders = useMemo(() => {
      if (type !== FrameType.NOTE) return {} as Record<string, DoornaItem[]>;
      const groups: Record<string, DoornaItem[]> = {};
      filteredItems.forEach(item => {
          const genre = item.genre || 'General';
          if (!groups[genre]) groups[genre] = [];
          groups[genre].push(item);
      });
      return groups;
  }, [filteredItems, type]);

  const settingsMenuItems = [
    { icon: <User size={18} />, label: 'Account', sub: 'Personal Info, Email' },
    { icon: <Shield size={18} />, label: 'Privacy & Security', sub: 'Biometrics, Data' },
    { icon: <Info size={18} />, label: 'About Doorna', sub: 'Version 1.0 (Beta)' },
  ];

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0, bottom: 0.2 }}
      onDragEnd={handleDragEnd}
      className="absolute inset-0 z-40 flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.3)]"
    >
      <GlassCard 
        radius={0} 
        theme={theme}
        blur={80} 
        opacity={isDark ? 0.96 : 0.94}
        className="w-full h-full flex flex-col"
        style={{ 
            borderTopLeftRadius: 32, 
            borderTopRightRadius: 32,
            backgroundColor: isDark ? 'rgba(10,10,12,0.95)' : 'rgba(255,255,255,0.92)'
        }}
      >
        {/* Drag Handle */}
        <div className="w-full flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing">
            <div className={`w-12 h-1.5 rounded-full ${isDark ? 'bg-white/20' : 'bg-gray-300'}`} />
        </div>

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 shrink-0 h-16">
            {isSearching ? (
                 <div className="flex-1 flex items-center gap-2">
                     <div className={`flex-1 h-10 rounded-xl flex items-center px-3 gap-2 ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>
                         <Search size={16} className="opacity-50" />
                         <input 
                            autoFocus
                            placeholder={`Ask ${type === FrameType.FINANCE ? 'Finance' : 'Doorna'}...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 bg-transparent border-none outline-none text-sm"
                         />
                     </div>
                     <button onClick={() => { setIsSearching(false); setSearchQuery(''); }} className="text-sm font-medium opacity-60">Cancel</button>
                 </div>
            ) : openFolder ? (
                 <div className="flex items-center gap-2">
                     <button onClick={() => setOpenFolder(null)} className={`p-1 rounded-full ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                         <ArrowLeft size={20} />
                     </button>
                     <h2 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{openFolder}</h2>
                 </div>
            ) : (
                <>
                    <h2 className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {type === FrameType.SETTINGS ? 'Settings' : type}
                    </h2>
                    <div className="flex items-center gap-2">
                        {(type === FrameType.NOTE || type === FrameType.FINANCE) && (
                            <button 
                                onClick={() => setIsSearching(true)}
                                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${isDark ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                <Search size={18} />
                            </button>
                        )}
                        <button 
                            onClick={onClose}
                            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            <X size={20} />
                        </button>
                    </div>
                </>
            )}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-12 touch-pan-y">
            
            {/* NOTE: FOLDER LIST VIEW (If no specific folder open) */}
            {type === FrameType.NOTE && !openFolder && (
                <div className="grid grid-cols-2 gap-4">
                     {Object.entries(noteFolders).map(([genre, genreItems]) => (
                         <div key={genre} className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => setOpenFolder(genre)}>
                             {/* Folder Icon */}
                             <div className={`w-full aspect-square rounded-[24%] p-2.5 grid grid-cols-2 gap-1.5 ${isDark ? 'bg-white/10 border border-white/5' : 'bg-stone-200/50 backdrop-blur-sm'}`}>
                                 {(genreItems as DoornaItem[]).slice(0, 4).map((item, idx) => (
                                     <div key={item.id} className={`rounded-[6px] flex items-center justify-center relative overflow-hidden ${isDark ? 'bg-white/10' : 'bg-white shadow-sm'}`}>
                                         {item.payload?.image ? (
                                             <img src={item.payload.image} className="w-full h-full object-cover opacity-80" />
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
                                {(genreItems as DoornaItem[]).length < 4 && Array.from({length: 4 - (genreItems as DoornaItem[]).length}).map((_, i) => (
                                    <div key={`empty-${i}`} className="w-full h-full" />
                                ))}
                             </div>
                             <div className={`text-center text-[11px] font-medium leading-tight ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{genre}</div>
                         </div>
                     ))}
                </div>
            )}

            {/* NOTE: OPEN FOLDER (APP ICON GRID VIEW) - NOW 2 COLUMNS FOR LARGER ICONS */}
            {type === FrameType.NOTE && openFolder && (
                <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                    {(noteFolders[openFolder] || []).map(item => (
                        <LongPressable
                            key={item.id}
                            onLongPress={() => onItemLongPress(item)}
                            className="flex flex-col items-center gap-2 group"
                        >
                             {/* App-like Item Icon */}
                             <div className={`
                                w-full aspect-square rounded-[22%] relative overflow-hidden flex flex-col items-center justify-center
                                shadow-sm transition-transform active:scale-95 border
                                ${isDark 
                                    ? 'bg-gradient-to-br from-white/10 to-white/5 border-white/10' 
                                    : 'bg-white border-white/60'}
                             `}>
                                 {item.payload?.image ? (
                                     <>
                                        <img src={item.payload.image} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/20" />
                                     </>
                                 ) : (
                                     <div className={`flex flex-col items-center justify-center text-center p-3 h-full`}>
                                         <FileText size={32} className={`mb-1 opacity-50 ${isDark ? 'text-white' : 'text-stone-600'}`} />
                                         <span className={`text-[9px] font-bold uppercase tracking-widest opacity-40 ${isDark ? 'text-white' : 'text-stone-500'}`}>DOC</span>
                                     </div>
                                 )}
                             </div>

                             {/* App Title */}
                             <span className={`text-xs font-medium text-center leading-tight line-clamp-2 px-1 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                                 {item.title}
                             </span>
                        </LongPressable>
                    ))}
                    {(!noteFolders[openFolder] || noteFolders[openFolder].length === 0) && (
                        <div className="col-span-2 text-center opacity-50 py-10">Empty Folder</div>
                    )}
                </div>
            )}

            {/* OTHER TYPES: STANDARD LIST VIEW */}
            {type !== FrameType.NOTE && type !== FrameType.SETTINGS && (
                <>
                {/* FINANCE CHART */}
                {type === FrameType.FINANCE && !isSearching && (
                    <div className="mb-6">
                        <div className={`h-48 rounded-3xl p-6 mb-6 relative overflow-hidden flex flex-col justify-between shadow-sm ${isDark ? 'bg-white/5 border border-white/5' : 'bg-gradient-to-br from-indigo-50/50 to-purple-50/50 border border-white'}`}>
                            <div>
                                <div className={`text-xs font-bold uppercase tracking-widest opacity-60 ${isDark ? 'text-white' : 'text-indigo-900'}`}>Weekly Spend</div>
                                <div className={`text-3xl font-medium mt-1 ${isDark ? 'text-white' : 'text-indigo-900'}`}>$428<span className="opacity-50 text-2xl">.50</span></div>
                            </div>
                            <div className="flex items-end justify-between h-20 gap-3">
                                {[40, 65, 30, 85, 50, 90, 20].map((h, i) => (
                                    <div key={i} className="w-full rounded-full relative group">
                                        <div 
                                            className={`absolute bottom-0 left-0 right-0 rounded-full transition-all duration-500 ${isDark ? 'bg-white/20 group-hover:bg-white/40' : 'bg-indigo-500/80 group-hover:bg-indigo-600'}`} 
                                            style={{ height: `${h}%` }} 
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* CALENDAR VIEW */}
                {type === FrameType.CALENDAR && (
                    <div className="flex flex-col mb-6">
                        <div className={`flex p-1 rounded-xl w-full mb-6 ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
                            <button onClick={() => setCalView('month')} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${calView === 'month' ? (isDark ? 'bg-white/10 shadow-sm text-white' : 'bg-white shadow-sm text-gray-900') : (isDark ? 'text-gray-400' : 'text-gray-500')}`}>Month</button>
                            <button onClick={() => setCalView('week')} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${calView === 'week' ? (isDark ? 'bg-white/10 shadow-sm text-white' : 'bg-white shadow-sm text-gray-900') : (isDark ? 'text-gray-400' : 'text-gray-500')}`}>Week</button>
                        </div>
                        <div className={`border rounded-3xl p-6 shadow-sm mb-6 ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-white'}`}>
                            <div className="flex justify-between items-center mb-6">
                                <span className={`font-semibold text-lg ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>October 2024</span>
                                <div className="flex gap-2">
                                    <button className={`p-1 rounded-full ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}><ChevronLeft size={20} className={isDark ? 'text-gray-500' : 'text-gray-400'} /></button>
                                    <button className={`p-1 rounded-full ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}><ChevronRight size={20} className={isDark ? 'text-gray-500' : 'text-gray-400'} /></button>
                                </div>
                            </div>
                            {calView === 'month' ? (
                                <div className="grid grid-cols-7 gap-y-6 text-center text-sm">
                                    {['S','M','T','W','T','F','S'].map(d => <span key={d} className={`text-xs font-bold opacity-40 ${isDark ? 'text-white' : 'text-black'}`}>{d}</span>)}
                                    {Array.from({length: 31}).map((_, i) => (
                                        <span key={i} className={`h-8 w-8 flex items-center justify-center mx-auto rounded-full ${i === 24 ? 'bg-red-500 text-white font-bold' : (isDark ? 'text-gray-300' : 'text-gray-700')}`}>{i+1}</span>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {[21,22,23,24,25,26,27].map((d, i) => (
                                        <div key={d} className={`flex items-center gap-4 p-3 rounded-2xl ${d === 25 ? (isDark ? 'bg-blue-900/20' : 'bg-blue-50') : ''}`}>
                                            <div className="flex flex-col items-center w-10">
                                                <span className="text-xs font-bold opacity-40">{'MTWTFSS'[i]}</span>
                                                <span className="text-lg font-semibold">{d}</span>
                                            </div>
                                            <div className="flex-1 text-sm">{d === 25 ? 'Design Review' : 'No Events'}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* LIST ITEMS */}
                <div className="space-y-3">
                    {filteredItems.map(item => (
                        <LongPressable 
                            key={item.id} 
                            onLongPress={() => onItemLongPress(item)}
                            className={`p-4 rounded-2xl flex justify-between items-center transition-transform active:scale-[0.98] ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-white shadow-sm border border-black/5'}`}
                        >
                            <div className="flex items-center gap-4">
                                <div>
                                    <div className={`text-base font-semibold leading-tight ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{item.title}</div>
                                    <div className={`text-xs mt-1 font-medium ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                        {item.payload?.date || new Date(item.createdAt).toLocaleDateString()} 
                                    </div>
                                </div>
                            </div>
                            {type === FrameType.FINANCE && (
                                <div className="text-right">
                                    <span className={`block font-semibold ${item.payload?.amount > 0 ? "text-green-500" : (isDark ? "text-gray-200" : "text-gray-900")}`}>
                                            {item.payload?.amount > 0 ? '+' : ''}{item.payload?.amount?.toFixed(2)}
                                    </span>
                                </div>
                            )}
                        </LongPressable>
                    ))}
                </div>
                </>
            )}

            {/* SETTINGS VIEW */}
            {type === FrameType.SETTINGS && (
                <div className="flex flex-col h-full">
                     <div className="flex flex-col items-center mb-8 pt-4">
                        <div className="relative mb-4">
                            <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl shadow-xl ${isDark ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white' : 'bg-gradient-to-br from-indigo-100 to-white text-indigo-600'}`}>J</div>
                        </div>
                        <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>John Doe</h2>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>john@doorna.app</p>
                    </div>

                    <div className="space-y-3">
                        {settingsMenuItems.map((item, i) => (
                            <button key={i} className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all active:scale-[0.98] ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-white hover:bg-gray-50 border border-gray-100 shadow-sm'}`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-600'}`}>{item.icon}</div>
                                <div className="flex-1 text-left">
                                    <div className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.label}</div>
                                    <div className={`text-[11px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{item.sub}</div>
                                </div>
                                <ChevronRightIcon size={16} className={`opacity-30 ${isDark ? 'text-white' : 'text-black'}`} />
                            </button>
                        ))}
                        <button className={`w-full p-4 rounded-2xl flex items-center gap-4 mt-8 ${isDark ? 'text-red-400 hover:bg-red-500/10' : 'text-red-500 hover:bg-red-50'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-red-500/10' : 'bg-red-50'}`}><LogOut size={18} /></div>
                            <span className="font-semibold text-sm">Sign Out</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
      </GlassCard>
    </motion.div>
  );
};