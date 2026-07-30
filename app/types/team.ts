export interface TeamMemberProfile {
  full_name: string
  university_id: string
  department: string
  academic_year: string
  skills: string[]
  bio: string
}

export interface TeamMember {
  id: number
  name: string
  email: string
  user: {
    name: string
    profile: TeamMemberProfile
  }
  role: 'leader' | 'member'
  profile: TeamMemberProfile
}

export interface Team {
  id: number
  status: string
  members: TeamMember[]
}

export interface Student {
  id: number
  name: string
  email: string
}

export interface Invitation {
  id: number
  project_idea_id: number
  receiver_id: number
  status: string
}

export interface InvitationPayload {
  receiver_id: number
}

export interface InvitationResponse {
  status: boolean
  message: string
  data: { invitation: Invitation }
}

export interface InvitationsListResponse {
  status: boolean
  message: string
  data: { invitations: Invitation[] }
}