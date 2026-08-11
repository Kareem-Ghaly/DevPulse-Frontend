<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useMutation } from '@tanstack/vue-query'
import { LoginSchema, type LoginInput } from '../../schemas/auth.schema'

const authService = useAuthService()
const authStore = useAuthStore()
const appToast = useAppToast()
const router = useRouter()

const isGoogleLoading = ref(false)
const isGithubLoading = ref(false)

const { handleSubmit, errors, defineField } = useForm<LoginInput>({
  validationSchema: toTypedSchema(LoginSchema),
})

const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')

const { requestPermission, listenToMessages } = useFirebaseMessaging()

const { mutate: executeLogin, isPending: isLoading } = useMutation({
  mutationFn: async (values: LoginInput) => {
    return await authService.login(values)
  },
  onSuccess: async (responseData) => {
    if (responseData && responseData.status && responseData.data) {
      const user = responseData.data.user
      
      authStore.setAuth({
        token: responseData.data.token,
        user: user,
        role: user.role,
      })
      
      await requestPermission()
      listenToMessages()
      
      const userName = user.name || 'User'
      appToast.success('Welcome back!', `Successfully signed in as ${userName}`)

      const userRole = user.role
      const profileCompleted = user.profile_completed

      if (userRole === 'Student' || userRole === 'student') {
        await router.push('/student/my-projects')
      }
      else if (userRole === 'Supervisor' || userRole === 'supervisor') {
        if (profileCompleted === false) {
          await router.push('/profile/supervisor/complete')
        }
        else {
          await router.push('/supervisor/home')
        }
      }
      else {
        await router.push('/committee/profile')
      }
    }
  },
})

const onSubmit = handleSubmit((values) => {
  executeLogin(values)
})

const selectedRole = ref('student')

const handleGoogleLogin = async () => {
  isGoogleLoading.value = true
  try {
    const response = await authService.getGoogleRedirect(selectedRole.value)
    if (response && response.status && response.data.redirect_url) {
      window.location.href = response.data.redirect_url
    }
  }
  catch (error) {
    console.error(error)
    appToast.error('Google Login Error', 'Could not initialize Google authentication. Please try again.')
  }
  finally {
    isGoogleLoading.value = false
  }
}

const handleGithubLogin = async () => {
  isGithubLoading.value = true
  try {
    const response = await authService.getGithubRedirect(selectedRole.value)
    if (response && response.status && response.data.redirect_url) {
      window.location.href = response.data.redirect_url
    }
  }
  catch (error) {
    console.error(error)
    appToast.error('GitHub Login Error', 'Could not initialize GitHub authentication. Please try again.')
  }
  finally {
    isGithubLoading.value = false
  }
}

const inputUiConfig = {
  root: 'rounded-lg',
  base: 'bg-input-bg border-input-border text-white placeholder-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm py-2.5 px-3',
}
</script>

