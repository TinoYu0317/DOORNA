import React, { useRef } from 'react';
import { motion } from 'framer-motion';

interface LongPressableProps {
  children: React.ReactNode;
  onLongPress: () => void;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export const LongPressable: React.FC<LongPressableProps> = ({ 
  children, 
  onLongPress, 
  onClick, 
  className = '',
  disabled = false
}) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPress = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    // Stop propagation so parent containers (like GlassFrame) don't capture this as their own interaction
    e.stopPropagation();
    
    isLongPress.current = false;
    startPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    
    timerRef.current = setTimeout(() => {
      isLongPress.current = true;
      if (navigator.vibrate) navigator.vibrate(50); // Haptic feedback
      onLongPress();
    }, 500); // 500ms hold time
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (disabled || !timerRef.current) return;
    e.stopPropagation();
    const moveX = Math.abs(e.touches[0].clientX - startPos.current.x);
    const moveY = Math.abs(e.touches[0].clientY - startPos.current.y);
    
    // Cancel if moved more than 10px
    if (moveX > 10 || moveY > 10) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (disabled) return;
    e.stopPropagation();
    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    if (!isLongPress.current && onClick) {
      onClick();
    }
  };

  return (
    <motion.div
      className={`${className} cursor-pointer select-none relative z-10`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  );
};