import type { AnnouncementPayload, Announcement, ApiResponse } from '~/types/committee.types'

export const useCommitteeAnnouncements = () => {
  const api = useApiClient()
  const appToast = useAppToast()

  const isLoading = ref(false)

  const publishAnnouncement = async (payload: AnnouncementPayload): Promise<Announcement | null> => {
    isLoading.value = true
    try {
      const res = await api.request<ApiResponse<Announcement>>('/announcements', {
        method: 'post',
        body: payload,
      })
      appToast.success('Success', res.message || 'Announcement published successfully')

      return res.data
    }
    catch (error: unknown) {
      const err = error as { message?: string }
      appToast.error('Error', err.message || 'Failed to publish announcement')
      
      return null
    }
    finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    publishAnnouncement,
  }
}