"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { Terminal, Search, User, FolderGit2, Mail, Home } from "lucide-react";

export default function CommandMenu() {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    // Toggle the menu when ⌘K is pressed
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const runCommand = (command: () => void) => {
        setOpen(false);
        command();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[99999] flex items-start justify-center pt-[15vh] px-4 sm:px-0">
            <div
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm dark:bg-slate-900/60"
                onClick={() => setOpen(false)}
            />

            <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-2xl ring-1 ring-black/5 dark:border-white/10 dark:bg-[#0f172a]/95 dark:ring-white/10">
                <Command
                    label="Global Command Menu"
                    className="flex h-full w-full flex-col overflow-hidden bg-transparent"
                >
                    <div className="flex items-center border-b border-slate-200 px-4 dark:border-white/10">
                        <Search className="mr-2 h-5 w-5 shrink-0 text-slate-500 dark:text-slate-400" />
                        <Command.Input
                            autoFocus
                            placeholder="Ketik perintah atau cari halaman..."
                            className="flex h-14 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-200 dark:placeholder:text-slate-400"
                        />
                        <div className="ml-2 flex items-center gap-1 rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 dark:border-white/10 dark:bg-slate-800 dark:text-slate-400">
                            <span className="text-xs">esc</span>
                        </div>
                    </div>

                    <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2">
                        <Command.Empty className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                            Perintah tidak ditemukan.
                        </Command.Empty>

                        <Command.Group heading="Halaman Utama" className="px-2 py-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                            <Command.Item
                                onSelect={() => runCommand(() => router.push("/"))}
                                className="relative flex cursor-default select-none items-center rounded-xl px-2 py-2.5 text-sm outline-none aria-selected:bg-slate-100 aria-selected:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:aria-selected:bg-white/10 dark:aria-selected:text-white"
                            >
                                <Home className="mr-3 h-4 w-4" />
                                Home
                            </Command.Item>
                            <Command.Item
                                onSelect={() => runCommand(() => router.push("/projects"))}
                                className="relative flex cursor-default select-none items-center rounded-xl px-2 py-2.5 text-sm outline-none aria-selected:bg-slate-100 aria-selected:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:aria-selected:bg-white/10 dark:aria-selected:text-white"
                            >
                                <FolderGit2 className="mr-3 h-4 w-4" />
                                Projects
                            </Command.Item>
                            <Command.Item
                                onSelect={() => runCommand(() => router.push("/certificates"))}
                                className="relative flex cursor-default select-none items-center rounded-xl px-2 py-2.5 text-sm outline-none aria-selected:bg-slate-100 aria-selected:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:aria-selected:bg-white/10 dark:aria-selected:text-white"
                            >
                                <User className="mr-3 h-4 w-4" />
                                Certificates
                            </Command.Item>
                            <Command.Item
                                onSelect={() => runCommand(() => router.push("/contact"))}
                                className="relative flex cursor-default select-none items-center rounded-xl px-2 py-2.5 text-sm outline-none aria-selected:bg-slate-100 aria-selected:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:aria-selected:bg-white/10 dark:aria-selected:text-white"
                            >
                                <Mail className="mr-3 h-4 w-4" />
                                Contact
                            </Command.Item>
                            <Command.Item
                                onSelect={() => runCommand(() => window.open("/cv.pdf", "_blank"))}
                                className="relative flex cursor-default select-none items-center rounded-xl px-2 py-2.5 text-sm outline-none aria-selected:bg-slate-100 aria-selected:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:aria-selected:bg-white/10 dark:aria-selected:text-white"
                            >
                                <User className="mr-3 h-4 w-4" />
                                Download CV
                            </Command.Item>
                        </Command.Group>


                        <Command.Group heading="Rahasia" className="px-2 py-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mt-2">
                            <Command.Item
                                onSelect={() => runCommand(() => router.push("/terminal"))}
                                className="relative flex cursor-default select-none items-center rounded-xl px-2 py-2.5 text-sm outline-none aria-selected:bg-emerald-50 aria-selected:text-emerald-900 dark:aria-selected:bg-emerald-500/20 dark:aria-selected:text-emerald-400 text-emerald-600 dark:text-emerald-500 font-medium"
                            >
                                <Terminal className="mr-3 h-4 w-4" />
                                Terminal Mode
                            </Command.Item>
                        </Command.Group>

                    </Command.List>
                </Command>
            </div>
        </div>
    );
}
