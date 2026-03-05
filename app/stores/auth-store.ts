import { defineStore } from 'pinia'
import { ref } from 'vue'
import { retrieveRawInitData } from '@tma.js/sdk'
import { useNuxtApp } from '#app'

interface TelegramUser {
  id: number
  username?: string
  first_name?: string
  last_name?: string
  photo_url?: string
}

export const useAuthStore = defineStore('auth', () => {
  const initDataRaw = ref<string | null>(null)
  const telegramUser = ref<TelegramUser | null>(null)
  const profileId = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isTelegramEnv = ref(false)

  const loginWithTelegram = async (): Promise<boolean> => {
    if (isLoading.value) return false

    isLoading.value = true
    error.value = null

    try {
      let raw: string | null = null

      try {
        raw = retrieveRawInitData() ?? null
      } catch {
        raw = null
      }

      if (!raw) {
        // Обычный браузер: просто выходим, игра работает локально без Supabase
        return false
      }

      isTelegramEnv.value = true
      initDataRaw.value = raw

      const { $fetch } = useNuxtApp() as unknown as {
        $fetch: <T>(url: string, init?: { method?: string; headers?: Record<string, string> }) => Promise<T>
      }

      const data = await $fetch<{
        profileId: string
        telegramUser: TelegramUser
      }>('/api/auth/telegram', {
        method: 'POST',
        headers: {
          Authorization: `tma ${raw}`,
        },
      })

      profileId.value = data.profileId
      telegramUser.value = data.telegramUser
      return true
    } catch {
      error.value = 'Не удалось выполнить авторизацию через Telegram'
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    initDataRaw,
    telegramUser,
    profileId,
    isLoading,
    error,
    isTelegramEnv,
    loginWithTelegram,
  }
})

