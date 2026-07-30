export interface Task {
  id: number
  title: string
  description?: string
  status: 'backlog' | 'todo' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  assigned_to?: number
  assigned_user?: {
    id: number
    name: string
    avatar?: string
  }
  due_date?: string
  project_team_id: number
  created_at?: string
  updated_at?: string
  completed_at?: string
  completed_by?: number
  completed_by_user?: {
    id: number
    name: string
  }
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

export interface UpdateTaskStatusPayload {
  status: string
  files?: File[]
  link_url?: string
  notes?: string
}


export interface WebSocketTaskEvent {
  action: string
  task?: Task
  task_id?: number
  column_id?: string
  old_column_id?: string
  attachment?: TaskAttachment
  link?: TaskLink
  attachment_id?: number
  link_id?: number
}