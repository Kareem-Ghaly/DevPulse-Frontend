export interface CommitteeProfile {
  full_name: string
  academic_title: string
  department: string
  specialization: string
  bio: string
}

export interface CommitteeProfilePayload {
  full_name: string
  academic_title: string
  department: string
  specialization: string
  bio: string
}

export interface CommitteeProfileResponse {
  status: boolean
  message: string
  data: {
    user: {
      id: number
      name: string
      username: string | null
      email: string
      role: string
      status: string
      profile_completed: boolean
      profile: CommitteeProfile
      last_login_at: string
      created_at: string
    }
  }
}

export interface CommitteeProposal {
  id: number
  project_team_id: number
  supervisor_id: number
  supervisor_user: {
    id: number
    name: string
    email: string
  } | null
  created_by: number
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
  committee_reviews: Array<{
    id: number
    project_proposal_id: number
    committee_member_id: number
    decision: string
    notes: string
    reviewed_at: string
    created_at: string
    updated_at: string
    committee_member: {
      id: number
      name: string
      email: string
    }
  }>
  created_at: string
  updated_at: string
}

export interface CommitteeDecisionPayload {
  decision: 'approved' | 'rejected' | 'needs_revision'
  notes: string
}

export interface AnnouncementPayload {
  title: string
  body: string
}

export interface Announcement {
  id: number
  title: string
  body: string
  created_at: string
}

export interface FinalSubmission {
  id: number
  project_team_id: number
  team: {
    id: number
    project_idea: {
      title: string
    }
  }
  proposal_drive_link: string
  presentation_drive_link: string
  code_drive_link: string
  student_notes: string
  status: string
  proposal_grade: string | null
  proposal_feedback: string | null
  presentation_grade: string | null
  presentation_feedback: string | null
  code_grade: string | null
  code_feedback: string | null
  total_grade: string | null
  graded_by: number | null
  graded_at: string | null
  created_at: string
}

export interface GradePayload {
  proposal_grade: number
  proposal_feedback: string
  presentation_grade: number
  presentation_feedback: string
  code_grade: number
  code_feedback: string
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

export interface ApiResponse<T> {
  status: boolean
  message: string
  data: T
}