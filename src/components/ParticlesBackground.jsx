import React, { useMemo } from 'react';

const ParticlesBackground = React.memo(({ dimRed = false, themeColor = 'red', intense = false }) => {
  // Generate particles ONLY ONCE - optimized to 12 particles for better performance
  const particles = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => {
      const sizeValue = Math.random() * 12 + 4; // 4px to 16px
      const isLarge = sizeValue > 10;
      return {
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: `${sizeValue}px`,
        opacity: isLarge ? Math.random() * 0.2 + 0.05 : Math.random() * 0.5 + 0.2,
        duration: `${Math.random() * 30 + 20}s`,
        delay: `-${Math.random() * 20}s`,
        color: Math.random() > 0.6 ? 'rgb(var(--accent-main))' : '#ffffff',
        blur: Math.random() * 3,
      };
    });
  }, []); // Empty dependency array = Runs once on mount

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Tech Grid Overlay - Static */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
        aria-hidden="true"
      />
      
      {/* Floating Particles - Optimized with CSS animations */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="drift-particle"
          style={{
            position: 'absolute',
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            opacity: (dimRed && p.color !== '#ffffff' ? p.opacity * 0.5 : p.opacity) * (intense ? 2 : 1),
            filter: `blur(${p.blur}px)`,
            animation: `drift-random ${p.duration} linear infinite`,
            animationDelay: p.delay,
            borderRadius: '50%',
            boxShadow: p.color !== '#ffffff' ? '0 0 10px rgba(var(--accent-main), 0.4)' : 'none',
            willChange: 'transform', // GPU acceleration hint
          }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
});

export default ParticlesBackground;