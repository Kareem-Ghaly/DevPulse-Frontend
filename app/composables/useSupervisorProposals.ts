import type { SupervisorProposal, ProposalDecisionStatus, PaginatedResponse } from '~/types/supervisor.types'

export const useSupervisorProposals = () => {
  const api = useApiClient()
  const appToast = useAppToast()

  const proposals = ref<SupervisorProposal[]>([])
  const singleProposal = ref<SupervisorProposal | null>(null)
  const isLoading = ref(false)
  const isSubmitting = ref(false)

  const fetchProposals = async () => {
    isLoading.value = true

    try {
      const res = await api.request<PaginatedResponse<SupervisorProposal>>('/supervisor/project-proposals')
      proposals.value = res.data || []
    }
    catch (error: unknown) {
      const err = error as { message?: string }
      appToast.error('Error', err.message || 'Failed to load proposals')
      proposals.value = []
    }
    finally {
      isLoading.value = false
    }
  }

  const fetchProposalById = async (id: number) => {
    isLoading.value = true
    singleProposal.value = null

    try {
      const res = await api.request<SingleResponse<SupervisorProposal>>(`/project-proposals/${id}`)
      singleProposal.value = res.data
    }
    catch (error: unknown) {
      const err = error as { message?: string }
      appToast.error('Error', err.message || 'Failed to load proposal')
    }
    finally {
      isLoading.value = false
    }
  }

  const makeDecision = async (
    proposalId: number,
    status: ProposalDecisionStatus,
    notes: string,
  ): Promise<void> => {
    isSubmitting.value = true

    try {
      await api.request<SingleResponse<SupervisorProposal>>(`/project-proposals/${proposalId}/decision`, {
        method: 'POST',
        body: { status, notes },
      })

      appToast.success('Success', 'Decision saved successfully!')
      await fetchProposals()
    }
    catch (error: unknown) {
      const err = error as { message?: string }
      appToast.error('Error', err.message || 'Failed to save decision')
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
    fetchProposals,
    fetchProposalById,
    makeDecision,
  }
}