'use client';

import { useRef, useEffect } from 'react';

interface GridScanProps {
  sensitivity?: number;
  lineThickness?: number;
  linesColor?: string;
  gridScale?: number;
  scanColor?: string;
  scanOpacity?: number;
  enablePost?: boolean;
  bloomIntensity?: number;
  chromaticAberration?: number;
  noiseIntensity?: number;
}

export function GridScan({
  sensitivity = 0.3,
  lineThickness = 1,
  linesColor = '#2e2a40',
  gridScale = 0.1,
  scanColor = '#60a5fa',
  scanOpacity = 0.3,
}: GridScanProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    let offset = 0;

    const draw = () => {
      if (!ctx) return;

      ctx.clearRect(0, 0, width, height);

      // Draw grid lines
      ctx.strokeStyle = linesColor;
      ctx.lineWidth = lineThickness;

      const step = gridScale * width;

      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x + (offset % step), 0);
        ctx.lineTo(x + (offset % step), height);
        ctx.stroke();
      }

      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y + (offset % step));
        ctx.lineTo(width, y + (offset % step));
        ctx.stroke();
      }

      // Scan overlay effect
      ctx.fillStyle = scanColor;
      ctx.globalAlpha = scanOpacity;
      ctx.fillRect(0, offset % height, width, 2);
      ctx.globalAlpha = 1;

      offset += sensitivity * 5;

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    // Handle resize
    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [linesColor, lineThickness, gridScale, scanColor, scanOpacity, sensitivity]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full absolute top-0 left-0"
    />
  );
}

// Also keep default export
export default GridScan;