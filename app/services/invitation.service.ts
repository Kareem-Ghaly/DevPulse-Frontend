import type { InvitationsResponse, InvitationActionResponse } from '~/types/auth'

export const useInvitationService = () => {
  const api = useApiClient()

  const getMyInvitations = async (): Promise<InvitationsResponse> => {
    return await api.request<InvitationsResponse>('/my-invitations', {
      method: 'GET',
    })
  }

  const acceptInvitation = async (id: number): Promise<InvitationActionResponse> => {
    return await api.request<InvitationActionResponse>(`/invitations/${id}/accept`, {
      method: 'POST',
    })
  }

  const rejectInvitation = async (id: number): Promise<InvitationActionResponse> => {
    return await api.request<InvitationActionResponse>(`/invitations/${id}/reject`, {
      method: 'POST',
    })
  }

  return {
    getMyInvitations,
    acceptInvitation,
    rejectInvitation,
  }
}