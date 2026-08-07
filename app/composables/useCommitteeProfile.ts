import type { CommitteeProfilePayload, CommitteeProfileResponse } from '~/types/committee.types'

export const useCommitteeProfile = () => {
  const api = useApiClient()
  const appToast = useAppToast()
  const authStore = useAuthStore()

  const isLoading = ref(false)

  const completeProfile = async (payload: CommitteeProfilePayload): Promise<void> => {
    isLoading.value = true

    try {
      const response = await api.request<CommitteeProfileResponse>('/profile/committee-member/complete', {
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
        await navigateTo('/committee/proposals')
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