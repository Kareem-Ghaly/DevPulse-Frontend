import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import type { ComputedRef } from 'vue'

export interface Task {
  id: number
  title: string
  description?: string
  status: string
  priority?: string
  assigned_to?: number
  assigned_user?: { id: number; name: string }
  due_date?: string
  project_team_id: number
  created_at?: string
  updated_at?: string
  completed_at?: string
  completed_by?: number
  completed_by_user?: { id: number; name: string }
  attachments?: TaskAttachment[]
  links?: TaskLink[]
  completion_notes?: string
}

export interface TaskAttachment {
  id: number
  file_name: string
  file_path: string
  file_type: string
  file_size: number
  task_id: number
  created_at?: string
}

export interface TaskLink {
  id: number
  url: string
  title?: string
  task_id: number
  created_at?: string
}

export interface KanbanColumn {
  id: string
  title: string
  color: string
  tasks: Task[]
}

export interface TasksResponse {
  tasks?: {
    backlog: Task[]
    todo: Task[]
    in_progress: Task[]
    done: Task[]
  }
  backlog?: Task[]
  todo?: Task[]
  in_progress?: Task[]
  done?: Task[]
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface WebSocketTaskEvent {
  type: string
  action?: string
  task?: Task
  task_id?: number
  column_id?: string
  old_column_id?: string
  attachment?: TaskAttachment
  link?: TaskLink
  attachment_id?: number
  link_id?: number
}

export interface CreateTaskPayload {
  title: string
  description?: string
  status: string
  priority?: string
  assigned_to?: number | null
  due_date?: string | null
}

export interface UpdateTaskPayload {
  title?: string
  description?: string
  priority?: string
  assigned_to?: number | null
  due_date?: string | null
}

export interface UpdateStatusPayload {
  status: string
  files?: File[]
  link_url?: string
  notes?: string
}

export interface TeamMemberTaskBoard {
  member:{
    id: number
    name: string
    email: string
    avatar?: string
    role?: string
  }
}

interface UpdateTaskMutationPayload {
  taskId: number
  data: UpdateTaskPayload
}

interface UpdateStatusMutationPayload {
  taskId: number
  status: string
}

interface CompleteTaskMutationPayload {
  taskId: number
  data: UpdateStatusPayload
}

interface UploadAttachmentPayload {
  taskId: number
  files: File[]
}

interface AddLinkPayload {
  taskId: number
  url: string
  title?: string
}


interface TasksQueryData {
  data: TasksResponse
}

interface MembersQueryData {
  data: TeamMemberTaskBoard[]
}

export function useTaskBoard(projectTeamId: ComputedRef<number | null>) {
  const api = useApiClient()
  const queryClient = useQueryClient()
  const appToast = useAppToast()

  const kanbanColumns = ref<KanbanColumn[]>([
    { id: 'backlog', title: 'Backlog', color: 'bg-slate-500', tasks: [] },
    { id: 'todo', title: 'To Do', color: 'bg-blue-500', tasks: [] },
    { id: 'in_progress', title: 'In Progress', color: 'bg-amber-500', tasks: [] },
    { id: 'done', title: 'Done', color: 'bg-emerald-500', tasks: [] },
  ])

  const { data: tasksData, isLoading: isTasksLoading } = useQuery<TasksQueryData>({
    queryKey: ['tasks', projectTeamId],
    queryFn: () => api.request<TasksQueryData>(`/project-teams/${projectTeamId.value}/tasks`),
    enabled: () => !!projectTeamId.value && projectTeamId.value > 0,
  })

  const { data: membersData } = useQuery<MembersQueryData>({
    queryKey: ['team-members', projectTeamId],
    queryFn: () => api.request<MembersQueryData>(`/project-teams/${projectTeamId.value}/members`),
    enabled: () => !!projectTeamId.value && projectTeamId.value > 0,
  })

  watch(
  tasksData,
  (response) => {
    if (!response) {
      
      return
    }

    let taskGroups: { backlog: Task[]; todo: Task[]; in_progress: Task[]; done: Task[] }
    
    if (response.data?.tasks && typeof response.data.tasks === 'object') {
      taskGroups = response.data.tasks
    } else if (response.data && typeof response.data === 'object') {
      taskGroups = response.data as unknown as typeof taskGroups
    } else {
      taskGroups = { backlog: [], todo: [], in_progress: [], done: [] }
    }

    kanbanColumns.value.forEach((col) => {
      const tasks = taskGroups[col.id as keyof typeof taskGroups]
      if (Array.isArray(tasks)) {
        col.tasks = tasks
      } else {
        col.tasks = []
      }
    })
  },
  { immediate: true, deep: true }
)

  const { mutate: createTaskMutation, isPending: isCreating } = useMutation({
    mutationFn: (taskData: CreateTaskPayload) =>
      api.request<ApiResponse<Task>>(`/project-teams/${projectTeamId.value}/tasks`, {
        method: 'POST',
        body: taskData,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectTeamId] })
      appToast.success('Success', 'Task created successfully')
    },
    onError: (error: Error) => {
      appToast.error('Error', error.message || 'Failed to create task')
    },
  })

  const { mutate: updateTaskMutation } = useMutation({
    mutationFn: (payload: UpdateTaskMutationPayload) =>
      api.request<ApiResponse<Task>>(`/tasks/${payload.taskId}`, {
        method: 'PUT',
        body: payload.data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectTeamId] })
      appToast.success('Success', 'Task updated successfully')
    },
    onError: (error: Error) => {
      appToast.error('Error', error.message || 'Failed to update task')
    },
  })

  const { mutate: updateStatusMutation, isPending: isUpdatingStatus } = useMutation({
  mutationFn: (payload: UpdateStatusMutationPayload) =>
    api.request<ApiResponse<Task>>(`/tasks/${payload.taskId}/status`, {
      method: 'PATCH',
      body: { status: payload.status },
    }),
  onMutate: async (payload: UpdateStatusMutationPayload) => {
    await queryClient.cancelQueries({ queryKey: ['tasks', projectTeamId] })
    const previousData = queryClient.getQueryData<TasksQueryData>(['tasks', projectTeamId])

    queryClient.setQueryData<TasksQueryData>(['tasks', projectTeamId], (old) => {
      if (!old?.data) return old

      let taskGroups: TasksResponse
      
      if ('tasks' in old.data && old.data.tasks && typeof old.data.tasks === 'object') {
        taskGroups = old.data.tasks as TasksResponse
      } else {
        taskGroups = old.data as unknown as TasksResponse
      }

      const newData = {
        backlog: Array.isArray(taskGroups.backlog) ? [...taskGroups.backlog] : [],
        todo: Array.isArray(taskGroups.todo) ? [...taskGroups.todo] : [],
        in_progress: Array.isArray(taskGroups.in_progress) ? [...taskGroups.in_progress] : [],
        done: Array.isArray(taskGroups.done) ? [...taskGroups.done] : [],
      }

      let taskToMove: Task | undefined
      ;(Object.keys(newData) as Array<keyof TasksResponse>).forEach((key) => {
        const foundTask = newData[key].find((t: Task) => t.id === payload.taskId)
        if (foundTask) {
          taskToMove = foundTask
        }
        newData[key] = newData[key].filter((t: Task) => t.id !== payload.taskId)
      })

      if (taskToMove) {
        const targetKey = payload.status as keyof TasksResponse
        newData[targetKey] = [...newData[targetKey], { ...taskToMove, status: payload.status }]
      }

      if ('tasks' in old.data && old.data.tasks) {
        return { ...old, data: { ...old.data, tasks: newData } }
      }
      
      return { ...old, data: newData }
    })

    return { previousData }
  },
  onError: (error: Error, payload: UpdateStatusMutationPayload, context: { previousData?: TasksQueryData } | undefined) => {
    if (context?.previousData) {
      queryClient.setQueryData(['tasks', projectTeamId], context.previousData)
    }
    appToast.error('Error', error.message || 'Failed to update status')
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['tasks', projectTeamId] })
  },
})

 const { mutate: completeTaskMutation, isPending: isCompleting } = useMutation({
  mutationFn: (payload: CompleteTaskMutationPayload) => {
    const formData = new FormData()
    formData.append('_method', 'PATCH')

    formData.append('status', payload.data.status)
    if (payload.data.notes) formData.append('notes', payload.data.notes)
    if (payload.data.link_url) formData.append('link_url', payload.data.link_url)
    if (payload.data.files) {
      payload.data.files.forEach((file) => formData.append('files[]', file))
    }

    return api.request<ApiResponse<Task>>(`/tasks/${payload.taskId}/status`, {
      method: 'POST',
      body: formData,
    })
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['tasks', projectTeamId] })
    appToast.success('Success', 'Task status updated')
  },
  onError: (error: Error) => {
    appToast.error('Error', error.message || 'Failed to update status')
  },
})

  const { mutate: deleteTaskMutation } = useMutation({
    mutationFn: (taskId: number) =>
      api.request(`/tasks/${taskId}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectTeamId] })
      appToast.success('Success', 'Task deleted')
    },
    onError: (error: Error) => {
      appToast.error('Error', error.message || 'Failed to delete task')
    },
  })

  const { mutate: uploadAttachmentMutation } = useMutation({
    mutationFn: (payload: UploadAttachmentPayload) => {
      const formData = new FormData()
      payload.files.forEach((file) => formData.append('files[]', file))

      return api.request<ApiResponse<TaskAttachment[]>>(`/tasks/${payload.taskId}/attachments`, {
        method: 'POST',
        body: formData,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectTeamId] })
      appToast.success('Success', 'Attachment uploaded')
    },
  })

  const { mutate: deleteAttachmentMutation } = useMutation({
    mutationFn: (attachmentId: number) =>
      api.request(`/task-attachments/${attachmentId}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectTeamId] })
      appToast.success('Success', 'Attachment deleted')
    },
  })

  const { mutate: addLinkMutation } = useMutation({
    mutationFn: (payload: AddLinkPayload) =>
      api.request<ApiResponse<TaskLink>>(`/tasks/${payload.taskId}/links`, {
        method: 'POST',
        body: { url: payload.url, title: payload.title },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectTeamId] })
      appToast.success('Success', 'Link added')
    },
  })

  const { mutate: deleteLinkMutation } = useMutation({
    mutationFn: (linkId: number) =>
      api.request(`/task-links/${linkId}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectTeamId] })
      appToast.success('Success', 'Link deleted')
    },
  })

  const findTaskInColumns = (taskId: number): Task | undefined => {
    for (const col of kanbanColumns.value) {
      const task = col.tasks.find((t) => t.id === taskId)
      if (task) return task
    }

    return undefined
  }

  const createTask = (taskData: CreateTaskPayload): void => {
    createTaskMutation(taskData)
  }

  const updateTask = (taskId: number, data: UpdateTaskPayload): void => {
    updateTaskMutation({ taskId, data })
  }

  const updateTaskStatus = (taskId: number, status: string): void => {
    updateStatusMutation({ taskId, status })
  }

  const completeTask = (taskId: number, data: UpdateStatusPayload): void => {
    completeTaskMutation({ taskId, data })
  }

  const deleteTask = (taskId: number): void => {
    deleteTaskMutation(taskId)
  }

  const uploadAttachment = (taskId: number, files: File[]): void => {
    uploadAttachmentMutation({ taskId, files })
  }

  const deleteAttachment = (attachmentId: number): void => {
    deleteAttachmentMutation(attachmentId)
  }

  const addLink = (taskId: number, url: string, title?: string): void => {
    addLinkMutation({ taskId, url, title })
  }

  const deleteLink = (linkId: number): void => {
    deleteLinkMutation(linkId)
  }

  const handleWebSocketEvent = (event: WebSocketTaskEvent): void => {
    if (!event?.action) return

    const validActions = [
      'task_created',
      'task_updated',
      'task_status_changed',
      'task_completed',
      'task_deleted',
      'attachment_added',
      'attachment_deleted',
      'link_added',
      'link_deleted',
    ]

    if (validActions.includes(event.action)) {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectTeamId] })
    }
  }

  const teamMembers = computed((): TeamMemberTaskBoard[] => {
    return membersData.value?.data ?? []
  })

  return {
    kanbanColumns,
    teamMembers,
    isTasksLoading,
    isCreating,
    isUpdatingStatus,
    isCompleting,
    createTask,
    updateTask,
    updateTaskStatus,
    completeTask,
    deleteTask,
    uploadAttachment,
    deleteAttachment,
    addLink,
    deleteLink,
    handleWebSocketEvent,
    findTaskInColumns,
  }
}