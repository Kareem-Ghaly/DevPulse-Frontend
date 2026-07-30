importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: 'YOUR_API_KEY_HERE',
  projectId: 'devpulse-11828',
  messagingSenderId: 'YOUR_SENDER_ID_HERE',
  appId: 'YOUR_APP_ID_HERE',
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(
    payload.notification?.title || 'New Notificaiton',
    {
      body: payload.notification?.body || '',
      icon: '/favicon.ico',
      data: payload.data || {},
    }
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data?.action_url || '/'
  event.waitUntil(clients.openWindow(url))
})