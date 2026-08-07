import { ref } from 'vue'
import type { Announcement, PaginationMeta, AnnouncementsResponse } from '~/types/announcement' // قم بتعديل المسار حسب مشروعك

export const useAnnouncements = () => {
  const api = useApiClient()
  const appToast = useAppToast()
  
  const announcements = ref<Announcement[]>([])
  const meta = ref<PaginationMeta | null>(null)
  const isLoading = ref<boolean>(false)
  const isSubmitting = ref<boolean>(false)

  const fetchAnnouncements = async (page = 1): Promise<void> => {
    isLoading.value = true
    try {
      const res = await api.request<AnnouncementsResponse>(`/announcements?page=${page}`)
      
      announcements.value = res.data || []
      meta.value = res.meta || null
    } finally {
      isLoading.value = false
    }
  }

  const createAnnouncement = async (data: { title: string; body: string }): Promise<void> => {
    isSubmitting.value = true
    try {
      await api.request('/announcements', { method: 'POST', body: data })
      appToast.success('Success', 'Announcement published')
      await fetchAnnouncements()
    } catch (e) {
      appToast.error('Error', 'Failed to publish')
    } finally {
      isSubmitting.value = false
    }
  }

  return { announcements, meta, isLoading, isSubmitting, fetchAnnouncements, createAnnouncement }
}