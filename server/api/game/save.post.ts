import { defineEventHandler, readBody, createError } from 'h3'
import { getSupabaseServerClient } from '../../utils/supabase'
import { requireTelegramUser } from '../../utils/requireTelegramUser'

interface SaveGameBody {
  state: unknown
}

export default defineEventHandler(async (event) => {
  const { profile } = await requireTelegramUser(event)
  const body = (await readBody<SaveGameBody>(event)) || {}

  if (typeof body.state === 'undefined') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing game state in request body',
    })
  }

  const supabase = getSupabaseServerClient()

  /**
   * Expected Supabase schema for game_states:
   * - id: uuid primary key, default gen_random_uuid()
   * - profile_id: uuid references profiles(id)
   * - state: jsonb
   * - updated_at: timestamptz default now()
   */
  const { error } = await supabase.from('game_states').upsert(
    {
      profile_id: profile.id,
      state: body.state,
    },
    { onConflict: 'profile_id' },
  )

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to save game state to Supabase',
    })
  }

  return { ok: true }
})

