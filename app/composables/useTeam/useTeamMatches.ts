import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'

export function useTeamMatches(projectId: ComputedRef<number>) {
  const api = useApiClient()
  const appToast = useAppToast()
  const queryClient = useQueryClient()

  const searchQuery = ref('')
  const activeFilter = ref<string | null>(null)
  const filterTabs = ['Front-end', 'Back-end', 'Mobile', 'UI/UX Design', 'Data Science', 'DevOps']

  const { data: matchesData, isLoading: isLoadingMatches } = useQuery<MatchesResponse>({
    queryKey: ['matches', projectId],
    queryFn: () => api.request<MatchesResponse>(`/project-ideas/${projectId.value}/matching/students`),
    enabled: () => !!projectId.value,
  })

  const { data: invitationsData } = useQuery<InvitationsListResponse>({
    queryKey: ['my-invitations'],
    queryFn: () => api.request<InvitationsListResponse>('/my-invitations'),
  })

  const sentInvitationReceiverIds = computed<Set<number>>(() => {
    const invitations = invitationsData.value?.data?.invitations ?? []

    return new Set(
      invitations
        .filter(inv => inv.project_idea_id === projectId.value)
        .map(inv => inv.receiver_id),
    )
  })

  const matches = computed<Match[]>(() => matchesData.value?.data?.matches ?? [])

  const filteredMatches = computed<Match[]>(() => {
    let list = matches.value

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      list = list.filter(m =>
        m.student.name.toLowerCase().includes(q)
        || m.student.email.toLowerCase().includes(q)
        || m.matched_skills.some(s => s.toLowerCase().includes(q)),
      )
    }

    if (activeFilter.value) {
      const f = activeFilter.value.toLowerCase()
      list = list.filter(m =>
        m.matched_skills.some(s => s.toLowerCase().includes(f))
        || m.missing_skills.some(s => s.toLowerCase().includes(f)),
      )
    }

    return list
  })

  const pendingInvitations = ref<Set<number>>(new Set())

  const { mutate: sendInvitation } = useMutation<InvitationResponse, Error, InvitationPayload>({
    mutationFn: (payload) =>
      api.request<InvitationResponse>(`/project-ideas/${projectId.value}/invitations`, {
        method: 'POST',
        body: payload,
      }),
    onMutate: (payload) => {
      pendingInvitations.value.add(payload.receiver_id)
    },
    onSuccess: (res) => {
      const receiverId = res.data.invitation.receiver_id
      pendingInvitations.value.delete(receiverId)
      appToast.success('Invitation sent', 'The student has been invited to your project.')
      queryClient.invalidateQueries({ queryKey: ['my-invitations'] })
    },
    onError: (_err, payload) => {
      pendingInvitations.value.delete(payload.receiver_id)
      appToast.error('Error', 'Failed to send invitation. Please try again.')
    },
  })

  const isInvited = (studentId: number): boolean => sentInvitationReceiverIds.value.has(studentId)
  const isSending = (studentId: number): boolean => pendingInvitations.value.has(studentId)

  const toggleFilter = (filter: string) => {
    activeFilter.value = activeFilter.value === filter ? null : filter
  }

  return {
    searchQuery,
    activeFilter,
    filterTabs,
    matches,
    filteredMatches,
    isLoadingMatches,
    sendInvitation,
    isInvited,
    isSending,
    toggleFilter,
  }
}