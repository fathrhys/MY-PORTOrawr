"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const container = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  
  const [loadingText, setLoadingText] = useState("INITIALIZING_SYSTEM");
  const [progress, setProgress] = useState(0);

  useGSAP(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(container.current, {
          yPercent: -100,
          duration: 1.2,
          ease: "power4.inOut",
          onComplete,
        });
      },
    });

    const logs = [
      "LOADING_ASSETS...",
      "ESTABLISHING_SECURE_CONNECTION...",
      "MOUNTING_COMPONENTS...",
      "SYSTEM_READY_",
    ];

    const currentProgress = { value: 0 };
    
    tl.to(currentProgress, {
      value: 100,
      duration: 2.2,
      ease: "power1.inOut",
      onUpdate: () => {
        const val = Math.floor(currentProgress.value);
        setProgress(val);
        if (val > 25 && val < 50) setLoadingText(logs[0]);
        else if (val >= 50 && val < 75) setLoadingText(logs[1]);
        else if (val >= 75 && val < 99) setLoadingText(logs[2]);
        else if (val === 100) setLoadingText(logs[3]);
      },
    });

    tl.to(textRef.current, { opacity: 0.5, duration: 0.1, yoyo: true, repeat: 3 }, "-=0.5");

  }, { scope: container });

  return (
    <div 
      ref={container}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black text-slate-300 font-mono text-xs sm:text-sm"
    >
       <div ref={bgRef} className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900/40 via-black to-black"></div>
       
       <div className="relative z-10 flex flex-col items-center gap-6">
         <div className="w-48 sm:w-64 h-px bg-white/10 relative overflow-hidden">
            <div 
              className="absolute left-0 top-0 bottom-0 bg-white"
              style={{ width: `${progress}%` }}
            />
         </div>

         <div className="flex flex-col items-center gap-2">
           <div ref={progressRef} className="text-3xl sm:text-5xl font-bold tracking-tighter text-white">
             {progress}%
           </div>
           <div ref={textRef} className="tracking-widest opacity-70 uppercase">
             &gt; {loadingText} <span className="animate-pulse">_</span>
           </div>
         </div>
       </div>
    </div>
  );
}
