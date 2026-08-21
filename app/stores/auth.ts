import { defineStore } from 'pinia'
import type { UserProfile } from '~/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | undefined>(undefined)
  const user = useState<UserProfile | null>('auth_user', () => null)
  const role = useState<string | null>('auth_role', () => null)

  if (import.meta.client) {
    const cookieToken = useCookie<string | undefined>('devpulse_vault_token', {
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
      secure: true,
      sameSite: 'lax',
      httpOnly: false,
    })

    token.value = cookieToken.value

    watch(token, (newVal) => {
      cookieToken.value = newVal
    })
  }

  const isAuthenticated = computed(() => !!token.value)

  const setAuth = (authData: { token: string; user: UserProfile; role: string }) => {
    token.value = authData.token
    role.value = authData.role || authData.user?.role || null
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