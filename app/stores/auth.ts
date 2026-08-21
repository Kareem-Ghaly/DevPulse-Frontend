import { defineStore } from 'pinia'
import type { UserProfile } from '~/types/auth'

export const useAuthStore = defineStore('auth', () => {

  const token = useCookie<string | undefined>('devpulse_vault_token', {
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    secure: true,
    sameSite: 'lax',
    httpOnly: false,
  })

  const user = ref<UserProfile | null>(null)
  const role = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  const setAuth = (authData: { token: string; user: UserProfile; role: string }) => {
    token.value = authData.token
    role.value = authData.role || null
    user.value = authData.user
  }

  const logout = async () => {
    token.value = undefined
    user.value = null
    role.value = null
  }

  return {
    user,
    token,
    role,
    isAuthenticated,
    setAuth,
    logout
  }
})