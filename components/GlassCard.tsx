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
  // In Light Mode, we boost saturation (190%) and contrast slightly. 
  // This mimics the physical property of thick glass amplifying the light behind it.
  const backdropSettings = isDark 
    ? `blur(${blur}px)`
    : `blur(${blur * 0.8}px) saturate(190%) contrast(105%)`; // Reduced blur slightly to emphasize the refraction

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      style={{
        borderRadius: r,
        // Outer Shadows (Drop Shadows)
        // Light Mode: Subtle taupe shadow to ground the glass without dirtying the refraction
        boxShadow: isDark
          ? `0 20px 40px -10px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)` 
          : `0 20px 40px -12px rgba(194, 176, 164, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.4)`, 
        ...style
      }}
      {...props}
    >
      {/* 
        Glass Material Layer
        We use a separate absolute div for the background effects.
        CRITICAL FIX: 'maskImage' forces the browser to clip the backdrop-filter to the border-radius.
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
                // Light Mode: Very low opacity white (0.35) to let the saturated background shine through.
                backgroundColor: isDark ? 'rgba(30,30,35,0.60)' : 'rgba(255,255,255,0.35)',
                backdropFilter: backdropSettings,
                WebkitBackdropFilter: backdropSettings,
            }}
        />

        {/* 2. Noise Texture (High Visibility for texture) */}
        <div 
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{
                opacity: 0.12,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                mixBlendMode: 'overlay',
            }}
        />

        {/* 3. Reflection / Sheen */}
        <div 
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{
                // Light Source: Top-Right (225deg)
                background: `linear-gradient(225deg, rgba(255,255,255,${isDark ? 0.1 : 0.7}) 0%, rgba(255,255,255,0) 45%)`
            }}
        />
      </div>

      {/* 
        4. Gradient Border Highlight with Chromatic Aberration
        This layer simulates the light hitting the edge and splitting into spectral colors.
      */}
      <div 
        className="absolute inset-0 z-20 pointer-events-none rounded-[inherit]"
        style={{
            // Chromatic Aberration Simulation:
            // We introduce subtle bands of Cyan (cool) and Pink (warm) into the gradient.
            // 0% White -> 10% Cyan-tint -> 20% Pink-tint -> Fade out
            background: isDark 
                ? `linear-gradient(225deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.05) 30%, rgba(255,255,255,0) 100%)`
                : `linear-gradient(225deg, 
                    rgba(255,255,255,0.95) 0%, 
                    rgba(200, 245, 255, 0.6) 12%, 
                    rgba(255, 220, 240, 0.4) 25%, 
                    rgba(255,255,255,0) 60%)`, // The prism effect
            padding: '1.5px', // Border thickness
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