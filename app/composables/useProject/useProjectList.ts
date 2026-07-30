import { useQuery } from '@tanstack/vue-query'

export function useProjectList() {
  const api = useApiClient()

  const { data: projectsData, isLoading: isLoadingProjects } = useQuery<MyProjectsResponse>({
    queryKey: ['my-projects'],
    queryFn: () => api.request<MyProjectsResponse>('/my-projects'),
  })

  const projects = computed<ProjectIdea[]>(() => projectsData.value?.data?.projects ?? [])

  const publishedCount = computed(() => projects.value.filter((p: ProjectIdea) => p.status === 'published').length)
  const formingCount = computed(() => projects.value.filter((p: ProjectIdea) => p.status === 'forming').length)
  const completedCount = computed(() => projects.value.filter((p: ProjectIdea) => p.status === 'team_completed').length)

  return {
    projects,
    isLoadingProjects,
    publishedCount,
    formingCount,
    completedCount,
  }
}
