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
      localStorage.setItem('user_id', authData.user.id)
      localStorage.setItem('email', authData.user.email)
      localStorage.setItem('role', authData.user.role)
    }
  }

  const logout = async () => {
    token.value = null
    user.value = null
    role.value = null
    
    if (import.meta.client) {
      localStorage.removeItem('devpulse_vault_token')
      localStorage.removeItem('user_id')
      localStorage.removeItem('email')
      localStorage.removeItem('role')
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