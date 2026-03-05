import { defineEventHandler, getHeader, createError } from 'h3'
import { parse, validate } from '@telegram-apps/init-data-node'
import { getSupabaseServerClient } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  console.log('telegram.post.ts');
  
  const authHeader = getHeader(event, 'authorization') || ''
  const [scheme, initDataRaw] = authHeader.split(' ')

  if (scheme !== 'tma' || !initDataRaw) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Missing Telegram Mini App initData',
    })
  }

  const config = useRuntimeConfig()
  const botToken = config.server?.telegramBotToken

  if (!botToken) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Telegram bot token is not configured',
    })
  }

  try {
    validate(initDataRaw, botToken, { expiresIn: 3600 })
  } catch {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid or expired Telegram initData',
    })
  }

  const initData = parse(initDataRaw)
  console.log(`initData: ${JSON.stringify(initData)}`);  const user = initData.user

  if (!user) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Telegram user data is missing in initData',
    })
  }

  const supabase = getSupabaseServerClient()

  /**
   * Expected Supabase schema for profiles:
   * - id: uuid primary key, default gen_random_uuid()
   * - telegram_id: text (or bigint) unique
   * - username: text
   * - first_name: text
   * - last_name: text
   * - photo_url: text
   * - created_at: timestamptz default now()
   * - updated_at: timestamptz default now()
   */
  const { data: profile, error } = await supabase
    .from('profiles')
    .upsert(
      {
        telegram_id: String(user.id),
        username: user.username ?? null,
        first_name: user.first_name ?? null,
        last_name: user.last_name ?? null,
        photo_url: user.photo_url ?? null,
      },
      { onConflict: 'telegram_id' },
    )
    .select('*')
    .single()

  if (error || !profile) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to upsert profile in Supabase',
    })
  }

  return {
    profileId: profile.id,
    telegramUser: {
      id: user.id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      photo_url: user.photo_url,
    },
  }
})

