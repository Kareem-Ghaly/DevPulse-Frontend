import type { ComputedRef } from 'vue'
import type Echo from 'laravel-echo'

interface WebSocketTaskData {
  action: string
  task?: Record<string, unknown>
  task_id?: number
  column_id?: string
  old_column_id?: string
  attachment?: Record<string, unknown>
  link?: Record<string, unknown>
  attachment_id?: number
  link_id?: number
}

export interface WebSocketTaskEvent {
  type: string
  action: string
  task?: Record<string, unknown>
  task_id?: number
  column_id?: string
  old_column_id?: string
  attachment?: Record<string, unknown>
  link?: Record<string, unknown>
  attachment_id?: number
  link_id?: number
}

export function useTaskWebSocket(projectTeamId: ComputedRef<number | null>) {
  const callbacks: ((event: WebSocketTaskEvent) => void)[] = []
  let channel: ReturnType<Echo<'reverb'>['private']> | null = null
  let retryTimer: ReturnType<typeof setTimeout> | null = null
  let retryCount = 0
  const MAX_RETRIES = 30
  const isConnected = ref(false)

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

  const onEvent = (callback: (event: WebSocketTaskEvent) => void) => {
    callbacks.push(callback)

    return () => {
      const index = callbacks.indexOf(callback)
      if (index > -1) callbacks.splice(index, 1)
    }
  }

  const notifyCallbacks = (event: WebSocketTaskEvent) => {
    callbacks.forEach((cb) => {
      try {
        cb(event)
      } catch (e) {
        console.error('Error in WebSocket callback:', e)
      }
    })
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
          echo.leave(`private-project-team.${projectTeamId.value}.tasks`)
        } catch (e) {
          console.error('Error leaving channel:', e)
        }
      }

      channel = echo.private(`project-team.${projectTeamId.value}.tasks`)

      channel.listen('.task.changed', (data: WebSocketTaskData) => {
        notifyCallbacks({
          type: `task.${data.action}`,
          action: data.action,
          task: data.task,
          task_id: data.task_id,
          column_id: data.column_id,
          old_column_id: data.old_column_id,
          attachment: data.attachment,
          link: data.link,
          attachment_id: data.attachment_id,
          link_id: data.link_id,
        })
      })

      isConnected.value = true
      retryCount = 0

      return true
    } catch (error) {
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
        const echo = getEchoInstance()
        echo?.leave(`private-project-team.${projectTeamId.value}.tasks`)
      } catch (e) {
        console.error('Error disconnecting task WS:', e)
      }
      channel = null
    }

    isConnected.value = false
  }

  const startRetryLoop = (): void => {
    if (retryTimer) clearTimeout(retryTimer)

    const attempt = () => {
      if (isConnected.value) return
      if (retryCount >= MAX_RETRIES) {
        console.warn('Max retries reached for task WebSocket')

        return
      }

      retryCount++

      if (!connect()) {
        retryTimer = setTimeout(attempt, 2000)
      }
    }

    retryTimer = setTimeout(attempt, 1000)
  }

  onMounted(() => {
    setTimeout(() => {
      if (!connect()) {
        startRetryLoop()
      }
    }, 1500)
  })

  onUnmounted(() => {
    disconnect()
  })

  watch(projectTeamId, (newId, oldId) => {
    if (newId && newId !== oldId) {
      disconnect()
      nextTick(() => {
        if (!connect()) {
          startRetryLoop()
        }
      })
    }
  })

  return {
    onEvent,
    isConnected,
    connect,
    disconnect,
  }
}