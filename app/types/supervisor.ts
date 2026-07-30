export interface Supervisor {
  id: number
  name: string
  email: string
  academic_title: string
  specialization: string
}

export interface SupervisorMatch {
  supervisor: Supervisor
  matched_interests: string[]
  missing_interests: string[]
  match_percentage: number
}

export interface SupervisorMatchResponse {
  status: boolean
  message: string
  data: {
    data: SupervisorMatch[]
    meta: {
      current_page: number
      last_page: number
      per_page: number
      total: number
    }
  }
}

export interface SubmitProposalResponse {
  status: boolean
  message: string
  data: {
    proposal: {
      id: number
      status: string
      supervisor: string
    }
  }
}