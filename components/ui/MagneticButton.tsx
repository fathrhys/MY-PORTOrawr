"use client";

import { useRef, ReactNode, MouseEvent, ReactElement, cloneElement } from "react";
import gsap from "gsap";

interface MagneticButtonProps {
  children: ReactElement;
  strength?: number;
}

export default function MagneticButton({ children, strength = 0.3 }: MagneticButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    // Select the first child element of the container specifically
    const child = containerRef.current.firstElementChild;
    if (!child) return;

    const { clientX, clientY } = e;
    const { height, width, left, top } = containerRef.current.getBoundingClientRect();
    
    const x = ((clientX - left) - width / 2) * strength;
    const y = ((clientY - top) - height / 2) * strength;
    
    gsap.to(child, {
      x,
      y,
      duration: 1,
      ease: "power3.out",
    });
  };

  const handleMouseLeave = () => {
    if (!containerRef.current) return;
    
    const child = containerRef.current.firstElementChild;
    if (!child) return;

    gsap.to(child, {
      x: 0,
      y: 0,
      duration: 1,
      ease: "elastic.out(1, 0.3)",
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-flex relative z-10 p-2 cursor-pointer"
    >
      {children}
    </div>
  );
}
