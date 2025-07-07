'use client';

import { useEffect, useRef } from 'react';

// Convert hex color to rgba
const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const Globe = ({ primaryColor = '#14b8a6' }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const dotsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Globe parameters
    const centerX = canvas.width / (2 * window.devicePixelRatio);
    const centerY = canvas.height / (2 * window.devicePixelRatio);
    const radius = Math.min(centerX, centerY) * 0.9;

    // Generate dots on sphere
    const generateDots = () => {
      const dots = [];
      const numDots = 250;

      for (let i = 0; i < numDots; i++) {
        // Fibonacci sphere distribution for even dot placement
        const y = 1 - (i / (numDots - 1)) * 2;
        const radiusAtY = Math.sqrt(1 - y * y);
        const theta = (i * 2.399963229728653) % (2 * Math.PI); // Golden angle

        dots.push({
          x: Math.cos(theta) * radiusAtY,
          y: y,
          z: Math.sin(theta) * radiusAtY,
          originalX: Math.cos(theta) * radiusAtY,
          originalY: y,
          originalZ: Math.sin(theta) * radiusAtY,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.8 + 0.2,
        });
      }
      return dots;
    };

    dotsRef.current = generateDots();
    let rotation = 0;

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);

      rotation += 0.008; // Slightly faster rotation speed

      // Draw globe outline (optional)
      ctx.strokeStyle = 'rgba(156, 163, 175, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.stroke();

      // Draw latitude lines
      for (let lat = -60; lat <= 60; lat += 30) {
        const y = (lat / 90) * radius;
        const r = Math.sqrt(radius * radius - y * y);
        
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(156, 163, 175, 0.05)';
        ctx.lineWidth = 0.5;
        ctx.arc(centerX, centerY - y, r, 0, 2 * Math.PI);
        ctx.stroke();
      }

      // Draw longitude lines
      for (let lng = 0; lng < 180; lng += 30) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(156, 163, 175, 0.05)';
        ctx.lineWidth = 0.5;
        
        const angle = (lng * Math.PI) / 180;
        const cosAngle = Math.cos(angle + rotation);
        
        if (cosAngle > 0) {
          for (let t = 0; t <= 1; t += 0.01) {
            const phi = t * Math.PI;
            const x = radius * Math.sin(phi) * Math.cos(angle + rotation);
            const z = radius * Math.sin(phi) * Math.sin(angle + rotation);
            const y = radius * Math.cos(phi);

            if (z > 0) { // Only draw visible part
              if (t === 0) {
                ctx.moveTo(centerX + x, centerY - y);
              } else {
                ctx.lineTo(centerX + x, centerY - y);
              }
            }
          }
          ctx.stroke();
        }
      }

      // Update and draw dots
      dotsRef.current.forEach((dot) => {
        // Rotate dot around Y-axis
        const cosRot = Math.cos(rotation);
        const sinRot = Math.sin(rotation);
        
        dot.x = dot.originalX * cosRot - dot.originalZ * sinRot;
        dot.z = dot.originalX * sinRot + dot.originalZ * cosRot;

        // Only draw dots on the visible hemisphere (z > 0)
        if (dot.z > 0) {
          const screenX = centerX + dot.x * radius;
          const screenY = centerY - dot.y * radius;
          
          // Calculate depth-based opacity
          const depthOpacity = (dot.z + 1) / 2; // Normalize z from [-1,1] to [0,1]
          const finalOpacity = dot.opacity * depthOpacity;
          
          // Calculate size based on depth
          const depthSize = dot.size * (0.5 + depthOpacity * 0.5);

          ctx.fillStyle = `rgba(255, 255, 255, ${finalOpacity * 0.8})`; // gray-50
          ctx.beginPath();
          ctx.arc(screenX, screenY, depthSize, 0, 2 * Math.PI);
          ctx.fill();

          // Add subtle glow effect for some dots
          if (Math.random() > 0.98) {
            ctx.shadowColor = `rgba(255, 255, 255, 0.5)`; // gray-50
            ctx.shadowBlur = 5;
            ctx.beginPath();
            ctx.arc(screenX, screenY, depthSize + 1, 0, 2 * Math.PI);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="w-full h-full max-w-[400px] animate-pulse-slow"
        style={{ 
          filter: `drop-shadow(0 0 20px rgba(255, 255, 255, 0.1))` // gray-50
        }}
      />
      
      {/* Additional floating particles around the globe */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full animate-float animate-delay-100"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }} // gray-50
        ></div>
        <div 
          className="absolute top-3/4 right-1/4 w-1.5 h-1.5 rounded-full animate-float animate-delay-300"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }} // gray-50
        ></div>
        <div 
          className="absolute top-1/2 left-1/6 w-1 h-1 rounded-full animate-float animate-delay-500"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }} // gray-50
        ></div>
        <div 
          className="absolute bottom-1/3 right-1/3 w-2.5 h-2.5 rounded-full animate-float animate-delay-700"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} // gray-50
        ></div>
        <div 
          className="absolute top-1/6 right-1/6 w-1.5 h-1.5 rounded-full animate-float animate-delay-200"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.35)' }} // gray-50
        ></div>
      </div>
    </div>
  );
};

export default Globe;
