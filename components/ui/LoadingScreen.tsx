"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulasi loading selama 1.2 detik saat web pertama dibuka
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    key="loading-screen"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-900 text-white"
                >
                    {/* Logo / Initial */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8"
                    >
                        <span className="text-5xl font-bold tracking-tighter">Nashwan<span className="text-amber-400">.dev</span></span>
                    </motion.div>

                    {/* Progress Bar Container */}
                    <div className="w-48 h-1 overflow-hidden rounded-full bg-slate-800">
                        {/* Progress Bar Fill */}
                        <motion.div
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                            className="h-full bg-amber-400"
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
