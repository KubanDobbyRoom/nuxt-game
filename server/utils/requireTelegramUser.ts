import type { H3Event } from 'h3'
import { createError, getHeader } from 'h3'
import { parse, validate } from '@telegram-apps/init-data-node'
import { getSupabaseServerClient } from './supabase'

export interface TelegramUserContext {
  telegramUser: {
    id: number
    username?: string
    first_name?: string
    last_name?: string
    photo_url?: string
  }
  profile: any
}

export const requireTelegramUser = async (
  event: H3Event,
): Promise<TelegramUserContext> => {
  console.log('requireTelegramUser');
  
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
  const user = initData.user

  if (!user) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Telegram user data is missing in initData',
    })
  }

  const supabase = getSupabaseServerClient()

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('telegram_id', String(user.id))
    .maybeSingle()

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to load user profile from Supabase',
    })
  }

  if (!profile) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Profile not found for Telegram user',
    })
  }

  return {
    telegramUser: {
      id: user.id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      photo_url: user.photo_url,
    },
    profile,
  }
}

