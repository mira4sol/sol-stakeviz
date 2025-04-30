import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { ENV } from '../constants/env.constant'

export const createClient = async () => {
  const cookieStore = await cookies()

  return createServerClient(ENV.SUPABASE_URL || '', ENV.SUPABASE_KEY || '', {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch (error: unknown) {
          // The `set` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
          console.error(error)
        }
      },
    },
  })
}
