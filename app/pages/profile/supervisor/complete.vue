<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'

definePageMeta({
  layout: 'blank',
})

const config = useRuntimeConfig()
const appToast = useAppToast()
const queryClient = useQueryClient()
const authStore = useAuthStore()

const { data: userData, error: authError } = useQuery({
  queryKey: ['auth-me'],
  queryFn: async () => {
    const token = authStore.token
    if (!token) throw new Error('No token found')

    return await $fetch(`http://127.0.0.1:8000/api/auth/me`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
  },
  retry: false
})

watch(authError, (err) => {
  if (err) {
    console.error('Auth error:', err)
    appToast.error('Session Expired', 'Please login again')
    navigateTo('/auth/login')
  }
})

const researchInterestsList = ref([
  'Artificial Intelligence',
  'Machine Learning',
  'Web Development',
  'Mobile Development',
  'Cloud Computing',
  'Cybersecurity',
  'Data Science',
  'Blockchain',
  'IoT',
  'Natural Language Processing',
  'Computer Vision',
  'Software Engineering',
  'Vue',
  'Node',
  'Laravel',
  'React',
  'Php',
  'Python',
  'JavaScript',
  'TypeScript'
])

const customInterest = ref('')

const validationSchema = toTypedSchema(
  z.object({
    full_name: z.string().min(3, 'Full name must be at least 3 characters'),
    academic_title: z.string().min(1, 'Academic title is required'),
    department: z.string().min(1, 'Department is required'),
    bio: z.string().min(10, 'Bio must be at least 10 characters'),
    research_interests: z.array(z.string()).min(1, 'At least one research interest is required'),
  }),
)

const { handleSubmit, errors, defineField, resetForm } = useForm({
  validationSchema,
  initialValues: {
    full_name: '',
    academic_title: 'Doctor',
    department: '',
    bio: '',
    research_interests: [],
  },
})

const [fullName, fullNameAttrs] = defineField('full_name')
const [academicTitle, academicTitleAttrs] = defineField('academic_title')
const [department, departmentAttrs] = defineField('department')
const [bio, bioAttrs] = defineField('bio')
const [researchInterests] = defineField('research_interests')

watch(() => userData.value, (response) => {
  if (response?.data) {
    const data = response.data
    const profile = data.profile || {}
    resetForm({
      values: {
        full_name: profile.full_name || data.name || '',
        academic_title: profile.academic_title || 'Doctor',
        department: profile.department || '',
        bio: profile.bio || '',
        research_interests: data.research_interests || [],
      }
    })
  }
}, { immediate: true })

const { mutate: updateProfile, isPending: isLoading } = useMutation({
  mutationFn: async (payload: any) => {
    const token = authStore.token
    return await $fetch(`http://127.0.0.1:8000/api/profile/supervisor/complete`, {
      method: 'PUT',
      body: payload,
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
  },
  onSuccess: () => {
    appToast.success('Profile Updated!', 'Your profile has been updated successfully.')
    queryClient.invalidateQueries({ queryKey: ['auth-me'] })
  },
  onError: (error: any) => {
    appToast.error('Error', error?.data?.message || 'Failed to update profile')
  }
})

const addCustomInterest = (): void => {
  const trimmed = customInterest.value.trim()
  if (!trimmed) return

  const existing = researchInterestsList.value.find(i => i.toLowerCase() === trimmed.toLowerCase())
  const target = existing || trimmed

  if (!existing) {
    researchInterestsList.value.push(trimmed)
  }

  if (!Array.isArray(researchInterests.value)) {
    researchInterests.value = []
  }

  if (!researchInterests.value.includes(target)) {
    researchInterests.value = [...researchInterests.value, target]
  }

  customInterest.value = ''
}

const onSubmit = handleSubmit((formValues) => {
  const payload = {
    full_name: formValues.full_name,
    academic_title: formValues.academic_title,
    department: formValues.department,
    bio: formValues.bio,
    research_interests: formValues.research_interests || [],
  }
  updateProfile(payload)
})

const uiInputStyle = {
  root: 'rounded-lg',
  base: 'bg-input-bg border-input-border text-white placeholder-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm py-2.5 px-3 w-full',
}

const uiSelectStyle = {
  root: 'rounded-lg w-full',
  base: 'bg-input-bg border-input-border text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm py-2.5 px-3 w-full cursor-pointer',
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
            Complete Your Profile
          </h1>
          <p class="text-slate-400 text-base leading-relaxed">
            Please provide your professional details to help students find and connect with you for their graduation projects.
          </p>
        </div>

        <div class="space-y-4">
          <div class="flex items-start gap-4 p-4 rounded-xl border border-border-dark bg-brand-bg/50 backdrop-blur-sm">
            <div class="p-2 rounded-lg bg-blue-600/10 text-blue-400 mt-0.5">
              <UIcon name="i-heroicons-user" class="h-5 w-5" />
            </div>
            <div>
              <h4 class="font-bold text-white">Professional Identity</h4>
              <p class="text-xs text-slate-400 mt-0.5">Share your academic title and department</p>
            </div>
          </div>

          <div class="flex items-start gap-4 p-4 rounded-xl border border-border-dark bg-brand-bg/50 backdrop-blur-sm">
            <div class="p-2 rounded-lg bg-emerald-600/10 text-emerald-400 mt-0.5">
              <UIcon name="i-heroicons-clock" class="h-5 w-5" />
            </div>
            <div>
              <h4 class="font-bold text-white">Availability</h4>
              <p class="text-xs text-slate-400 mt-0.5">Set your office hours for student meetings</p>
            </div>
          </div>

          <div class="flex items-start gap-4 p-4 rounded-xl border border-border-dark bg-brand-bg/50 backdrop-blur-sm">
            <div class="p-2 rounded-lg bg-purple-600/10 text-purple-400 mt-0.5">
              <UIcon name="i-heroicons-light-bulb" class="h-5 w-5" />
            </div>
            <div>
              <h4 class="font-bold text-white">Research Interests</h4>
              <p class="text-xs text-slate-400 mt-0.5">Help students find supervisors matching their interests</p>
            </div>
          </div>
        </div>
      </div>

      <div class="text-xs text-slate-500 font-medium">
        Trusted by 50+ universities worldwide
      </div>
    </div>

    <div class="w-full md:w-1/2 flex flex-col justify-center items-center px-6 py-12 lg:px-16 bg-brand-deep">
      <div class="w-full max-w-lg">
        <div class="text-center md:text-left space-y-1 mb-8">
          <h2 class="text-3xl font-black text-white tracking-tight">Supervisor Profile</h2>
          <p class="text-slate-400">Complete your professional information</p>
        </div>

        <form class="border border-border-dark bg-brand-dark p-8 rounded-xl shadow-xl space-y-5" @submit.prevent="onSubmit">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-slate-300">Full Name</label>
              <UInput
                v-model="fullName"
                v-bind="fullNameAttrs"
                type="text"
                placeholder="Dr. Ahmad Supervisor"
                :ui="uiInputStyle"
              />
              <span v-if="errors.full_name" class="text-xs text-rose-500 block mt-1">{{ errors.full_name }}</span>
            </div>

            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-slate-300">Academic Title</label>
              <select
                v-model="academicTitle"
                v-bind="academicTitleAttrs"
                :class="uiSelectStyle.base"
              >
                <option value="Doctor">Doctor</option>
                <option value="Professor">Professor</option>
                <option value="Engineer">Engineer</option>
              </select>
              <span v-if="errors.academic_title" class="text-xs text-rose-500 block mt-1">{{ errors.academic_title }}</span>
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-slate-300">Department</label>
            <select
              v-model="department"
              v-bind="departmentAttrs"
              :class="uiSelectStyle.base"
            >
              <option value="" disabled>Select your department</option>
              <option value="Software Engineering">Software Engineering</option>
              <option value="Computer Science Engineering">Computer Science Engineering</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Artificial Intelligence & Machine Learning">Artificial Intelligence & Machine Learning</option>
              <option value="Data Science">Data Science</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="Cloud Computing">Cloud Computing</option>
              <option value="Internet of Things (IoT)">Internet of Things (IoT)</option>
              <option value="Robotics">Robotics</option>
              <option value="Game Development">Game Development</option>
              <option value="Computer Networks">Computer Networks</option>
              <option value="Computer Engineering">Computer Engineering</option>
              <option value="Information Engineering">Information Engineering</option>
              <option value="Human-Computer Interaction">Human-Computer Interaction</option>
              <option value="Computer Graphics">Computer Graphics</option>
              <option value="Database Systems">Database Systems</option>
            </select>
            <span v-if="errors.department" class="text-xs text-rose-500 block mt-1">{{ errors.department }}</span>
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-slate-300">Biography</label>
            <textarea
              v-model="bio"
              v-bind="bioAttrs"
              rows="3"
              class="w-full bg-input-bg border border-input-border rounded-lg p-3 text-sm text-white placeholder-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none resize-none"
              placeholder="Brief summary about your research and interests..."
            />
            <span v-if="errors.bio" class="text-xs text-rose-500 block mt-1">{{ errors.bio }}</span>
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-slate-300">Research Interests</label>
            <USelectMenu
              v-model="researchInterests"
              :items="researchInterestsList"
              multiple
              searchable
              placeholder="Select research interests..."
              class="w-full"
              :ui-menu="{
                background: 'bg-brand-dark',
                border: 'border border-border-dark',
                option: { text: 'text-white active:bg-blue-600 font-medium' },
                input: 'bg-brand-deep border-border-dark text-white placeholder-slate-500 focus:ring-1 focus:ring-blue-500',
              }"
            />
            <span v-if="errors.research_interests" class="text-xs text-rose-500 block mt-1">{{ errors.research_interests }}</span>
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-slate-400">Can't find an interest? Add it manually:</label>
            <div class="flex gap-2">
              <UInput
                v-model="customInterest"
                type="text"
                placeholder="e.g. Quantum Computing"
                :ui="uiInputStyle"
                class="flex-1"
                @keydown.enter.prevent="addCustomInterest"
              />
              <button
                type="button"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                @click="addCustomInterest"
              >
                Add
              </button>
            </div>
          </div>

          <div class="pt-2">
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-brand-purple hover:bg-brand-purple-hover active:bg-brand-purple-active text-white font-bold text-sm transition-all shadow-md shadow-blue-600/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{{ isLoading ? 'Updating Profile...' : 'Update Profile' }}</span>
              <UIcon v-if="!isLoading" name="i-heroicons-arrow-right" class="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>