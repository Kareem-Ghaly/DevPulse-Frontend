import type { SupervisorProfilePayload, SupervisorProfileResponse } from '~/types/supervisor.types'

export const useSupervisorProfile = () => {
  const api = useApiClient()
  const appToast = useAppToast()
  const authStore = useAuthStore()

  const isLoading = ref(false)

  const completeProfile = async (payload: SupervisorProfilePayload): Promise<void> => {
    isLoading.value = true

    try {
      const response = await api.request<SupervisorProfileResponse>('/profile/supervisor/complete', {
        method: 'put',
        body: payload,
      })

      if (response.status && response.data?.user) {
        authStore.setAuth({
          token: authStore.token,
          user: response.data.user,
          role: response.data.user.role,
        })

        appToast.success('Success', response.message || 'Profile completed successfully')
        await navigateTo('/supervisor/home')
      }
    }
    catch (error: unknown) {
      const err = error as { message?: string }
      appToast.error('Error', err.message || 'Failed to complete profile')
    }
    finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    completeProfile,
  }
}