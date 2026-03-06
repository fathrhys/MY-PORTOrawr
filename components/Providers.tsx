"use client";

import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from "next-themes";
import { Toaster } from "sonner";
import CommandMenu from "./ui/CommandMenu";

export function Providers({ children, ...props }: ThemeProviderProps) {
    return (
        <NextThemesProvider {...props}>
            {children}
            <CommandMenu />
            <Toaster position="bottom-right" richColors theme="system" />
        </NextThemesProvider>
    );
}
