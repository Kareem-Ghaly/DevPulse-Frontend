import type { LoginInput } from '~/schemas/auth.schema'
import type {
  AuthResponse,
  AdminAuthResponse,
  RegisterInput,
  GoogleRedirectResponse,
  GithubRedirectResponse,
} from '~/types/auth'

export const useAuthService = () => {
  const api = useApiClient()

  const login = async (credentials: LoginInput): Promise<AuthResponse> => {
    return await api.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: credentials,
    })
  }

  const adminLogin = async (credentials: AdminLoginInputSchema): Promise<AdminAuthResponse> => {
    return await api.request<AdminAuthResponse>('/auth/admin-login', {
      method: 'POST',
      body: credentials,
    })
  }

  const register = async (userData: RegisterInput): Promise<AuthResponse> => {
    const endpoint = `/auth/register/${userData.role}`

    const basePayload: Record<string, unknown> = {
      full_name: userData.full_name,
      email: userData.email,
      password: userData.password,
      password_confirmation: userData.password_confirmation,
      department: userData.department,
    }

    if (userData.role === 'student') {
      basePayload.university_id = userData.university_id
      basePayload.academic_year = userData.academic_year
      basePayload.skills = userData.skills || []
      basePayload.github_link = userData.github_link || null
      basePayload.bio = userData.bio
    }
    else if (userData.role === 'supervisor') {
      basePayload.academic_title = userData.academic_title
      basePayload.specialization = userData.specialization
      basePayload.office_hours = userData.office_hours
      basePayload.bio = userData.bio
      basePayload.research_interests = userData.research_interests || []
    }
    else if (userData.role === 'committee-member') {
      basePayload.academic_title = userData.academic_title
      basePayload.specialization = userData.specialization
      basePayload.bio = userData.bio
    }

    return await api.request<AuthResponse>(endpoint, {
      method: 'POST',
      body: basePayload,
    })
  }

  const getSkills = async (): Promise<string[]> => {
    return await api.request<string[]>('/skills', {
      method: 'GET',
    })
  }

  const getGoogleRedirect = async (role: string = 'student'): Promise<GoogleRedirectResponse> => {
    return await api.request<GoogleRedirectResponse>('/auth/google/redirect', {
      method: 'GET',
      params: { role },
    })
  }

  const getGithubRedirect = async (role: string = 'student'): Promise<GithubRedirectResponse> => {
    return await api.request<GithubRedirectResponse>('/auth/github/redirect', {
      method: 'GET',
      params: { role },
    })
  }

  const getMe = async (): Promise<MeResponse> => {
    return await api.request<MeResponse>('/auth/me', {
      method: 'GET',
    })
  }

  return {
    login,
    adminLogin,
    register,
    getSkills,
    getGoogleRedirect,
    getGithubRedirect,
    getMe
  }
}
