'use client';

import { useState, useRef, MouseEvent, TouchEvent } from 'react';
import Image from 'next/image';

interface ProductImageZoomProps {
  images: string[];
  alt: string;
}

export default function ProductImageZoom({ images, alt }: ProductImageZoomProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  const calculatePosition = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    
    // Calculate percentage mapped to boundaries
    const x = ((clientX - left) / width) * 100;
    const y = ((clientY - top) / height) * 100;
    
    setMousePos({ 
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y))
    });
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    calculatePosition(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      calculatePosition(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const activeSrc = images[currentImageIndex];

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full relative">
      
      {/* ---------------- THUMBNAIL GALLERY ---------------- */}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-3 order-2 md:order-1 overflow-x-auto md:overflow-visible w-full md:w-20 lg:w-24 shrink-0 no-scrollbar pb-2 md:pb-0">
           {images.map((img, i) => (
             <div 
               key={i}
               onClick={() => setCurrentImageIndex(i)}
               className={`relative aspect-[3/4] w-20 md:w-full rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-300 ${i === currentImageIndex ? 'border-foreground shadow-md scale-100' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-[1.05]'}`}
             >
                <Image src={img} alt={`${alt} thumbnail ${i+1}`} fill className="object-cover" unoptimized/>
             </div>
           ))}
        </div>
      )}

      {/* ---------------- MAIN VIEWPORT ---------------- */}
      <div className="relative w-full z-20 group order-1 md:order-2 flex-1">
        {/* Base Viewport Image */}
        <div 
          ref={containerRef}
          className="w-full relative aspect-[3/4] lg:aspect-[4/5] bg-[#f8f9fa] rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-border/60 cursor-crosshair touch-none"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={() => setIsHovering(true)}
        onTouchEnd={() => setIsHovering(false)}
        onTouchMove={handleTouchMove}
      >
        <Image
          src={activeSrc}
          alt={alt}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          unoptimized={true}
          priority
        />
        
        {/* Analytical Cursor Lens Box (Matches Myntra pink styling for cohesive aesthetic) */}
        {isHovering && (
          <div 
            className="absolute hidden md:block bg-[#ff3f6c]/10 border border-[#ff3f6c]/40 pointer-events-none transition-opacity duration-150 rounded-xl"
            style={{
              width: '160px',
              height: '160px',
              left: `calc(${mousePos.x}% - 80px)`,
              top: `calc(${mousePos.y}% - 80px)`,
            }}
          />
        )}
      </div>

      {/* Floating High-Resolution Magnification Portal */}
      {/* It sits absolutely to the right side of the image specifically when hovering. */}
      {isHovering && (
        <div className="hidden lg:block absolute left-full ml-6 xl:ml-10 top-0 w-[90%] xl:w-[110%] h-[100%] z-[999] bg-white rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.15)] ring-1 ring-border/50 pointer-events-none animate-in fade-in slide-in-from-left-4 duration-300 overflow-hidden">
           {/* We use the native source image as the background, mapped to a massively scaled percentage derived from the cursor map */}
           <div 
             className="w-full h-full transition-all duration-75 easelinear"
             style={{
               backgroundImage: `url(${activeSrc})`,
               backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
               backgroundSize: '250%', // 2.5x optical zoom representation
               backgroundRepeat: 'no-repeat'
             }}
           />
        </div>
      )}
      </div>
    </div>
  );
}
