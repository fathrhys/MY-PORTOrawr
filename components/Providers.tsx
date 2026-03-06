"use client";

import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from "next-themes";
import { Toaster } from "sonner";

export function Providers({ children, ...props }: ThemeProviderProps) {
    return (
        <NextThemesProvider {...props}>
            {children}
            <Toaster position="bottom-right" richColors theme="system" />
        </NextThemesProvider>
    );
}
