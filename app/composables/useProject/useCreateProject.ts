import { useMutation } from '@tanstack/vue-query'

export function useCreateProject() {
  const api = useApiClient()
  const appToast = useAppToast()
  const router = useRouter()

  const { mutate: createProject, isPending } = useMutation<ProjectIdeaResponse, Error, ProjectIdeaPayload>({
    mutationFn: async (payload) => {
      return await api.request<ProjectIdeaResponse>('/project-ideas', {
        method: 'POST',
        body: payload,
      })
    },
    onSuccess: (res) => {
      appToast.success('Success', res.message)
      router.push(`/student/team-builder/${res.data.project_idea.id}`)
    },
  })

  return {
    createProject,
    isPending,
  }
}