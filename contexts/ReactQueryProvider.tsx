'use client'

import { queryClient } from '@/lib/queryClient'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental'
import { ReactNode } from 'react'

export const ReactQueryProvider = ({ children }: { children: ReactNode }) => {
  // const [client] = useState(new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryStreamedHydration>{children}</ReactQueryStreamedHydration>
    </QueryClientProvider>
  )
}
