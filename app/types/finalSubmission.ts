export interface FinalSubmission {
  id: number
  proposal_grade: number | null
  proposal_feedback: string | null
  presentation_grade: number | null
  presentation_feedback: string | null
  code_grade: number | null
  code_feedback: string | null
  total_grade: number | null
  status: 'submitted' | 'graded'
  proposal_drive_link: string | null
  presentation_drive_link: string | null
  code_drive_link: string | null
  student_notes: string | null
  graded_at: string | null
  graded_by: { id: number; name: string } | null
  team: {
    id: number
    project_idea: { id: number; title: string } | null
  } | null
}

export interface FinalSubmissionData {
  id?: number
  proposal_drive_link?: string
  presentation_drive_link?: string
  code_drive_link?: string
  student_notes?: string
  committee_notes?: string
  status?: 'submitted' | 'graded' | 'rejected'
  proposal_grade?: number | null
  proposal_feedback?: string | null
  presentation_grade?: number | null
  presentation_feedback?: string | null
  code_grade?: number | null
  code_feedback?: string | null
  total_grade?: number | null
  graded_by?: string | null
  graded_at?: string | null
}