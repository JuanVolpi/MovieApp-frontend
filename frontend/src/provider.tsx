import type { NavigateOptions } from 'react-router-dom'

import { HeroUIProvider } from '@heroui/system'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { useNavigate } from 'react-router-dom'
import { addToast, ToastProvider } from '@heroui/toast'

declare module '@react-types/shared' {
  interface RouterConfig {
    routerOptions: NavigateOptions
  }
}

export function Provider ({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()

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
