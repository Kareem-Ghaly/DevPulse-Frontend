import { ref } from 'vue'
import type { ComputedRef } from 'vue'

interface ApiResponse {
  data: FinalSubmissionData
}

export const useFinalSubmission = (projectTeamId: ComputedRef<number | null>) => {
  const api = useApiClient()
  const appToast = useAppToast()

  const submission = ref<FinalSubmissionData | null>(null)
  const isLoading = ref<boolean>(false)
  const isSubmitting = ref<boolean>(false)

  const fetchSubmission = async (): Promise<FinalSubmissionData | null> => {
    if (!projectTeamId.value) {
      return null
    }

    isLoading.value = true

    try {
      const res = await api.request<ApiResponse>(`/final-submissions/team/${projectTeamId.value}`)
      submission.value = res.data

      return res.data
    }
    catch (error: unknown) {
      const err = error as { message?: string }
      appToast.error('Error', err.message || 'Failed to load submission')

      return null
    }
    finally {
      isLoading.value = false
    }
  }

  const submit = async (data: {
    proposal_drive_link?: string
    presentation_drive_link?: string
    code_drive_link?: string
    student_notes?: string
  }): Promise<void> => {
    if (!projectTeamId.value) {
      appToast.error('Error', 'No project team selected.')

      return
    }

    isSubmitting.value = true

    try {
      const res = await api.request<ApiResponse>('/final-submissions', {
        method: 'POST',
        body: {
          project_team_id: projectTeamId.value,
          ...data,
        },
      })

      submission.value = res.data
      appToast.success('Success', 'Final submission sent!')
    }
    catch (error: unknown) {
      const err = error as { message?: string }
      appToast.error('Error', err.message || 'Failed to submit')
    }
    finally {
      isSubmitting.value = false
    }
  }

  return {
    submission,
    isLoading,
    isSubmitting,
    fetchSubmission,
    submit,
  }
}