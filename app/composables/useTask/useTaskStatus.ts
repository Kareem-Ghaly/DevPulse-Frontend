import { useMutation, useQueryClient } from '@tanstack/vue-query'

export function useTaskStatus(projectTeamId: ComputedRef<number>) {
  const api = useApiClient()
  const appToast = useAppToast()
  const queryClient = useQueryClient()

  const { mutate: changeStatusSimple } = useMutation<Task, Error, { taskId: number; status: string }>({
    mutationFn: ({ taskId, status }) =>
      api.request<Task>(`/tasks/${taskId}/status`, {
        method: 'PATCH',
        body: { status },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectTeamId] })
    },
    onError: (err) => {
      appToast.error('Error', err.message || 'Failed to update status')
    },
  })

  const { mutate: changeStatusWithProof } = useMutation<Task, Error, { taskId: number; payload: TaskStatusPayload }>({
    mutationFn: ({ taskId, payload }) => {
      const fd = new FormData()
      fd.append('status', payload.status)
      if (payload.notes) fd.append('notes', payload.notes)
      if (payload.link_url) fd.append('link_url', payload.link_url)
      if (payload.files) {
        payload.files.forEach(file => fd.append('files[]', file))
      }

      return api.request<Task>(`/tasks/${taskId}/status`, {
        method: 'PATCH',
        body: fd,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectTeamId] })
    },
    onError: (err) => {
      appToast.error('Error', err.message || 'Failed to update status with proof')
    },
  })

  return {
    changeStatusSimple,
    changeStatusWithProof,
  }
}