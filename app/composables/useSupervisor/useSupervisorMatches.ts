import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import type { ComputedRef } from 'vue'

export function useSupervisorMatches(
  projectId: ComputedRef<number>,
  proposalId: ComputedRef<number | null>,
  proposalStatus: ComputedRef<string | undefined>
) {
  const api = useApiClient()
  const appToast = useAppToast()
  const queryClient = useQueryClient()

  const selectedSupervisor = ref<number | null>(null)
  const canSubmitToCommittee = computed(() => proposalStatus.value === 'supervisor_approved')

  const { data: rawResponse, isLoading: isLoadingMatches } = useQuery({
    queryKey: ['supervisor-matches', projectId],
    queryFn: async () => {
      const res = await api.request(`/project-ideas/${projectId.value}/matching/supervisors`)

      return res?.data ?? res
    },
    enabled: () => projectId.value > 0,
  })

  const supervisors = computed(() => {
    const payload = rawResponse.value
    if (!payload) return []
    const list = payload.data?.data ?? payload.data ?? payload
    
    return Array.isArray(list) ? list.filter(Boolean) : []
  })

  const { mutate: submitToSupervisor, isPending: isSubmittingSupervisor } = useMutation({
    mutationFn: async (supervisorId: number) => {
      if (!proposalId.value) throw new Error('No proposal found')

      return await api.request(
        `/project-proposals/${proposalId.value}/submit`,
        {
          method: 'POST',
          body: { supervisor_id: supervisorId },
        }
      )
    },
    onSuccess: (res: any) => {
      appToast.success('Success', res?.message || 'Submitted to supervisor successfully')
      queryClient.invalidateQueries({ queryKey: ['project-proposal-by-team'] })
    },
    onError: (err: any) => {
      appToast.error('Error', err?.message || 'Failed to submit to supervisor')
    },
  })

  const handleSelectSupervisor = (supervisorId: number) => {
    selectedSupervisor.value = supervisorId
    submitToSupervisor(supervisorId)
  }

  const { mutate: submitToCommittee, isPending: isSubmittingCommittee } = useMutation({
    mutationFn: async () => {
      if (!proposalId.value) throw new Error('No proposal found')

      return await api.request(
        `/project-proposals/${proposalId.value}/submit-to-committee`,
        { method: 'POST' }
      )
    },
    onSuccess: (res: any) => {
      appToast.success('Success', res?.message || 'Submitted to committee')
      queryClient.invalidateQueries({ queryKey: ['project-proposal-by-team'] })
    },
    onError: (err: any) => {
      appToast.error('Error', err?.message || 'Failed to submit to committee')
    },
  })

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