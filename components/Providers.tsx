"use client";


import { Toaster } from "sonner";
import CommandMenu from "./ui/CommandMenu";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            <CommandMenu />
            <Toaster position="bottom-right" richColors theme="light" />
        </>
    );
}
