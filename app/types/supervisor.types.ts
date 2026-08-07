export type ProposalDecisionStatus = 'approved' | 'rejected' | 'changes_requested'

export interface SupervisorProposal {
  proposal:{
    id: number
  project_team_id: number
  supervisor_id: number
  supervisor_user: {
    id: number
    name: string
    email: string
  }
  created_by: number
  created_by_user: {
    id: number
    name: string
    email: string
  } | null
  last_updated_by: number
  title: string
  problem: string | null
  problem_overview: string | null
  comparison_table_with_similar_applications: string | null
  project_users: string | null
  mind_map_problem: string | null
  mind_map_problem_url: string | null
  solution_overview: string | null
  proposed_solution: string | null
  mind_map_solution: string | null
  mind_map_solution_url: string | null
  functional_requirements: string | null
  non_functional_requirements: string | null
  project_management: string | null
  programming_languages: string | null
  supervisor: string | null
  project_teams: string | null
  status: string
  supervisor_notes: string | null
  supervisor_decided_at: string | null
  last_update: string | null
  created_at: string
  updated_at: string
  team: {
    id: number
    status: string
    project_idea: {
      id: number
      title: string
      abstract: string
    }
    leader: {
      id: number
      name: string
      email: string
    }
    members: Array<{
      id: number
      user_id: number
      name: string
      email: string
      role: string
    }>
  }
  last_updater: {
    id: number
    name: string
    username: string | null
    email: string
    email_verified_at: string | null
    provider_name: string | null
    provider_id: string | null
    avatar: string | null
    status: string
    profile_completed: boolean
    last_login_at: string | null
    created_at: string
    updated_at: string
  } | null
  committee_reviews?: Array<Record<string, unknown>>
  }
}

export interface Meeting {
  id: number
  title: string
  description: string | null
  scheduled_at: string
  duration_minutes: number | null
  meeting_link: string | null
  status: string | null
  scheduler_role: string
  project_team_id?: number
}

export interface TaskAttachment {
  id: number
  file_name: string
  file_type: string
  file_size: number
  file_path: string
  file_url: string
  uploaded_by: number
  uploader: {
    id: number
    name: string
    email: string
  }
  created_at: string
}

export interface TaskReview {
  id: number
  review: string
  reviewed_at: string
  supervisor: {
    id: number
    name: string
    email: string
  }
}

export interface Task {
  id: number
  project_team_id: number
  title: string
  description: string | null
  status: 'backlog' | 'todo' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assigned_to: number | null
  assigned_user: {
    id: number
    name: string
    email: string
  } | null
  created_by: number
  creator: {
    id: number
    name: string
    email: string
  }
  due_date: string | null
  completed_at: string | null
  completed_by: number | null
  completion_notes: string | null
  last_update: string | null
  attachments: TaskAttachment[]
  links: Array<Record<string, unknown>>
  latest_review: TaskReview | null
  created_at: string
  updated_at: string
}

export interface TasksResponse {
  tasks: {
    backlog: Task[]
    todo: Task[]
    in_progress: Task[]
    done: Task[]
  }
}

export interface TaskReviewResponse {
  review: TaskReview
  task: Task
  task_summary: {
    id: number
    project_team_id: number
    title: string
    status: string
    priority: string
  }
}

export interface PaginatedResponse<T> {
  status: boolean
  message: string
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface SingleResponse<T> {
  status: boolean
  message: string
  data: T
}

export interface SupervisorProfilePayload {
  full_name: string
  academic_title: string
  department: string
  specialization: string
  office_hours: string
  bio: string
  research_interests: string[]
}

export interface SupervisorProfileResponse {
  id: number
  user_id: number
  full_name: string
  academic_title: string
  department: string
  specialization: string
  office_hours: string
  bio: string
  research_interests: string[]
  created_at: string
  updated_at: string
}