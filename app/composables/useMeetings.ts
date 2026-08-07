import type { ComputedRef } from 'vue'
import type { Meeting, SingleResponse, PaginatedResponse } from '~/types/supervisor.types'

export const useMeetings = (projectTeamId: ComputedRef<number | null>) => {
  const api = useApiClient()
  const appToast = useAppToast()

  const meetings = ref<Meeting[]>([])
  const singleMeeting = ref<Meeting | null>(null)
  const isLoading = ref(false)
  const isSubmitting = ref(false)

  const fetchMeetings = async () => {
    if (!projectTeamId.value) {
      return
    }

    isLoading.value = true

    try {
      const res = await api.request<PaginatedResponse<Meeting>>(`/project-teams/${projectTeamId.value}/meetings`)
      meetings.value = res.data || []
    }
    catch (error: unknown) {
      const err = error as { message?: string }
      appToast.error('Error', err.message || 'Failed to load meetings')
    }
    finally {
      isLoading.value = false
    }
  }

  const fetchMeetingById = async (id: number) => {
    isLoading.value = true
    singleMeeting.value = null

    try {
      const res = await api.request<SingleResponse<Meeting>>(`/meetings/${id}`)
      singleMeeting.value = res.data
    }
    catch (error: unknown) {
      const err = error as { message?: string }
      appToast.error('Error', err.message || 'Failed to load meeting')
    }
    finally {
      isLoading.value = false
    }
  }

  const scheduleMeeting = async (data: {
    title: string
    description?: string
    scheduled_at: string
    duration_minutes?: number
  }) => {
    if (!projectTeamId.value) {
      appToast.error('Error', 'No project team selected.')

      return
    }

    isSubmitting.value = true

    try {
      await api.request<SingleResponse<Meeting>>('/meetings', {
        method: 'POST',
        body: {
          project_team_id: projectTeamId.value,
          ...data,
        },
      })

      appToast.success('Success', 'Meeting scheduled successfully!')
      await fetchMeetings()
    }
    catch (error: unknown) {
      const err = error as { message?: string }
      appToast.error('Error', err.message || 'Failed to schedule meeting')
    }
    finally {
      isSubmitting.value = false
    }
  }

  return {
    meetings,
    singleMeeting,
    isLoading,
    isSubmitting,
    fetchMeetings,
    fetchMeetingById,
    scheduleMeeting,
  }
}