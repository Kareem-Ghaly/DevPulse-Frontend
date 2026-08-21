<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useMutation } from '@tanstack/vue-query'
import { AdminLoginSchema } from '#imports'
import { ShieldCheckIcon, KeyIcon } from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'blank'
})

const authService = useAuthService()
const authStore = useAuthStore()
const appToast = useAppToast()

const { handleSubmit, errors, defineField } = useForm<AdminLoginInput>({
  validationSchema: toTypedSchema(AdminLoginSchema)
})

const [login, loginAttrs] = defineField('login')
const [password, passwordAttrs] = defineField('password')

const { mutate: executeAdminLogin, isPending: isLoading } = useMutation({
  mutationFn: async (inputValues: AdminLoginInput) => {
    return await authService.adminLogin(inputValues)
  },
  onSuccess: async (responseData) => {
  if (responseData && responseData.status && responseData.data) {
    
    const adminProfile: UserProfile = {
      id: responseData.data.user.id,
      name: responseData.data.user.name,
      username: responseData.data.user.username,
      email: responseData.data.user.email,
      role: 'Admin',
      status: responseData.data.user.status,
      profile_completed: responseData.data.user.profile_completed,
      last_login_at: responseData.data.user.last_login_at, 
      created_at: responseData.data.user.created_at,
      profile: null,
    }

    authStore.setAuth({
      token: responseData.data.token,
      user: adminProfile,
      role: 'Admin'
    })
    
    appToast.success('Access Granted!', `Welcome back, Admin ${responseData.data.user.name}!`)
    await navigateTo('/admin/dashboard')
  }
}
})

const onSubmit = handleSubmit((finalValues) => {
  executeAdminLogin(finalValues)
})

const uiInputStyle = {
  root: 'rounded-lg',
  base: 'bg-input-bg border-input-border text-white placeholder-slate-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm py-2.5 px-3 w-full'
}
</script>

<template>
  <div class="min-h-screen bg-brand-dark text-slate-100 font-sans antialiased flex flex-col md:flex-row">
    
    <div class="hidden md:flex md:w-1/2 p-12 lg:p-16 flex-col justify-between bg-gradient-to-b from-slate-950 to-brand-deep border-r border-purple-900/30">
      <div class="flex items-center gap-3">
        <div class="h-9 w-9 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold shadow-md shadow-purple-600/20">
          <ShieldCheckIcon class="h-5 w-5" />
        </div>
        <span class="text-xl font-bold tracking-tight text-white">DevPulse <span class="text-purple-400 text-xs font-semibold">Admin</span></span>
      </div>

      <div class="space-y-6 max-w-lg my-auto">
        <div class="space-y-4">
          <h1 class="text-2xl lg:text-4xl font-black text-white tracking-tight leading-tight">Control & Gatekeeping</h1>
          <p class="text-slate-400 text-base leading-relaxed">Review incoming supervisor credentials, approve committee setups, and audit systemic registrations inside DevPulse platform.</p>
        </div>
      </div>

      <div class="text-slate-500 font-medium text-xs">
        Authorized Personnel Only. Actions are logged.
      </div>
    </div>

    <div class="w-full md:w-1/2 flex flex-col justify-center items-center px-6 py-12 lg:px-16 bg-brand-deep">
      <div class="w-full max-w-md">
        
        <div class="border border-purple-900/40 bg-brand-dark p-8 rounded-2xl shadow-2xl space-y-6">
          <div class="text-center md:text-left space-y-1">
            <h2 class="text-2xl font-black text-white tracking-tight">System Login</h2>
            <p class="text-slate-400 text-xs">Verify your administrative identity</p>
          </div>

          <form class="space-y-4" @submit.prevent="onSubmit">
            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-slate-300">Admin Identifier (Email)</label>
              <UInput v-model="login" class="w-full" v-bind="loginAttrs" type="email" placeholder="admin@devpulse.local" :ui="uiInputStyle" />
              <span v-if="errors.login" class="text-xs text-rose-500 block mt-1">{{ errors.login }}</span>
            </div>

            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-slate-300">Secret Token (Password)</label>
              <UInput v-model="password" class="w-full" v-bind="passwordAttrs" type="password" placeholder="••••••••" :ui="uiInputStyle" />
              <span v-if="errors.password" class="text-xs text-rose-500 block mt-1">{{ errors.password }}</span>
            </div>

            <button :disabled="isLoading" type="submit" class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-purple-600/10 mt-6">
              <span>{{ isLoading ? 'Authenticating Core...' : 'Enter Console' }}</span>
              <KeyIcon v-if="!isLoading" class="h-4 w-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>