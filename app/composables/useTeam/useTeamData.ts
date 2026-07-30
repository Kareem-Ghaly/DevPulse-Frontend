import { useQuery } from '@tanstack/vue-query'
import type { ComputedRef } from 'vue'

export function useTeamData(projectId: ComputedRef<number>) {
  const api = useApiClient()

  const { data: teamData, isLoading: isLoadingTeam } = useQuery<TeamResponse>({
    queryKey: ['team', projectId],
    queryFn: () => api.request<TeamResponse>(`/project-ideas/${projectId.value}/team`),
    enabled: () => projectId.value > 0,
  })

  const team = computed<Team>(() => {
    const responseData = teamData.value?.data?.team
    if (!responseData) {
      return {
        id: 0,
        project_idea_id: 0,
        project_idea: {
          id: 0,
          owner_id: 0,
          title: '',
          abstract: '',
          description: '',
          tech_stack: null,
          required_skills: [],
          needed_roles: null,
          domain: null,
          ai_keywords: null,
          ai_summary: null,
          ai_analysis_status: 'not_analyzed',
          ai_error: null,
          team_size: 0,
          status: '',
          created_at: '',
          updated_at: '',
        },
        leader_id: 0,
        leader: {
          id: 0,
          name: '',
          username: null,
          email: '',
          role: '',
          status: '',
          profile_completed: false,
          profile: {
            full_name: '',
            university_id: '',
            department: '',
            academic_year: '',
            skills: [],
            bio: '',
          },
          last_login_at: '',
          created_at: '',
        },
        status: 'forming',
        members: [],
        created_at: '',
        updated_at: '',
      }
    }

    return responseData
  })

  const isTeamComplete = computed(() => {
    const teamSize = team.value.project_idea.team_size

    return team.value.members.length >= teamSize
  })

  return {
    team,
    isTeamComplete,
    isLoadingTeam,
  }
}