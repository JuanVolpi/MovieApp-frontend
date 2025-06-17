import type { NavigateOptions } from 'react-router-dom'

import { HeroUIProvider } from '@heroui/system'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ToastProvider } from '@heroui/toast'

declare module '@react-types/shared' {
  interface RouterConfig {
    routerOptions: NavigateOptions
  }
}

export function Provider ({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <NextThemesProvider
        attribute='class'
        storageKey='theme'
        enableSystem={false}
      >
        {children}
      </NextThemesProvider>
      <ToastProvider />
    </HeroUIProvider>
  )
}
