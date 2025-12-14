import React from 'react';
import { motion } from 'framer-motion';
import { X, User, CreditCard, Info, Shield, LogOut, ChevronRight, Crown } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface SettingsProps {
  onClose: () => void;
  theme: 'light' | 'dark';
}

export const Settings: React.FC<SettingsProps> = ({ onClose, theme }) => {
  const isDark = theme === 'dark';

  const menuItems = [
    { icon: <User size={18} />, label: 'Account', sub: 'Personal Info, Email' },
    { icon: <CreditCard size={18} />, label: 'Subscription', sub: 'Pro Plan Active' },
    { icon: <Shield size={18} />, label: 'Privacy & Security', sub: 'Biometrics, Data' },
    { icon: <Info size={18} />, label: 'About Doorna', sub: 'Version 1.0 (Beta)' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", duration: 0.4 }}
      className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
    >
      <GlassCard 
        radius={36} 
        theme={theme}
        blur={60}
        opacity={isDark ? 0.98 : 0.95}
        className="w-full max-w-[380px] h-[80vh] flex flex-col overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="relative px-6 py-8 flex flex-col items-center border-b border-dashed border-opacity-10 border-gray-400">
             <button 
                onClick={onClose}
                className={`absolute top-6 right-6 p-2 rounded-full ${isDark ? 'hover:bg-white/10 text-white/50' : 'hover:bg-black/5 text-black/50'}`}
             >
                 <X size={20} />
             </button>

             {/* Avatar */}
             <div className="relative mb-4">
                 <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl shadow-xl ${isDark ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white' : 'bg-gradient-to-br from-indigo-100 to-white text-indigo-600'}`}>
                     J
                 </div>
                 <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-transparent shadow-sm flex items-center gap-1">
                     <Crown size={10} fill="black" /> PRO
                 </div>
             </div>
             
             <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>John Doe</h2>
             <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>john@doorna.app</p>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {menuItems.map((item, i) => (
                <button 
                    key={i}
                    className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all active:scale-[0.98] ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-white hover:bg-gray-50 border border-gray-100 shadow-sm'}`}
                >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-600'}`}>
                        {item.icon}
                    </div>
                    <div className="flex-1 text-left">
                        <div className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.label}</div>
                        <div className={`text-[11px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{item.sub}</div>
                    </div>
                    <ChevronRight size={16} className={`opacity-30 ${isDark ? 'text-white' : 'text-black'}`} />
                </button>
            ))}
            
            <button className={`w-full p-4 rounded-2xl flex items-center gap-4 mt-8 ${isDark ? 'text-red-400 hover:bg-red-500/10' : 'text-red-500 hover:bg-red-50'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-red-500/10' : 'bg-red-50'}`}>
                    <LogOut size={18} />
                </div>
                <span className="font-semibold text-sm">Sign Out</span>
            </button>
        </div>

        <div className={`p-6 text-center text-[10px] opacity-40 font-mono ${isDark ? 'text-white' : 'text-black'}`}>
            Doorna v1.0.2 (Build 420)
        </div>

      </GlassCard>
    </motion.div>
  );
};