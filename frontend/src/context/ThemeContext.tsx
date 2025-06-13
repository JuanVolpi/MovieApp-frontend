"use client";

import {HeroUIProvider} from '@heroui/react'
import {ThemeProvider as NextThemesProvider} from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIThemeProvider defaultTheme="dark" storageKey="hero-ui-theme">
      {children}
    </HeroUIThemeProvider>
  );
}
