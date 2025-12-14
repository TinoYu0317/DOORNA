import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';

interface GlassFrameProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  onIconClick?: () => void; // New prop for icon tap
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
  onIconClick,
  onLongPress,
  title,
  icon,
  theme = 'light',
  blurRadius = 40,
  tintOpacity = 0.15,
  cornerRadius = 36, 
}) => {
  const startPos = useRef({ x: 0, y: 0 });
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const isLongPressValid = useRef(true);

  const startPress = (e: React.TouchEvent) => {
    startPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    isLongPressValid.current = true;

    timerRef.current = setTimeout(() => {
      if (onLongPress && isLongPressValid.current) {
         isLongPressValid.current = false; 
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
    if (isLongPressValid.current && onClick) {
        onClick();
    }
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
              <div className={`flex items-center gap-2.5 px-5 pt-5 pb-2 transition-colors duration-500 shrink-0`}>
                {/* Icon Wrapper with explicit Click Handler */}
                {icon && (
                    <div 
                        className={`
                            opacity-80 transition-all duration-500
                            flex items-center justify-center -ml-1 p-1 rounded-full 
                            ${onIconClick ? 'cursor-pointer hover:bg-black/5 dark:hover:bg-white/10' : ''} 
                            ${isDark ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]' : 'text-black/80'}
                        `}
                        onClick={(e) => {
                            if (onIconClick) {
                                e.stopPropagation(); // Stop bubbling to main frame click
                                onIconClick();
                            }
                        }}
                        onTouchEnd={(e) => {
                            if (onIconClick) {
                                e.stopPropagation();
                            }
                        }}
                    >
                        {React.cloneElement(icon as React.ReactElement<any>, { size: 16, strokeWidth: 2.5 })}
                    </div>
                )}
                {title && <span className={`text-[11px] font-bold tracking-[0.15em] uppercase pointer-events-none opacity-50 ${isDark ? 'text-white' : 'text-black'}`}>{title}</span>}
              </div>
            )}

            {/* Content Area */}
            <div className={`relative flex-1 min-h-0 px-5 pb-5 pt-1 overflow-hidden transition-colors duration-500 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
              {children}
            </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};