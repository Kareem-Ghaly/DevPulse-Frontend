<script setup lang="ts">
import type { UserProfile } from '~/types/auth'

definePageMeta({
  layout: 'blank',
})

const route = useRoute()
const authStore = useAuthStore()
const appToast = useAppToast()

const isProcessing = ref(true)
const errorMessage = ref('')

const processAuthCallback = async () => {
  try {
    // ✅ استخدم URLSearchParams مباشرة بدل route.query
    const urlParams = new URLSearchParams(window.location.search)
    
    const token = urlParams.get('token') || (route.query.token as string | undefined)
    const userJson = urlParams.get('user') || (route.query.user as string | undefined)
    const role = urlParams.get('role') || (route.query.role as string | undefined)
    const profileCompletedRaw = urlParams.get('profile_completed') || (route.query.profile_completed as string | undefined)
    
    // Debug
    console.log('🔍 Callback Debug:', {
      token: token ? 'exists' : 'missing',
      userJson: userJson ? 'exists' : 'missing',
      role,
      profileCompletedRaw,
      fullUrl: window.location.href,
    })

    if (!token || !userJson) {
      errorMessage.value = 'Invalid authentication response. Missing required data.'
      return
    }

    let user: UserProfile
    try {
      user = JSON.parse(decodeURIComponent(userJson)) as UserProfile
    }
    catch (e) {
      console.error('JSON Parse Error:', e)
      errorMessage.value = 'Failed to parse user data from authentication response.'
      return
    }

    const profileCompleted = profileCompletedRaw === '1' || profileCompletedRaw === 'true'

    authStore.setAuth({
      token,
      user,
      role: role || user.role || 'student',
    })

    appToast.success('Welcome to DevPulse!', `Logged in successfully as ${user.name}`)

    if (!profileCompleted) {
      await navigateTo('/profile/setup')
    }
    else {
      const userRole = role || user.role
      if (userRole?.toLowerCase() === 'student') {
        await navigateTo('/student/my-projects')
      }
      else {
        await navigateTo('/')
      }
    }
  }
  catch (error) {
    console.error('Auth callback error:', error)
    errorMessage.value = 'An unexpected error occurred during authentication.'
  }
  finally {
    isProcessing.value = false
  }
}

onMounted(() => {
  if (import.meta.client) {
    processAuthCallback()
  }
})
</script>

<template>
  <div class="min-h-screen bg-brand-deep flex items-center justify-center text-white font-sans antialiased">
    <div v-if="isProcessing" class="w-full max-w-md text-center space-y-6 p-8 rounded-xl border border-border-dark bg-brand-dark">
      <div class="h-12 w-12 rounded-full border-4 border-t-brand-purple border-input-border animate-spin mx-auto" />
      <p class="text-xs text-slate-400 animate-pulse">
        Securing your session and verifying credentials...
      </p>
    </div>

    <div v-else-if="errorMessage" class="w-full max-w-md text-center space-y-6 p-8 rounded-xl border border-border-dark bg-brand-dark">
      <div class="h-12 w-12 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto">
        <UIcon name="i-heroicons-x-mark" class="h-6 w-6 text-rose-500" />
      </div>
      <div class="space-y-2">
        <h3 class="text-lg font-bold text-white">
          Authentication Failed
        </h3>
        <p class="text-xs text-slate-400">
          {{ errorMessage }}
        </p>
      </div>
      <UButton
        block
        size="lg"
        label="Back to Login"
        class="bg-brand-purple hover:bg-brand-purple-hover font-semibold text-sm transition-colors cursor-pointer"
        @click="navigateTo('/auth/login')"
      />
    </div>
  </div>
</template>
