export interface Profile {
  full_name: string
  university_id: string | null
  department: string | null
  academic_year: string | null
  skills: string[] | null
  bio: string | null
}

export interface UserProfile {
  id: number
  name: string
  username: string | null
  email: string
  role: 'student' | 'supervisor' | 'committee' | 'Admin' | string
  status: 'active' | 'inactive' | string
  profile_completed: boolean
  profile: Profile | null
  last_login_at: string | null
  academic_title?: string | null
  created_at: string
}

export interface AuthResponse {
  status: boolean
  message: string
  data: {
    token: string
    user: UserProfile
    role: string
  }
}

export interface SocialAuthResponse {
  status: boolean
  message: string
  data?: {
    token: string
    user: UserProfile
    role: string
    status: string
    profile_completed: boolean
  }
  errors?: {
    role?: string[]
  }
}

export interface ProfileCompleteResponse {
  status: boolean
  message: string
}

export interface GoogleRedirectResponse {
  status: boolean
  data: {
    redirect_url: string
  }
}

export interface AdminUser {
  id: number
  name: string
  username: string | null
  email: string
  role: 'Admin'
  status: 'active'
  profile_completed: boolean
  profile: null
  last_login_at: string | null
  created_at: string
}

export interface AdminAuthResponse {
  status: boolean
  message: string
  data: {
    user: AdminUser
    token: string
  }
}

export interface PendingUserProfile {
  full_name: string
  academic_title: string
  department: string
  specialization: string
  office_hours: string | null
  bio: string
}

export interface PendingUser {
  id: number
  name: string
  username: string | null
  email: string
  role: 'Supervisor' | 'Committee-Member'
  status: 'pending' | 'active'
  profile_completed: boolean
  profile: PendingUserProfile
  last_login_at: string | null
  created_at: string
}

export interface PendingUsersListResponse {
  status: boolean
  message: string
  data: PendingUser[]
}

export interface AdminActionResponse {
  status: boolean
  message: string
  data: PendingUser
}

export interface AdminLoginInputSchema {
  login: string
  password: string
}

export interface TableColumnItem {
  id: string
  key: string
  label: string
  sortable?: boolean
}

export interface MutationError {
  data?: {
    message?: string
  }
}

export interface GithubRedirectResponse {
  status: boolean
  data: {
    redirect_url: string
  }
}

export interface MeResponse {
  status: boolean
  message: string
  data: UserProfile
}

export interface ProjectIdea {
  id: number
  owner_id: number
  title: string
  abstract: string
  description: string
  tech_stack: string | null
  required_skills: string[]
  needed_roles: string | null
  domain: string | null
  ai_keywords: string | null
  ai_summary: string | null
  ai_analysis_status: string
  ai_error: string | null
  team_size: number
  status: string
  created_at: string
  updated_at: string
}

export interface Invitation {
  id: number
  project_idea_id: number
  project_idea: ProjectIdea
  sender_id: number
  sender: UserProfile
  receiver_id: number
  receiver: UserProfile
  status: 'pending' | 'accepted' | 'rejected'
  created_at: string
  updated_at: string
}

export interface InvitationsResponse {
  status: boolean
  message: string
  data: {
    invitations: Invitation[]
  }
}

export interface InvitationActionResponse {
  status: boolean
  message: string
  data: {
    invitation: Invitation
  }
}