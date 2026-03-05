import { defineEventHandler, createError } from 'h3'
import { getSupabaseServerClient } from '../../utils/supabase'
import { requireTelegramUser } from '../../utils/requireTelegramUser'

export default defineEventHandler(async (event) => {
  const { profile } = await requireTelegramUser(event)
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .from('game_states')
    .select('state')
    .eq('profile_id', profile.id)
    .maybeSingle()

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to load game state from Supabase',
    })
  }

  return {
    state: data?.state ?? null,
  }
})

