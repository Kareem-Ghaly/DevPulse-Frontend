import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import type { ComputedRef, Ref } from 'vue'

export function useSupervisorMatches(
  projectId: ComputedRef<number>, 
  proposalId: ComputedRef<number | null>,
  proposalStatus: ComputedRef<string | undefined>
) {
  const api = useApiClient()
  const appToast = useAppToast()
  const queryClient = useQueryClient()
  const router = useRouter()

  const selectedSupervisor = ref<number | null>(null)

  const canSubmitToCommittee = computed(() => proposalStatus.value === 'supervisor_approved')

  const { data: matchesData, isLoading: isLoadingMatches } = useQuery<SupervisorMatchResponse>({
    queryKey: ['supervisor-matches', projectId],
    queryFn: () => api.request<SupervisorMatchResponse>(`/project-ideas/${projectId.value}/matching/supervisors`),
    enabled: () => projectId.value > 0,
  })

  const supervisors = computed<SupervisorMatch[]>(() => matchesData.value?.data?.data || [])

  const { mutate: submitToSupervisor, isPending: isSubmittingSupervisor } = useMutation<
    SubmitProposalResponse, 
    Error, 
    number
  >({
    mutationFn: async (supervisorId: number) => {
      if (!proposalId.value) throw new Error('No proposal found')

      return await api.request<SubmitProposalResponse>(
        `/project-proposals/${proposalId.value}/submit`, 
        { method: 'POST', body: { supervisor_id: supervisorId } }
      )
    },
    onSuccess: (res) => {
      appToast.success('Success', res.message || 'Submitted to supervisor')
      queryClient.invalidateQueries({ queryKey: ['project-proposal-by-team'] })
    },
    onError: (err) => {
      appToast.error('Error', err.message || 'Failed to submit')
    },
  })

  const { mutate: submitToCommittee, isPending: isSubmittingCommittee } = useMutation<
    SubmitProposalResponse,
    Error
  >({
    mutationFn: async () => {
      if (!proposalId.value) throw new Error('No proposal found')

      return await api.request<SubmitProposalResponse>(
        `/project-proposals/${proposalId.value}/submit-to-committee`,
        { method: 'POST' }
      )
    },
    onSuccess: (res) => {
      appToast.success('Success', res.message || 'Submitted to committee')
      queryClient.invalidateQueries({ queryKey: ['project-proposal-by-team'] })
    },
    onError: (err) => {
      appToast.error('Error', err.message || 'Failed to submit to committee')
    },
  })

  const handleSelectSupervisor = (supervisorId: number) => {
    selectedSupervisor.value = supervisorId
    submitToSupervisor(supervisorId)
  }

  return {
    supervisors,
    isLoadingMatches,
    isSubmittingSupervisor,
    isSubmittingCommittee,
    canSubmitToCommittee,
    selectedSupervisor,
    handleSelectSupervisor,
    submitToCommittee,
  }
}