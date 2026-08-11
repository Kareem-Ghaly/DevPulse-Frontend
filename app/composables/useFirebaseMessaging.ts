import { getToken, onMessage } from 'firebase/messaging'

const useSharedFcmToken = () => useState<string | null>('fcm-token', () => null)

export const useFirebaseMessaging = () => {
  const { $firebaseMessaging } = useNuxtApp()
  const config = useRuntimeConfig()
  const api = useApiClient()
  const appToast = useAppToast()
  
  const fcmToken = useSharedFcmToken()

  const requestPermission = async (): Promise<string | null> => {
    if (!import.meta.client) return null

    try {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {

        return null
      }

      const token = await getToken($firebaseMessaging, {
        vapidKey: config.public.firebaseVapidKey,
      })

      if (token) {
        fcmToken.value = token
        await api.request('/notifications/firebase-token', {
          method: 'POST',
          body: {
            token,
            device_type: 'web',
            browser: navigator.userAgent,
          },
        })
      }

      return token
    } catch (err) {
      console.error('FCM Error:', err)

      return null
    }
  }

  const listenToMessages = () => {
    if (!import.meta.client) return

    onMessage($firebaseMessaging, (payload) => {
      try {
        const audio = new Audio('/notification-sound.mp3')
        audio.volume = 0.5
        audio.play().catch(() => {})
      } catch (e) {
        // console.log(e)
      }

      appToast.error(
        payload.notification?.title || 'New Notication ',
        payload.notification?.body || ''
      )
    })
  }

  const removeToken = async (): Promise<void> => {
    if (!fcmToken.value) return
    
    try {
      await api.request('/notifications/firebase-token', {
        method: 'DELETE',
        body: { token: fcmToken.value },
      })
    } catch (e) {
      console.error('Failed to remove token:', e)
    } finally {
      fcmToken.value = null
    }
  }

  return { fcmToken, requestPermission, listenToMessages, removeToken }
}