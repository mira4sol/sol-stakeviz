import { createBrowserClient } from '@supabase/ssr'
import { ENV } from '../constants/env.constant'

export const createClient = () =>
  createBrowserClient(ENV.SUPABASE_URL || '', ENV.SUPABASE_ANON_KEY || '')
