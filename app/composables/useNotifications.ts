export const useNotifications = () => {
  const api = useApiClient()
  
  const notifications = ref<any[]>([])
  const unreadCount = ref(0)
  const isLoading = ref(false)
  const currentPage = ref(1)
  const lastPage = ref(1)

  const fetchNotifications = async (page = 1) => {
    isLoading.value = true
    try {
      const res = await api.request(`/notifications?page=${page}`)
      
      notifications.value = res.data || []
      unreadCount.value = res.unread_count || 0
      currentPage.value = res.meta?.current_page || 1
      lastPage.value = res.meta?.last_page || 1
      
    } catch (e) {
      console.error('Failed to fetch notifications:', e)
      notifications.value = []
      unreadCount.value = 0
    } finally {
      isLoading.value = false
    }
  }

  const markAsRead = async (id: string) => {
    await api.request(`/notifications/${id}/read`, { method: 'POST' })
    const n = notifications.value.find(n => n.id === id)
    if (n && !n.read_at) {
      n.read_at = new Date().toISOString()
      unreadCount.value = Math.max(0, unreadCount.value - 1)
    }
  }

  const markAllAsRead = async () => {
    await api.request('/notifications/read-all', { method: 'POST' })
    notifications.value.forEach(n => n.read_at = n.read_at || new Date().toISOString())
    unreadCount.value = 0
  }

  return {
    notifications,
    unreadCount,
    isLoading,
    currentPage,
    lastPage,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  }
}