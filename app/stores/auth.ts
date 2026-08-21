import { defineStore } from 'pinia'
import type { UserProfile } from '~/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const user = ref<UserProfile | null>(null)
  const role = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  const setAuth = (authData: { token: string; user: UserProfile; role: string }) => {
    token.value = authData.token
    role.value = authData.role || null
    user.value = authData.user
    
    if (import.meta.client) {
      localStorage.setItem('devpulse_vault_token', authData.token)
    }
  }

  const logout = async () => {
    token.value = null
    user.value = null
    role.value = null
    
    if (import.meta.client) {
      localStorage.removeItem('devpulse_vault_token')
    }
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