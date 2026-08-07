export interface Announcement {
  id: number
  title: string
  body: string
  created_by: string | null
  created_at: string
}

export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface AnnouncementsResponse {
  status: boolean
  message: string
  data: Announcement[]
  meta: PaginationMeta
}