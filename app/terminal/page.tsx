"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

type HistoryItem = {
    command: string;
    output: React.ReactNode;
};

export default function TerminalPage() {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [input, setInput] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const endRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { setTheme } = useTheme();

    // Focus input automatically
    useEffect(() => {
        inputRef.current?.focus();
        // Force dark mode for terminal
        setTheme("dark");
    }, [setTheme]);

    // Auto scroll to bottom
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [history]);

    const handleCommand = (cmd: string) => {
        const trimmed = cmd.trim();
        if (!trimmed) return;

        const lower = trimmed.toLowerCase();
        let output: React.ReactNode = "";

        switch (lower) {
            case "help":
                output = (
                    <div className="text-emerald-400">
                        Available commands:<br />
                        <span className="text-emerald-200">whoami</span>    - Display creator info<br />
                        <span className="text-emerald-200">ls</span>        - List projects<br />
                        <span className="text-emerald-200">cat skills</span> - View skills<br />
                        <span className="text-emerald-200">gui</span>       - Return to normal interface<br />
                        <span className="text-emerald-200">clear</span>     - Clear terminal<br />
                        <span className="text-emerald-200">sudo</span>      - ???
                    </div>
                );
                break;
            case "whoami":
                output = "guest@Nashwan.dev\n\nAhmad Fadhil Fathi R. N. - Cloud & DevOps Engineer.\nPassionate about Cybersecurity, Web Development, and Building scalable systems.";
                break;
            case "ls":
                output = (
                    <div className="flex gap-4 text-emerald-300">
                        <span>projects/</span>
                        <span>certifications/</span>
                        <span>ctf-writeups/</span>
                        <span>secrets/</span>
                    </div>
                );
                break;
            case "cat skills":
                output = "Next.js, TypeScript, Docker, Kubernetes, AWS, Linux, Python, Go, Prisma.";
                break;
            case "gui":
                output = "Returning to visual interface...";
                setTimeout(() => router.push("/"), 500);
                break;
            case "clear":
                setHistory([]);
                setInput("");
                return; // Don't add clear command to history
            default:
                if (lower.startsWith("sudo")) {
                    output = "Nashwan is not in the sudoers file. This incident will be reported.";
                } else {
                    output = `Command not found: ${trimmed}. Type 'help' for available commands.`;
                }
        }

        setHistory((prev) => [...prev, { command: trimmed, output }]);
        setInput("");
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleCommand(input);
        }
    };

    return (
        <main
            className="min-h-screen bg-black p-4 md:p-8 font-mono text-sm text-emerald-500 flex flex-col cursor-text selection:bg-emerald-500/30"
            onClick={() => inputRef.current?.focus()}
        >
            <div className="max-w-4xl mx-auto w-full">
                {/* Header */}
                <div className="mb-6 opacity-80">
                    <pre className="text-emerald-400 mb-2 whitespace-pre-wrap text-xs md:text-sm">
                        {` _   _           _                             
| \\ | | __ _ ___| |____      ____ _ _ __  
|  \\| |/ _\` / __| '_ \\ \\ /\\ / / _\` | '_ \\ 
| |\\  | (_| \\__ \\ | | \\ V  V / (_| | | | |
|_| \\_|\\__,_|___/_| |_|\\_/\\_/ \\__,_|_| |_|`}
                    </pre>
                    <p className="text-emerald-300 mt-4">Welcome to NashwanOS v2.0.0 (tty1)</p>
                    <p className="text-emerald-300/60">Type 'help' to see available commands.</p>
                </div>

                {/* Output History */}
                <div className="flex flex-col gap-2 mb-2">
                    {history.map((item, i) => (
                        <div key={i} className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className="text-emerald-400 font-bold">guest@Nashwan.dev</span>
                                <span className="text-emerald-400/50">:~$</span>
                                <span className="text-emerald-100">{item.command}</span>
                            </div>
                            <div className="whitespace-pre-wrap pl-0 opacity-90 break-words">{item.output}</div>
                        </div>
                    ))}
                </div>

                {/* Input Line */}
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-emerald-400 font-bold">guest@Nashwan.dev</span>
                    <span className="text-emerald-400/50">:~$</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 bg-transparent border-none outline-none text-emerald-100 font-mono"
                        autoFocus
                        spellCheck="false"
                        autoComplete="off"
                    />
                </div>
                <div ref={endRef} className="h-4" />
            </div>
        </main>
    );
}
