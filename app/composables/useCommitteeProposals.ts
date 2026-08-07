import type { CommitteeProposal, CommitteeDecisionPayload, PaginatedResponse, ApiResponse } from '~/types/committee.types'

export const useCommitteeProposals = () => {
  const api = useApiClient()
  const appToast = useAppToast()

  const proposals = ref<CommitteeProposal[]>([])
  const singleProposal = ref<CommitteeProposal | null>(null)
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  const currentPage = ref(1)
  const lastPage = ref(1)
  const perPage = ref(10)
  const total = ref(0)

  const fetchProposals = async (page: number = 1) => {
    isLoading.value = true
    try {
      const res = await api.request<PaginatedResponse<CommitteeProposal>>(`/committee/project-proposals?page=${page}`)
      proposals.value = res.data || []
      // Safely access meta with fallback
      currentPage.value = res.meta?.current_page ?? 1
      lastPage.value = res.meta?.last_page ?? 1
      perPage.value = res.meta?.per_page ?? 10
      total.value = res.meta?.total ?? 0
    }
    catch (error: unknown) {
      const err = error as { message?: string }
      appToast.error('Error', err.message || 'Failed to load proposals')
      proposals.value = []
      currentPage.value = 1
      lastPage.value = 1
      perPage.value = 10
      total.value = 0
    }
    finally {
      isLoading.value = false
    }
  }

  const fetchProposalById = async (id: number) => {
  isLoading.value = true
  try {
    const res = await api.request<ApiResponse<CommitteeProposal>>(`/project-proposals/${id}`)
    singleProposal.value = (res.data as { proposal?: CommitteeProposal }).proposal ?? res.data
  }
  catch (error: unknown) {
    const err = error as { message?: string }
    appToast.error('Error', err.message || 'Failed to load proposal')
    singleProposal.value = null
  }
  finally {
    isLoading.value = false
  }
}

  const makeDecision = async (proposalId: number, decision: string, notes: string) => {
    isSubmitting.value = true
    try {
      const payload: CommitteeDecisionPayload = { decision: decision as 'approved' | 'rejected' | 'needs_revision', notes }
      const res = await api.request<ApiResponse<{ proposal: CommitteeProposal }>>(`/committee/project-proposals/${proposalId}/decision`, {
        method: 'post',
        body: payload,
      })
      appToast.success('Success', res.message || 'Decision saved successfully')
    }
    catch (error: unknown) {
      const err = error as { message?: string }
      appToast.error('Error', err.message || 'Failed to save decision')
      throw error
    }
    finally {
      isSubmitting.value = false
    }
  }

  return {
    proposals,
    singleProposal,
    isLoading,
    isSubmitting,
    currentPage,
    lastPage,
    perPage,
    total,
    fetchProposals,
    fetchProposalById,
    makeDecision,
  }
}