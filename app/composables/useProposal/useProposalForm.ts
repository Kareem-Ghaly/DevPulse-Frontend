import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import type { ComputedRef } from 'vue'

export function useProposalForm(projectId: ComputedRef<number>) {
  const api = useApiClient()
  const appToast = useAppToast()
  const queryClient = useQueryClient()

  const isFormInitialized = ref(false)

  const { data: projectData } = useQuery<SingleProjectResponse>({
    queryKey: ['project-detail', projectId],
    queryFn: () => api.request<SingleProjectResponse>(`/project-ideas/${projectId.value}`),
    enabled: () => projectId.value > 0,
  })

  const project = computed<ProjectIdea | null>(() => projectData.value?.data?.project_idea ?? null)

  const { data: teamData, isLoading: isLoadingTeam } = useQuery({
    queryKey: ['project-team', projectId],
    queryFn: () => api.request(`/project-ideas/${projectId.value}/team`),
    enabled: () => projectId.value > 0,
  })

  const projectTeamId = computed(() => {
    const team = (teamData.value as { data?: { team?: { id: number } } })?.data?.team

    return team?.id ?? null
  })

  const {
    data: proposalData,
    isLoading: isLoadingProposal,
    refetch: refetchProposal,
  } = useQuery<ProposalResponse>({
    queryKey: ['project-proposal-by-team', projectTeamId],
    queryFn: () => api.request<ProposalResponse>(`/project-proposals/team/${projectTeamId.value}`),
    enabled: () => !!projectTeamId.value && projectTeamId.value > 0,
    retry: false,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
  })

  const proposal = computed(() => proposalData.value?.data?.proposal ?? null)

  const form = reactive<ProposalPayload>({
    title: '',
    problem: '',
    problem_overview: '',
    comparison_table_with_similar_applications: '',
    project_users: '',
    mind_map_problem: null,
    solution_overview: '',
    proposed_solution: '',
    mind_map_solution: null,
    functional_requirements: '',
    non_functional_requirements: '',
    project_management: '',
    programming_languages: '',
    supervisor: '',
    project_teams: '',
    status: 'draft',
  })

  const mindMapProblemInput = ref<HTMLInputElement | null>(null)
  const mindMapSolutionInput = ref<HTMLInputElement | null>(null)
  
  const mindMapProblemPreview = ref<string | null>(null)
  const mindMapSolutionPreview = ref<string | null>(null)

  const populateFormFromProposal = (proposalData: ProjectProposal | null): void => {
    if (!proposalData) {
      isFormInitialized.value = false

      return
    }

    form.title = proposalData.title || ''
    form.problem = proposalData.problem || ''
    form.problem_overview = proposalData.problem_overview || ''
    form.comparison_table_with_similar_applications = proposalData.comparison_table_with_similar_applications || ''
    form.project_users = proposalData.project_users || ''
    form.solution_overview = proposalData.solution_overview || ''
    form.proposed_solution = proposalData.proposed_solution || ''
    form.functional_requirements = proposalData.functional_requirements || ''
    form.non_functional_requirements = proposalData.non_functional_requirements || ''
    form.project_management = proposalData.project_management || ''
    form.programming_languages = proposalData.programming_languages || ''
    form.supervisor = String(proposalData.supervisor || '')
    form.project_teams = proposalData.project_teams || ''
    form.status = (proposalData.status as 'draft' | 'submitted') || 'draft'

    const isFreshUrl = (url: string | null) => {
    return url?.startsWith('blob:') || url?.includes('?t=')
  }

    if (!isFreshUrl(mindMapProblemPreview.value)) {
    mindMapProblemPreview.value = proposalData.mind_map_problem_url || null
  }
  if (!isFreshUrl(mindMapSolutionPreview.value)) {
    mindMapSolutionPreview.value = proposalData.mind_map_solution_url || null
  }

  form.mind_map_problem = null
  form.mind_map_solution = null
  if (mindMapProblemInput.value) mindMapProblemInput.value.value = ''
  if (mindMapSolutionInput.value) mindMapSolutionInput.value.value = ''

  isFormInitialized.value = true


    isFormInitialized.value = true
  }

  watch(
    proposalData,
    (newData) => {
      if (newData?.data?.proposal) {
        populateFormFromProposal(newData.data.proposal)
      }
      else if (newData?.data?.proposal === null) {
        isFormInitialized.value = true
      }
    },
    { immediate: false, deep: true },
  )

  watch(
    project,
    (p) => {
      if (p && !isFormInitialized.value && !form.title) {
        form.title = p.title
      }
    },
    { immediate: true },
  )

  const handleMindMapProblem = (event: Event): void => {
    const target = event.target as HTMLInputElement

    if (target.files && target.files[0]) {
      form.mind_map_problem = target.files[0]
      mindMapProblemPreview.value = URL.createObjectURL(target.files[0])
    }
  }

  const handleMindMapSolution = (event: Event): void => {
    const target = event.target as HTMLInputElement

    if (target.files && target.files[0]) {
      form.mind_map_solution = target.files[0]
      mindMapSolutionPreview.value = URL.createObjectURL(target.files[0])
    }
  }

  const clearMindMapProblem = (): void => {
  if (mindMapProblemPreview.value?.startsWith('blob:')) {
    URL.revokeObjectURL(mindMapProblemPreview.value)
  }
  form.value.mind_map_problem = null
  mindMapProblemPreview.value = null
  if (mindMapProblemInput.value) mindMapProblemInput.value.value = ''
}

const clearMindMapSolution = (): void => {
  if (mindMapSolutionPreview.value?.startsWith('blob:')) {
    URL.revokeObjectURL(mindMapSolutionPreview.value)
  }
  form.value.mind_map_solution = null
  mindMapSolutionPreview.value = null
  if (mindMapSolutionInput.value) mindMapSolutionInput.value.value = ''
}

  const buildFormData = (isUpdate = false): FormData => {
    const fd = new FormData()

    if (isUpdate) {
      fd.append('_method', 'PUT')
    }

    if (projectTeamId.value) {
    fd.append('project_team_id', String(projectTeamId.value))
  }

    fd.append('title', form.title)
    fd.append('problem', form.problem || '')
    fd.append('problem_overview', form.problem_overview || '')
    fd.append('comparison_table_with_similar_applications', form.comparison_table_with_similar_applications || '')
    fd.append('project_users', form.project_users || '')

    if (form.mind_map_problem instanceof File) {
      fd.append('mind_map_problem', form.mind_map_problem, form.mind_map_problem.name)
    }

    fd.append('solution_overview', form.solution_overview || '')
    fd.append('proposed_solution', form.proposed_solution || '')

    if (form.mind_map_solution instanceof File) {
      fd.append('mind_map_solution', form.mind_map_solution, form.mind_map_solution.name)
    }

    fd.append('functional_requirements', form.functional_requirements || '')
    fd.append('non_functional_requirements', form.non_functional_requirements || '')
    fd.append('project_management', form.project_management || '')
    fd.append('programming_languages', form.programming_languages || '')
    fd.append('project_teams', form.project_teams || '')
    fd.append('status', form.status)

    return fd
  }

  const { mutate: createProposal, isPending: isCreating } = useMutation<ProposalResponse, ApiError, FormData>({
  mutationFn: async (formData) => {
    return await api.request<ProposalResponse>('/project-proposals', {
      method: 'POST',
      body: formData,
    })
  },
  onSuccess: (res) => {
    appToast.success('Success', res.message || 'Proposal created')
    
    queryClient.setQueryData(
      ['project-proposal-by-team', projectTeamId.value],
      res
    )
    
    if (res.data?.proposal?.mind_map_problem_url) {
      mindMapProblemPreview.value = res.data.proposal.mind_map_problem_url
    }
    if (res.data?.proposal?.mind_map_solution_url) {
      mindMapSolutionPreview.value = res.data.proposal.mind_map_solution_url
    }
  },
  onError: (err: ApiError) => {
    if (err.data?.proposal_id) {
      updateProposal({ id: err.data.proposal_id, formData: buildFormData(true) })
    } else {
      appToast.error('Error', err.message || 'Failed to create')
    }
  },
})

  const { mutate: updateProposal, isPending: isUpdating } = useMutation<ProposalResponse, ApiError, { id: number, formData: FormData }>({
  mutationFn: async ({ id, formData }) => {
    return await api.request<ProposalResponse>(`/project-proposals/${id}`, {
      method: 'POST',
      body: formData,
    })
  },
  onSuccess: (res) => {
    appToast.success('Success', res.message || 'Proposal updated')
    
    queryClient.setQueryData(
      ['project-proposal-by-team', projectTeamId.value],
      res
    )
    
    if (res.data?.proposal?.mind_map_problem_url) {
      const oldBlob = mindMapProblemPreview.value?.startsWith('blob:') ? mindMapProblemPreview.value : null
      mindMapProblemPreview.value = res.data.proposal.mind_map_problem_url
      if (oldBlob) URL.revokeObjectURL(oldBlob)
    }
    if (res.data?.proposal?.mind_map_solution_url) {
      const oldBlob = mindMapSolutionPreview.value?.startsWith('blob:') ? mindMapSolutionPreview.value : null
      mindMapSolutionPreview.value = res.data.proposal.mind_map_solution_url
      if (oldBlob) URL.revokeObjectURL(oldBlob)
    }
  },
  onError: (err: ApiError) => {
    appToast.error('Error', err.message || 'Failed to update')
  },
})

  const isSaving = computed(() => isCreating.value || isUpdating.value)

  const saveProposal = (): void => {
  const currentProposalId = proposal.value?.id

  if (currentProposalId) {
    const formData = buildFormData(true)
    updateProposal({ id: currentProposalId, formData })
  }
  else {
    const formData = buildFormData(false)
    createProposal(formData)
  }
}

  const saveAsDraft = (): void => {
    form.status = 'draft'
    saveProposal()
  }

  const submitProposal = (): void => {
    form.status = 'submitted'
    saveProposal()
  }

  return {
    form,
    project,
    proposal,
    projectTeamId,
    isLoadingProposal,
    isFormInitialized,
    isSaving,
    mindMapProblemInput,
    mindMapSolutionInput,
    mindMapProblemPreview,
    mindMapSolutionPreview,
    handleMindMapProblem,
    handleMindMapSolution,
    clearMindMapProblem,
    clearMindMapSolution,
    saveAsDraft,
    submitProposal,
    refetchProposal,
  }
}