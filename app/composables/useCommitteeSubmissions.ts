import type { FinalSubmission, GradePayload, PaginatedResponse, ApiResponse } from '~/types/committee.types'

export const useCommitteeSubmissions = () => {
  const api = useApiClient()
  const appToast = useAppToast()

  const submissions = ref<FinalSubmission[]>([])
  const singleSubmission = ref<FinalSubmission | null>(null)
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  const currentPage = ref(1)
  const lastPage = ref(1)

  const fetchSubmissions = async (page: number = 1) => {
    isLoading.value = true
    try {
      const res = await api.request<PaginatedResponse<FinalSubmission>>(`/final-submissions?page=${page}`)
      submissions.value = res.data || []
      currentPage.value = res.meta.current_page
      lastPage.value = res.meta.last_page
    }
    catch (error: unknown) {
      const err = error as { message?: string }
      appToast.error('Error', err.message || 'Failed to load submissions')
      submissions.value = []
    }
    finally {
      isLoading.value = false
    }
  }

  const fetchSubmissionById = async (id: number) => {
  isLoading.value = true
  try {
    const res = await api.request<ApiResponse<FinalSubmission>>(`/final-submissions/${id}`)
    singleSubmission.value = res.data
  }
  catch (error: unknown) {
    const err = error as { message?: string }
    appToast.error('Error', err.message || 'Failed to load submission')
    singleSubmission.value = null
  }
  finally {
    isLoading.value = false
  }
}

  const gradeSubmission = async (submissionId: number, payload: GradePayload) => {
    isSubmitting.value = true
    try {
      const res = await api.request<ApiResponse<FinalSubmission>>(`/final-submissions/${submissionId}/grade`, {
        method: 'post',
        body: payload,
      })
      appToast.success('Success', res.message || 'Graded successfully')
      
      return res.data
    }
    catch (error: unknown) {
      const err = error as { message?: string }
      appToast.error('Error', err.message || 'Failed to grade submission')
      throw error
    }
    finally {
      isSubmitting.value = false
    }
  }

  return {
    submissions,
    singleSubmission,
    isLoading,
    isSubmitting,
    currentPage,
    lastPage,
    fetchSubmissions,
    fetchSubmissionById,
    gradeSubmission,
  }
}