"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const updateMousePosition = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseEnter = () => setIsHovering(true);
        const handleMouseLeave = () => setIsHovering(false);

        window.addEventListener("mousemove", updateMousePosition);

        // Attach hover listeners to all clickable elements
        const clickables = document.querySelectorAll(
            'a, button, input, select, textarea, [role="button"], .press, .u'
        );
        clickables.forEach((el) => {
            el.addEventListener("mouseenter", handleMouseEnter);
            el.addEventListener("mouseleave", handleMouseLeave);
        });

        // Hide cursor when leaving window
        const handleWindowLeave = () => setIsVisible(false);
        document.addEventListener("mouseleave", handleWindowLeave);

        return () => {
            window.removeEventListener("mousemove", updateMousePosition);
            document.removeEventListener("mouseleave", handleWindowLeave);
            clickables.forEach((el) => {
                el.removeEventListener("mouseenter", handleMouseEnter);
                el.removeEventListener("mouseleave", handleMouseLeave);
            });
        };
    }, [isVisible]);

    // If on mobile or touch device, don't show custom cursor
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
        return null;
    }

    return (
        <>
            <style>{`
        /* Hide default cursor on desktop */
        @media (pointer: fine) {
          body * {
            cursor: none !important;
          }
        }
      `}</style>
            {isVisible && (
                <motion.div
                    animate={{
                        x: mousePosition.x - (isHovering ? 24 : 16),
                        y: mousePosition.y - (isHovering ? 24 : 16),
                        scale: isHovering ? 1.5 : 1,
                        backgroundColor: isHovering ? "rgba(245, 158, 11, 0.15)" : "transparent",
                        borderColor: isHovering ? "rgba(245, 158, 11, 0)" : "rgba(100, 116, 139, 0.5)",
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 150,
                        damping: 15,
                        mass: 0.5,
                    }}
                    className="pointer-events-none fixed left-0 top-0 z-[100000] h-8 w-8 rounded-full border-2 backdrop-blur-[1px] dark:border-slate-400/50"
                    style={{
                        width: isHovering ? 48 : 32,
                        height: isHovering ? 48 : 32,
                    }}
                >
                    {/* Inner core dot */}
                    <motion.div
                        className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)] dark:bg-amber-400"
                        animate={{
                            scale: isHovering ? 0 : 1,
                            opacity: isHovering ? 0 : 1,
                        }}
                        transition={{ duration: 0.2 }}
                    />
                </motion.div>
            )}
        </>
    );
}
