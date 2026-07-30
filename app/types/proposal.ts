export interface ProjectProposal {
  id: number
  title: string
  problem: string
  problem_overview: string
  comparison_table_with_similar_applications: string
  project_users: string
  mind_map_problem_url?: string | null
  mind_map_solution_url?: string | null
  solution_overview: string
  proposed_solution: string
  functional_requirements: string
  non_functional_requirements: string
  project_management: string
  programming_languages: string
  supervisor: string
  project_teams: string
  status: 'draft' | 'submitted'
}

export interface ProposalResponse {
  status: boolean
  message: string
  data: {
    proposal: ProjectProposal
  }
}

export interface ApiError {
  data?: {
    proposal_id?: number
  }
  message?: string
}