"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import LoadingScreen from "@/components/LoadingScreen";
import MagneticButton from "@/components/ui/MagneticButton";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { TypeAnimation } from "react-type-animation";
import { Github, ExternalLink, ChevronDown, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";

// Ensure plugins are registered
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function LandingPage() {
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const projects = [
    {
      title: "NashwanOS",
      desc: "A web-based command-line interface mimicking a fully functional Linux terminal. Built for developers to showcase portfolios in a native developer environment.",
      tags: ["Next.js", "Tailwind", "TypeScript", "Terminal UI"],
      preview: "/profilku.jpg", 
    },
    {
      title: "Cloud & DevOps Infrastructure",
      desc: "Orchestrating containerization and virtualization management. Architecting resilient systems ensuring high availability and robust CI/CD pipelines.",
      tags: ["Docker", "Kubernetes", "Linux"],
      preview: null,
    },
    {
      title: "Cyber Analyst & Bug Hunting",
      desc: "Offensive and defensive security paradigms. Actively hunting vulnerabilities and securing protocols against latest attack vectors.",
      tags: ["SOC", "PortSwigger", "Penetration Testing"],
      preview: null,
    }
  ];

  useGSAP(() => {
    if (loading) return; 

    // --- Hero Timeline ---
    const tl = gsap.timeline({ delay: 0.2 });
    
    tl.fromTo(
      ".hero-text",
      { y: 60, opacity: 0, scale: 0.98 },
      { y: 0, opacity: 1, scale: 1, duration: 1.2, stagger: 0.15, ease: "power4.out" }
    );
    
    tl.fromTo(
      ".hero-cta",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
      "-=0.6"
    );

    // Scroll bouncing indicator
    gsap.to(".scroll-indicator", {
      y: 12,
      repeat: -1,
      yoyo: true,
      duration: 1.2,
      ease: "sine.inOut"
    });

    // --- Projects Scroll Anim ---
    const projectCards = gsap.utils.toArray('.project-card');
    
    projectCards.forEach((card: any, i) => {
      gsap.fromTo(card, 
        { y: 80, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%", // Trigger when the top of the card hits 85% down the viewport
            toggleActions: "play none none reverse",
          }
        }
      );
    });

  }, { dependencies: [loading], scope: containerRef });

  return (
    <div ref={containerRef} className="bg-black text-slate-200 font-sans selection:bg-white/20 selection:text-white">
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      
      {/* Navbar wrapper to control visibility based on loading state */}
      <div className={`transition-opacity duration-1000 ${loading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
         <Navbar />
      </div>

      <main className={`relative transition-opacity duration-1000 ${loading ? 'h-[100vh] overflow-hidden' : 'h-auto'} `}>
        
        {/* HERO SECTION */}
        <section className="relative min-h-[100dvh] flex flex-col items-center justify-center pt-20 px-6 sm:px-8 overflow-hidden z-10">
          {/* Subtle Background Radial (True Black Vibe) */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_white_0%,_transparent_50%)] opacity-[0.03] pointer-events-none" style={{ transform: "translateY(-20%) scale(1.5)" }} />

          <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center">
            
            <div className="hero-text opacity-0 invisible">
               <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-3 py-1 font-mono text-[10px] sm:text-xs uppercase tracking-widest text-slate-300 shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Available for Hire
               </span>
            </div>

            <h1 className="hero-text opacity-0 invisible mt-8 text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-white">
              Ahmad Fadhil
            </h1>
            
            <div className="hero-text opacity-0 invisible mt-6 h-8 sm:h-10 flex items-center justify-center text-base sm:text-2xl font-mono text-slate-400">
              <TypeAnimation
                sequence={[
                  'Web Developer', 2000,
                  'Student & Builder', 2000,
                  'Cybersecurity Analyst', 2000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
                cursor={true}
              />
            </div>

            <p className="hero-text opacity-0 invisible mt-6 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-400/80">
              Backend-driven full-stack developer who builds solid systems behind smooth, well-designed digital experiences. I care about clean logic, performance, and interactions that actually feel good to use.
            </p>

            <div className="hero-cta opacity-0 mt-10 flex flex-wrap items-center justify-center gap-4">
              <MagneticButton strength={0.4}>
                 <button 
                   onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
                   className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition-transform hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.25)]"
                 >
                   Explore My Work <ArrowRight className="w-4 h-4" />
                 </button>
              </MagneticButton>

              <MagneticButton strength={0.4}>
                 <Link 
                   href="/about"
                   className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-black px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10 hover:border-white/20 active:scale-95"
                 >
                   About Me
                 </Link>
              </MagneticButton>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-40 hero-cta">
             <span className="text-[10px] font-mono tracking-widest uppercase mb-2">Scroll</span>
             <ChevronDown className="w-4 h-4 scroll-indicator" />
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="work" className="py-24 sm:py-32 px-6 sm:px-8 max-w-6xl mx-auto z-10 relative">
          <div className="mb-16 md:mb-24 flex flex-col sm:flex-row justify-between sm:items-end gap-6">
            <div>
              <p className="hero-text text-amber-500 font-mono text-xs uppercase tracking-widest mb-3">
                 Selected Work & Experiments
              </p>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
                Things I've Built.
              </h2>
            </div>
            
            <Link href="/projects" className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors">
               View All Projects 
               <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {projects.map((project, idx) => (
              <div 
                key={idx} 
                className="project-card opacity-0 flex flex-col rounded-3xl border border-white/5 bg-white/[0.02] p-2 transition-all duration-500 hover:border-white/15 hover:bg-white/[0.04] hover:shadow-[0_0_30px_rgba(255,255,255,0.02)] group"
              >
                {/* Visual Area */}
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-[#0a0a0a] border border-white/5 flex items-center justify-center">
                  {project.preview ? (
                     <img 
                       src={project.preview} 
                       alt={project.title}
                       className="w-full h-full object-cover opacity-50 transition-all duration-700 group-hover:scale-105 group-hover:opacity-80"
                     />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                       <span className="font-mono text-white/20 text-xs uppercase tracking-widest">CLI_ENV_SIMULATION</span>
                    </div>
                  )}
                  
                  {/* Floating Top Tag */}
                  <div className="absolute top-4 left-4 z-10 translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/60 backdrop-blur-md px-3 py-1 text-[10px] font-mono font-medium text-white shadow-lg">
                      ★ Highlight
                    </span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex flex-col flex-1 p-6">
                  <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-amber-50 transition-colors">
                    {project.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400 flex-1">
                    {project.desc}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="rounded-md bg-white/5 border border-white/10 px-2.5 py-1 text-[10px] font-mono text-slate-300">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-8 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                  <div className="mt-6 flex items-center justify-between">
                     <MagneticButton strength={0.3}>
                       <Link href={`/projects`} className="text-xs font-mono font-bold uppercase tracking-wider text-white hover:text-slate-300 transition-colors flex items-center gap-2">
                         Explore <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                       </Link>
                     </MagneticButton>
                     
                     <div className="flex gap-4 opacity-50">
                        <Github className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
                        <ExternalLink className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
                     </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-white/10 py-12 px-6 mt-10 z-10 relative bg-[#050505]">
           <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
             <div className="flex items-center gap-2 text-white">
                <span className="h-4 w-4 rounded-full bg-white flex items-center justify-center">
                   <span className="h-1.5 w-1.5 rounded-full bg-black"></span>
                </span>
                <span className="font-bold tracking-tight">Nashwan.</span>
             </div>
             <p className="font-mono text-xs text-slate-500">
               © {new Date().getFullYear()} Ahmad Fadhil. Built with Next.js, GSAP, and Tailwind.
             </p>
           </div>
        </footer>
      </main>
    </div>
  );
}
