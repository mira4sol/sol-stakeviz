'use client'

import { Toaster } from '@/components/ui/toaster'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ReactQueryProvider } from './ReactQueryProvider'

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReactQueryProvider>
      <Toaster />
      <TooltipProvider>{children}</TooltipProvider>
    </ReactQueryProvider>
  )
}
