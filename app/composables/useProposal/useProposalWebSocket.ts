import type { ComputedRef } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
import type Echo from 'laravel-echo'

interface WebSocketProposalData {
  proposal: ProjectProposal
  action: string
}

interface WebSocketWhisperData {
  user?: string
}

declare global {
  interface Window {
    __ECHO_INSTANCE__: Echo<'reverb'> | null
  }
}

export function useProposalWebSocket(projectTeamId: ComputedRef<number | null>) {
  const queryClient = useQueryClient()
  

  queryClient.invalidateQueries({ queryKey: ['projects'] })
  queryClient.invalidateQueries({ queryKey: ['project-detail'] })
  queryClient.invalidateQueries({ queryKey: ['team'] })  
  const proposal = ref<ProjectProposal | null>(null)
  const isConnected = ref(false)
  const isCollaborating = ref(false)
  const collaborators = ref<string[]>([])
  const appToast = useAppToast()

  let channel: ReturnType<Echo<'reverb'>['private']> | null = null
  let retryTimer: ReturnType<typeof setTimeout> | null = null
  let retryCount = 0
  const MAX_RETRIES = 30

  const getEchoInstance = (): Echo<'reverb'> | null => {
    const windowEcho = window.__ECHO_INSTANCE__
    if (windowEcho) return windowEcho

    try {
      const nuxtApp = useNuxtApp()
      const echo = nuxtApp.$echo as Echo<'reverb'> | null
      if (echo) return echo
    } catch (e) {
      console.error('Error accessing nuxtApp:', e)
    }

    return null
  }

  const connect = (): boolean => {
    if (!import.meta.client) return false
    if (!projectTeamId.value) return false
    if (isConnected.value) return true

    const echo = getEchoInstance()
    if (!echo) return false

    try {
      if (channel) {
        try {
          echo.leave(`private-proposal.team.${projectTeamId.value}`)
        } catch (e) {
          console.error('Error leaving channel:', e)
        }
      }

      channel = echo.private(`proposal.team.${projectTeamId.value}`)

      channel.listen('.proposal.changed', (data: WebSocketProposalData) => {
        if (data?.proposal) {
          queryClient.setQueryData(
            ['project-proposal-by-team', projectTeamId.value],
            { status: true, data: { proposal: data.proposal } }
          )
        }
      })

      channel.listenForWhisper('joining', (data: WebSocketWhisperData) => {
        if (data?.user && !collaborators.value.includes(data.user)) {
          collaborators.value.push(data.user)
        }
        isCollaborating.value = collaborators.value.length > 0
      })

      channel.listenForWhisper('leaving', (data: WebSocketWhisperData) => {
        if (data?.user) {
          collaborators.value = collaborators.value.filter(c => c !== data.user)
        }
        isCollaborating.value = collaborators.value.length > 0
      })

      isConnected.value = true
      retryCount = 0

      const authStore = useAuthStore()
      channel.whisper('joining', {
        user: authStore.user?.name || 'Anonymous',
      })

      return true
    } catch (error) {
      console.error('WebSocket connection error:', error)
      isConnected.value = false

      return false
    }
  }

  const disconnect = (): void => {
    if (retryTimer) {
      clearTimeout(retryTimer)
      retryTimer = null
    }

    if (channel) {
      try {
        const authStore = useAuthStore()
        channel.whisper('leaving', {
          user: authStore.user?.name || 'Anonymous',
        })
        const echo = getEchoInstance()
        echo?.leave(`private-proposal.team.${projectTeamId.value}`)
      } catch (e) {
        console.error('Error disconnecting:', e)
      }
      channel = null
    }

    isConnected.value = false
    isCollaborating.value = false
    collaborators.value = []
  }

  const startRetryLoop = (): void => {
    if (retryTimer) clearTimeout(retryTimer)

    const attempt = () => {
      if (isConnected.value) return
      if (retryCount >= MAX_RETRIES) return

      retryCount++
      if (!connect()) {
        retryTimer = setTimeout(attempt, 2000)
      }
    }

    retryTimer = setTimeout(attempt, 1000)
  }

  onMounted(() => {
    setTimeout(() => {
      if (!connect()) startRetryLoop()
    }, 1500)
  })

  onUnmounted(() => {
    disconnect()
  })

  watch(projectTeamId, (newId, oldId) => {
    if (newId && newId !== oldId) {
      disconnect()
      nextTick(() => {
        if (!connect()) startRetryLoop()
      })
    }
  })

  return {
    proposal,
    isConnected,
    isCollaborating,
    collaborators,
    connect,
    disconnect,
  }
}