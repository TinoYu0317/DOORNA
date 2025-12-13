import React from 'react';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  radius?: number | string;
  blur?: number;
  opacity?: number;
  theme?: 'light' | 'dark';
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(({
  children,
  className = '',
  radius = 36,
  blur = 40,
  opacity = 0, // We ignore this prop mostly to enforce our own calibrated glass opacities, or use it as a tint modifier
  theme = 'light',
  style,
  ...props
}, ref) => {
  const isDark = theme === 'dark';
  const r = typeof radius === 'number' ? `${radius}px` : radius;

  // Refraction Logic:
  // Dark Mode: Reduced brightness boost to prevent "washing out"
  const backdropSettings = isDark 
    ? `blur(${blur}px) saturate(100%) brightness(100%)` 
    : `blur(${blur * 0.8}px) saturate(190%) contrast(105%)`;

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      style={{
        borderRadius: r,
        // Outer Shadows (Drop Shadows)
        // Dark Mode: Deeper shadow for better separation
        boxShadow: isDark
          ? `0 30px 60px -12px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.05)` 
          : `0 20px 40px -12px rgba(194, 176, 164, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.4)`, 
        ...style
      }}
      {...props}
    >
      {/* 
        Glass Material Layer
      */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          borderRadius: r,
          overflow: 'hidden',
          maskImage: 'radial-gradient(white, black)',
          WebkitMaskImage: '-webkit-radial-gradient(white, black)',
        }}
      >
        {/* 1. Base Glass Tint & Refraction */}
        <div 
            className="absolute inset-0 w-full h-full"
            style={{
                // Light Mode: Very low opacity white (0.35)
                // Dark Mode: Higher opacity (0.75) to make it less transparent/shiny and more readable
                backgroundColor: isDark ? 'rgba(25,25,30,0.75)' : 'rgba(255,255,255,0.35)',
                backdropFilter: backdropSettings,
                WebkitBackdropFilter: backdropSettings,
            }}
        />

        {/* 2. Noise Texture */}
        <div 
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{
                opacity: isDark ? 0.05 : 0.12, // Reduced noise in dark mode to look cleaner
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                mixBlendMode: 'overlay',
            }}
        />

        {/* 3. Reflection / Sheen (Specular Highlight) */}
        <div 
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{
                // Light Source: Top-Right (225deg)
                // Dark Mode: Drastically reduced opacity (0.05) to kill the "shine"
                background: isDark
                    ? `linear-gradient(225deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 30%, rgba(255,255,255,0) 50%)`
                    : `linear-gradient(225deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 45%)`
            }}
        />
      </div>

      {/* 
        4. Gradient Border Highlight
      */}
      <div 
        className="absolute inset-0 z-20 pointer-events-none rounded-[inherit]"
        style={{
            // Dark Mode: Very subtle border
            background: isDark 
                ? `linear-gradient(225deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0) 100%)`
                : `linear-gradient(225deg, 
                    rgba(255,255,255,0.95) 0%, 
                    rgba(200, 245, 255, 0.6) 12%, 
                    rgba(255, 220, 240, 0.4) 25%, 
                    rgba(255,255,255,0) 60%)`,
            padding: '1.5px',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
        }}
      />

      {/* Content Layer */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
});

GlassCard.displayName = 'GlassCard';