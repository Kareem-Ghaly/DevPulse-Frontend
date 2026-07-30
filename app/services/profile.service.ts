import type { ProfileCompleteResponse } from '~/types/auth'

export interface ProfileSetupPayload {
  full_name: string
  university_id: string
  department: string
  academic_year: string
  bio?: string
  skills: string[]
}

export const useProfileService = () => {
  const api = useApiClient()

  const completeProfile = async (profileData: ProfileSetupPayload): Promise<ProfileCompleteResponse> => {
    return await api.request<ProfileCompleteResponse>('/profile/student/complete', {
      method: 'PUT',
      body: profileData,
    })
  }

  return {
    completeProfile,
  }
}