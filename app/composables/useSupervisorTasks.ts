import type { Task, TasksResponse, TaskReviewResponse, SingleResponse } from '~/types/supervisor.types'

export const useSupervisorTasks = (teamId: MaybeRef<string | number>) => {
  const api = useApiClient()
  const appToast = useAppToast()

  const tasks = ref<Task[]>([])
  const isLoading = ref(false)
  const isSubmitting = ref(false)

  const fetchTasks = async () => {
    const id = unref(teamId)
    if (!id) return

    isLoading.value = true

    try {
      const res = await api.request<SingleResponse<TasksResponse>>(`/supervisor/proposals/${id}/tasks`)
      const data = res.data?.tasks

      if (data) {
        tasks.value = [
          ...data.backlog,
          ...data.todo,
          ...data.in_progress,
          ...data.done,
        ]
      }
      else {
        tasks.value = []
      }
    }
    catch (error: unknown) {
      const err = error as { message?: string }
      appToast.error('Error', err.message || 'Failed to load tasks')
      tasks.value = []
    }
    finally {
      isLoading.value = false
    }
  }

  const reviewTask = async (taskId: number, review: string): Promise<void> => {
    isSubmitting.value = true

    try {
      const res = await api.request<SingleResponse<TaskReviewResponse>>(`/supervisor/tasks/${taskId}/review`, {
        method: 'POST',
        body: { review },
      })

      appToast.success('Success', 'Task review saved successfully!')

      const updatedTask = res.data?.task
      if (updatedTask) {
        const index = tasks.value.findIndex(t => t.id === taskId)
        if (index !== -1) {
          tasks.value[index] = updatedTask
        }
      }
    }
    catch (error: unknown) {
      const err = error as { message?: string }
      appToast.error('Error', err.message || 'Failed to save review')
    }
    finally {
      isSubmitting.value = false
    }
  }

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.value.filter(t => t.status === status)
  }

  return {
    tasks,
    isLoading,
    isSubmitting,
    fetchTasks,
    reviewTask,
    getTasksByStatus,
  }
}