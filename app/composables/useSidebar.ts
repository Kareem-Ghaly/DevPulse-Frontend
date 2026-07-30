export function useSidebar() {
  const isOpen = useState('sidebar-open', () => false)

  const toggle = (): void => {
    isOpen.value = !isOpen.value
  }

  const close = (): void => {
    isOpen.value = false
  }

  const open = (): void => {
    isOpen.value = true
  }

  return {
    isOpen: readonly(isOpen),
    toggle,
    close,
    open,
  }
}