<template>
  <div class="min-h-screen bg-brand-dark text-slate-100 font-sans antialiased flex flex-col md:flex-row">
    <div class="hidden md:flex md:w-1/2 p-12 lg:p-16 flex-col justify-between bg-gradient-to-b from-brand-bg to-brand-deep border-r border-slate-900">
      <div class="flex items-center gap-3">
        <div class="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-600/20">
          <UIcon name="i-heroicons-bolt" class="h-5 w-5" />
        </div>
        <span class="text-xl font-bold tracking-tight text-white">DevPulse</span>
      </div>

      <div class="space-y-8 max-w-lg my-auto">
        <div class="space-y-4">
          <h1 class="text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight">
            Streamline Your Project Lifecycle
          </h1>
          <p class="text-slate-400 text-base leading-relaxed">
            The complete platform for university students to<br> manage projects, collaborate with teams, and track<br> progress in real-time.
          </p>
        </div>

        <div class="space-y-4">
          <div class="flex items-start gap-4 p-4 rounded-xl border border-border-dark bg-brand-bg/50 backdrop-blur-sm">
            <div class="p-2 rounded-lg bg-blue-600/10 text-blue-400 mt-0.5">
              <UIcon name="i-heroicons-bolt" class="h-5 w-5" />
            </div>
            <div>
              <h4 class="font-bold text-white">Real-time Collaboration</h4>
              <p class="text-xs text-slate-400 mt-0.5">Sync docs and tasks with your team</p>
            </div>
          </div>

          <div class="flex items-start gap-4 p-4 rounded-xl border border-border-dark bg-brand-bg/50 backdrop-blur-sm">
            <div class="p-2 rounded-lg bg-indigo-600/10 text-indigo-400 mt-0.5">
              <UIcon name="i-heroicons-users" class="h-5 w-5" />
            </div>
            <div>
              <h4 class="font-bold text-white">Smart Team Matching</h4>
              <p class="text-xs text-slate-400 mt-0.5">Find teammates based on skill gaps</p>
            </div>
          </div>

          <div class="flex items-start gap-4 p-4 rounded-xl border border-border-dark bg-brand-bg/50 backdrop-blur-sm">
            <div class="p-2 rounded-lg bg-purple-600/10 text-purple-400 mt-0.5">
              <UIcon name="i-heroicons-academic-cap" class="h-5 w-5" />
            </div>
            <div>
              <h4 class="font-bold text-white">Supervisor Insights</h4>
              <p class="text-xs text-slate-400 mt-0.5">Contribution heatmaps and feedback</p>
            </div>
          </div>
        </div>
      </div>

      <div class="text-xs text-slate-500 font-medium">
        Trusted by 50+ universities worldwide
      </div>
    </div>

    <div class="w-full md:w-1/2 flex flex-col justify-center items-center px-6 py-12 lg:px-16 bg-brand-deep">
      <div class="w-full max-w-md space-y-6 text-center">
        <div class="space-y-1">
          <h2 class="text-3xl font-black tracking-tight text-white">Welcome back</h2>
          <p class="text-sm text-slate-400">Sign in to continue to your dashboard</p>
        </div>

        <div class="border border-border-dark bg-brand-dark p-8 rounded-xl shadow-xl text-left">
          <div class="space-y-2 mb-6">
            <h3 class="text-lg font-bold text-white">Sign in</h3>
            <p class="text-xs text-slate-400">Choose your preferred authentication method</p>
          </div>

          <div class="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              :disabled="isGithubLoading"
              class="flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-border-slate bg-panel-dark text-xs font-semibold text-slate-200 hover:bg-[#121d42] transition-colors cursor-pointer disabled:opacity-50"
              @click="handleGithubLogin"
            >
              <UIcon
                :name="isGithubLoading ? 'i-heroicons-arrow-path' : 'i-heroicons-globe-alt'"
                :class="['h-4 w-4 text-slate-400', isGithubLoading && 'animate-spin']"
              />
              GitHub
            </button>
            <button type="button" :disabled="isGoogleLoading" class="flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-border-slate bg-panel-dark text-xs font-semibold text-slate-200 hover:bg-[#121d42] transition-colors cursor-pointer disabled:opacity-50" @click="handleGoogleLogin">
              <UIcon :name="isGoogleLoading ? 'i-heroicons-arrow-path' : 'i-heroicons-envelope'" :class="['h-4 w-4 text-slate-400', isGoogleLoading && 'animate-spin']" />
              Google
            </button>
          </div>

          <div class="relative flex items-center justify-center my-5">
            <div class="absolute inset-0 flex items-center" aria-hidden="true">
              <div class="w-full border-t border-border-dark" />
            </div>
            <span class="relative bg-brand-dark px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              OR CONTINUE WITH EMAIL
            </span>
          </div>

          <form class="space-y-4" @submit.prevent="onSubmit">
            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-slate-300">Email</label>
              <UInput
                v-model="email"
                v-bind="emailAttrs"
                type="email"
                placeholder="name@university.edu"
                size="md"
                color="neutral"
                variant="outline"
                class="w-full"
                :ui="inputUiConfig"
              />
              <span v-if="errors.email" class="text-xs text-rose-500 block mt-1">{{ errors.email }}</span>
            </div>

            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <label class="block text-xs font-bold text-slate-300">Password</label>
              </div>
              <div class="relative">
                <UInput
                  v-model="password"
                  v-bind="passwordAttrs"
                  type="password"
                  placeholder="Enter your password"
                  size="md"
                  color="neutral"
                  variant="outline"
                  class="w-full"
                  :ui="inputUiConfig"
                />
              </div>
              <span v-if="errors.password" class="text-xs text-rose-500 block mt-1">{{ errors.password }}</span>
            </div>

            <div class="pt-2">
              <button
                type="submit"
                :disabled="isLoading"
                class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-brand-purple hover:bg-brand-purple-hover active:bg-brand-purple-active text-white font-bold text-sm transition-all shadow-md shadow-blue-600/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{{ isLoading ? 'Signing in...' : 'Sign in' }}</span>
                <UIcon v-if="!isLoading" name="i-heroicons-arrow-right" class="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>

        <div class="text-sm text-slate-400 font-medium">
          Don't have an account? 
          <ULink to="/auth/register" class="font-bold text-brand-purple hover:text-brand-purple-hover transition-colors ml-1">
            Sign up
          </ULink>
        </div>
      </div>
    </div>
  </div>
</template>