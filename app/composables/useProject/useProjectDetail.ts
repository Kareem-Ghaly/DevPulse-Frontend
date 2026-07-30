import { useQuery } from '@tanstack/vue-query'

export function useProjectDetail(projectId: ComputedRef<number>) {
  const api = useApiClient()

  const { data: projectData, isLoading: isLoadingProject } = useQuery<SingleProjectResponse>({
    queryKey: ['project-detail', projectId],
    queryFn: () => api.request<SingleProjectResponse>(`/project-ideas/${projectId.value}`),
    enabled: () => !!projectId.value,
  })

  const project = computed<ProjectIdea | null>(() => projectData.value?.data?.project_idea ?? null)

  return {
    project,
    isLoadingProject,
  }
}