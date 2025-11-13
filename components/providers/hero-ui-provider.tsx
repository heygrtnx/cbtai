"use client"

import { HeroUIProvider } from "@heroui/react"
import { ReactNode } from "react"

export function HeroUIProviderWrapper({ children }: { children: ReactNode }) {
  return <HeroUIProvider>{children}</HeroUIProvider>
}

