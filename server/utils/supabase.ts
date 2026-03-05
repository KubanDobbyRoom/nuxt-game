import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export type SupabaseServerClient = SupabaseClient

export const getSupabaseServerClient = (): SupabaseServerClient => {
  const config = useRuntimeConfig()
  const url = config.server?.supabase?.url
  const serviceRoleKey = config.server?.supabase?.serviceRoleKey

  if (!url || !serviceRoleKey) {
    throw new Error('Supabase server credentials are not configured')
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

