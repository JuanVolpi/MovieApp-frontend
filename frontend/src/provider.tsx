import type { NavigateOptions } from "react-router-dom";

import { HeroUIProvider } from "@heroui/system";
import {ThemeProvider as NextThemesProvider} from "next-themes";
import { useHref, useNavigate } from "react-router-dom";

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

export function Provider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <HeroUIProvider>
    <NextThemesProvider attribute="class" defaultTheme="dark">
      {children}
    </NextThemesProvider>
  </HeroUIProvider>
  );
}
