import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';

interface GlassFrameProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  onLongPress?: () => void;
  title?: string;
  icon?: React.ReactNode;
  theme?: 'light' | 'dark';
  
  // Design Tokens (Passed to GlassCard)
  blurRadius?: number;
  tintOpacity?: number;
  cornerRadius?: number;
}

export const GlassFrame: React.FC<GlassFrameProps> = ({ 
  children, 
  className = '', 
  onClick, 
  onLongPress,
  title,
  icon,
  theme = 'light',
  blurRadius = 40,
  tintOpacity = 0.15,
  cornerRadius = 36, // Increased from 24 to 36 for "rounder" aesthetic
}) => {
  const startPos = useRef({ x: 0, y: 0 });
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const isLongPressValid = useRef(true);

  const startPress = (e: React.TouchEvent) => {
    startPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    isLongPressValid.current = true;

    timerRef.current = setTimeout(() => {
      if (onLongPress && isLongPressValid.current) {
         onLongPress();
      }
    }, 450);
  };

  const handleMove = (e: React.TouchEvent) => {
    if (!isLongPressValid.current) return;
    const diffX = Math.abs(e.touches[0].clientX - startPos.current.x);
    const diffY = Math.abs(e.touches[0].clientY - startPos.current.y);
    if (diffX > 10 || diffY > 10) {
      clearTimeout(timerRef.current);
      isLongPressValid.current = false;
    }
  };

  const endPress = () => {
    clearTimeout(timerRef.current);
    if (isLongPressValid.current && onClick) onClick();
  };

  const isDark = theme === 'dark';

  return (
    <motion.div
      onTouchStart={startPress}
      onTouchMove={handleMove}
      onTouchEnd={endPress}
      whileTap={{ scale: 0.98 }}
      className={`relative group !min-h-0 !min-w-0 !h-full !w-full ${className}`}
    >
      <GlassCard
        className="w-full h-full"
        radius={cornerRadius}
        blur={blurRadius}
        opacity={tintOpacity}
        theme={theme}
      >
        <div className="flex flex-col h-full">
            {(title || icon) && (
              <div className={`flex items-center gap-2 p-4 border-b transition-colors duration-500 shrink-0 ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                {icon && <span className={`opacity-80 ${isDark ? 'text-white' : 'text-black/70'}`}>{icon}</span>}
                {title && <span className={`text-[10px] font-black tracking-[0.15em] uppercase ${isDark ? 'text-white/40' : 'text-black/40'}`}>{title}</span>}
              </div>
            )}

            {/* Content Area: Added overflow-hidden to ensure content never bleeds into padding/borders */}
            <div className={`relative flex-1 min-h-0 p-4 overflow-hidden transition-colors duration-500 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
              {children}
            </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};
