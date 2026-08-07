import type { ApiResponse, PaginatedResponse, SupervisorProposal } from '~/types/supervisor.types'

export const useSupervisorApprovedProposals = () => {
  const api = useApiClient()
  const appToast = useAppToast()

  const proposals = ref<SupervisorProposal[]>([])
  const isLoading = ref(false)
  const currentPage = ref(1)
  const lastPage = ref(1)
  const total = ref(0)

  const fetchApprovedProposals = async (page: number = 1): Promise<void> => {
    isLoading.value = true

    try {
      const res = await api.request<PaginatedResponse<SupervisorProposal>>(`/supervisor/approved-proposals?page=${page}`)
      proposals.value = res.data || []
      currentPage.value = res.meta.current_page
      lastPage.value = res.meta.last_page
      total.value = res.meta.total
    }
    catch (error: unknown) {
      const err = error as { message?: string }
      appToast.error('Error', err.message || 'Failed to load approved proposals')
      proposals.value = []
    }
    finally {
      isLoading.value = false
    }
  }

  return {
    proposals,
    isLoading,
    currentPage,
    lastPage,
    total,
    fetchApprovedProposals,
  }
}