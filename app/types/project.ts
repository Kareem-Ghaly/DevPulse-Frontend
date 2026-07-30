export interface interfaceProjectOwner  {
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
}

export interface ProjectIdea {
  id: number
  owner_id: number
  title: string
  abstract: string
  description: string
  tech_stack: string[] | null
  required_skills: string[]
  needed_roles: string[] | null
  domain: string | null
  team_size: number
  status: string
  created_at: string
  updated_at: string
  owner: interfaceProjectOwner
}

export interface ProjectIdeaPayload {
  title: string
  abstract: string
  description: string
  team_size: number
  required_skills: string[]
}

export interface ProjectIdeaResponse {
  status: boolean
  message: string
  data: {
    project_idea: ProjectIdea
  }
}

export interface MyProjectsResponse {
  status: boolean
  message: string
  data: {
    projects: ProjectIdea[]
  }
}

export interface ProposalPayload {
  title: string
  problem?: string
  problem_overview?: string
  comparison_table_with_similar_applications?: string
  project_users?: string
  mind_map_problem?: File | null
  mind_map_problem_url?: File | null
  solution_overview?: string
  proposed_solution?: string
  mind_map_solution?: File | null
  mind_map_solution_url?: File | null
  functional_requirements?: string
  non_functional_requirements?: string
  project_management?: string
  programming_languages?: string
  supervisor?: string
  project_teams?: string
  status?: string
}

export interface ProjectTeam {
  id: number
  status: string
  members: TeamMember[]
}

export interface Match {
  student: Student
  matched_skills: string[]
  missing_skills: string[]
  match_percentage: number
}

export interface MatchesResponse {
  status: boolean
  message: string
  data: {
    matches: Match[]
  }
}

export interface User {
  id: number
  name: string
  email: string
  status: string
  profile_completed: boolean
}

export interface SingleProjectResponse {
  status: boolean
  message: string
  data: {
    project_idea: ProjectIdea
  }
}

export interface MyProjectsResponse {
  status: boolean
  message: string
  data: {
    projects: ProjectIdea[]
  }
}

export interface ProjectIdeaPayload {
  title: string
  abstract: string
  description: string
  team_size: number
  required_skills: string[]
}

export interface ProjectIdeaResponse {
  status: boolean
  message: string
  data: {
    project_idea: ProjectIdea
  }
}