<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useMutation } from '@tanstack/vue-query'
import { z } from 'zod'
import type { ProfileSetupPayload } from '~/composables/useProfileService'

definePageMeta({
  layout: 'blank',
})

const authStore = useAuthStore()
const profileService = useProfileService()
const appToast = useAppToast()

const localSkillsList = ref([
  "VUE",
  "NUXT",
  "REACT",
  "NEXT",
  "ANGULAR",
  "SVELTE",
  "JAVASCRIPT",
  "TYPESCRIPT",
  "HTML",
  "CSS",
  "TAILWIND",
  "SASS",
  "NODE",
  "EXPRESS",
  "NESTJS",
  "LARAVEL",
  "PHP",
  "PYTHON",
  "DJANGO",
  "FLASK",
  "C#",
  "ASP",
  "JAVA",
  "SPRING",
  "KOTLIN",
  "SWIFT",
  "FLUTTER",
  "REACT NATIVE",
  "SQL",
  "MYSQL",
  "POSTGRESQL",
  "SQLITE",
  "MONGODB",
  "REDIS",
  "FIREBASE",
  "DOCKER",
  "KUBERNETES",
  "AWS",
  "GIT",
  "GITHUB",
  "GRAPHQL",
  "REST API",
  "OPENAI API",
  "GEMINI API",
  "LANGCHAIN",
  "LLAMAININDEX",
  "HUGGING FACE",
  "PYTORCH",
  "TENSORFLOW",
  "N8N",
  "CISCO",
  "WIRESHARK",
  "TCP/IP",
  "DNS",
  "HTTP/HTTPS",
  "WEBSOCKETS",
  "LARAVEL REVERB",
  "LARAVEL ECHO",
  "LINUX",
  "NGINX"
])

const customSkill = ref('')

const ProfileSetupSchema = z.object({
  full_name: z.string().min(3, 'Full name is required'),
  university_id: z.string().min(2, 'University ID is required'),
  department: z.string().min(2, 'Department is required'),
  academic_year: z.string().min(1, 'Academic year is required'),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  bio: z.string().min(10, 'Bio should be at least 10 characters').optional(),
})

type ProfileSetupInput = z.infer<typeof ProfileSetupSchema>

const { handleSubmit, errors, defineField, values } = useForm<ProfileSetupInput>({
  validationSchema: toTypedSchema(ProfileSetupSchema),
  initialValues: {
    full_name: authStore.user?.name || '',
    university_id: '',
    department: '',
    academic_year: '1',
    skills: [],
    bio: '',
  },
})

const [fullName, fullNameAttrs] = defineField('full_name')
const [universityId, universityIdAttrs] = defineField('university_id')
const [department, departmentAttrs] = defineField('department')
const [academicYear, academicYearAttrs] = defineField('academic_year')
const [skillsField] = defineField('skills')
const [bio, bioAttrs] = defineField('bio')

const addCustomSkill = (): void => {
  const normalized = normalizeSkill(customSkill.value)
  if (!normalized) return

  const existingSkill = localSkillsList.value.find(s => normalizeSkill(s) === normalized)

  if (!existingSkill) {
    localSkillsList.value.push(normalized)
  }

  const targetSkill = normalizeSkill(existingSkill || normalized)

  if (values.role === 'supervisor') {
    if (!Array.isArray(researchInterestsRef.value)) {
      researchInterestsRef.value = []
    }
    if (!researchInterestsRef.value.includes(targetSkill)) {
      researchInterestsRef.value = [...researchInterestsRef.value, targetSkill]
    }
  } else {
    if (!Array.isArray(skillsField.value)) {
      skillsField.value = []
    }
    if (!skillsField.value.includes(targetSkill)) {
      skillsField.value = [...skillsField.value, targetSkill]
    }
  }

  customSkill.value = ''
}

const { mutate: executeCompleteProfile, isPending: isLoading } = useMutation({
  mutationFn: async (payload: ProfileSetupPayload) => {
    return await profileService.completeProfile(payload)
  },
  onSuccess: async (response) => {
    if (response?.status) {
      appToast.success('Profile Completed!', 'Your profile has been set up successfully.')

      if (authStore.user) {
        authStore.user.profile_completed = true
      }

      await navigateTo('/student/my-projects')
    }
  },
  onError: (error: unknown) => {
    const fetchError = error as { data?: { message?: string } }
    const message = fetchError.data?.message || 'Failed to complete profile. Please try again.'
    appToast.error('Error', message)
  },
})

const onSubmit = handleSubmit((formValues) => {
  const payload: ProfileSetupPayload = {
    full_name: formValues.full_name,
    university_id: formValues.university_id,
    department: formValues.department,
    academic_year: formValues.academic_year,
    skills: normalizeSkills(formValues.skills || []),
    bio: formValues.bio || '',
  }

  executeCompleteProfile(payload)
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
            Please provide your academic details to finish setting up your account and start using DevPulse.
          </p>
        </div>

        <div class="space-y-4">
          <div class="flex items-start gap-4 p-4 rounded-xl border border-border-dark bg-brand-bg/50 backdrop-blur-sm">
            <div class="p-2 rounded-lg bg-blue-600/10 text-blue-400 mt-0.5">
              <UIcon name="i-heroicons-academic-cap" class="h-5 w-5" />
            </div>
            <div>
              <h4 class="font-bold text-white">Academic Information</h4>
              <p class="text-xs text-slate-400 mt-0.5">
                Help us personalize your experience
              </p>
            </div>
          </div>

          <div class="flex items-start gap-4 p-4 rounded-xl border border-border-dark bg-brand-bg/50 backdrop-blur-sm">
            <div class="p-2 rounded-lg bg-indigo-600/10 text-indigo-400 mt-0.5">
              <UIcon name="i-heroicons-briefcase" class="h-5 w-5" />
            </div>
            <div>
              <h4 class="font-bold text-white">Skills & Expertise</h4>
              <p class="text-xs text-slate-400 mt-0.5">
                Showcase your technical abilities
              </p>
            </div>
          </div>

          <div class="flex items-start gap-4 p-4 rounded-xl border border-border-dark bg-brand-bg/50 backdrop-blur-sm">
            <div class="p-2 rounded-lg bg-purple-600/10 text-purple-400 mt-0.5">
              <UIcon name="i-heroicons-rocket-launch" class="h-5 w-5" />
            </div>
            <div>
              <h4 class="font-bold text-white">Get Started</h4>
              <p class="text-xs text-slate-400 mt-0.5">
                Join projects and collaborate
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="text-xs text-slate-500 font-medium">
        Step 1 of 1 — Profile Setup
      </div>
    </div>

    <div class="w-full md:w-1/2 flex flex-col justify-center items-center px-6 py-12 lg:px-16 bg-brand-deep">
      <div class="w-full max-w-lg">
        <div class="text-center md:text-left space-y-1 mb-8">
          <h2 class="text-3xl font-black text-white tracking-tight">
            Complete Your Profile
          </h2>
          <p class="text-sm text-slate-400">
            Fill in your academic details to get started
          </p>
        </div>

        <form class="border border-border-dark bg-brand-dark p-8 rounded-xl shadow-xl space-y-5" @submit.prevent="onSubmit">
          <div class="space-y-4">
            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-slate-300">Full Name</label>
              <UInput
                v-model="fullName"
                v-bind="fullNameAttrs"
                type="text"
                placeholder="Enter your full name"
                :ui="uiInputStyle"
              />
              <span v-if="errors.full_name" class="text-xs text-rose-500 block mt-1">{{ errors.full_name }}</span>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="block text-xs font-bold text-slate-300">University ID</label>
                <UInput
                  v-model="universityId"
                  v-bind="universityIdAttrs"
                  type="text"
                  placeholder="e.g. STU-2026-001"
                  :ui="uiInputStyle"
                />
                <span v-if="errors.university_id" class="text-xs text-rose-500 block mt-1">{{ errors.university_id }}</span>
              </div>
              <div class="space-y-1.5">
                <label class="block text-xs font-bold text-slate-300">Academic Year</label>
                <select
                  v-model="academicYear"
                  v-bind="academicYearAttrs"
                  :class="uiSelectStyle.base"
                >
                  <option value="1">First Year</option>
                  <option value="2">Second Year</option>
                  <option value="3">Third Year</option>
                  <option value="4">Fourth Year</option>
                  <option value="5">Fifth Year</option>
                </select>
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
              <label class="block text-xs font-bold text-slate-300">Department</label>
              <UInput
                v-model="department"
                v-bind="departmentAttrs"
                type="text"
                placeholder="e.g. Software Engineering"
                :ui="uiInputStyle"
              />
              <span v-if="errors.department" class="text-xs text-rose-500 block mt-1">{{ errors.department }}</span>
            </div>

            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-slate-300">Technical Skills</label>
              <USelectMenu
                v-model="skillsField"
                :items="localSkillsList"
                multiple
                searchable
                placeholder="Select your skills..."
                class="w-full"
                :ui-menu="{
                  background: 'bg-brand-dark',
                  border: 'border border-border-dark',
                  option: { text: 'text-white active:bg-blue-600 font-medium' },
                  input: 'bg-brand-deep border-border-dark text-white placeholder-slate-500 focus:ring-1 focus:ring-blue-500',
                }"
              />
              <span v-if="errors.skills" class="text-xs text-rose-500 block mt-1">{{ errors.skills }}</span>
            </div>

            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-slate-400">Can't find a skill? Add it manually:</label>
              <div class="flex gap-2">
                <UInput
                  v-model="customSkill"
                  type="text"
                  placeholder="e.g. Nuxt 3"
                  :ui="uiInputStyle"
                  class="flex-1"
                  @keydown.enter.prevent="addCustomSkill"
                />
                <button
                  type="button"
                  class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  @click="addCustomSkill"
                >
                  Add
                </button>
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-slate-300">Academic Biography</label>
              <textarea
                v-model="bio"
                v-bind="bioAttrs"
                rows="3"
                class="w-full bg-input-bg border border-input-border rounded-lg p-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
                placeholder="Tell us about yourself and your academic interests..."
              />
              <span v-if="errors.bio" class="text-xs text-rose-500 block mt-1">{{ errors.bio }}</span>
            </div>

            <div class="pt-2">
              <button
                type="submit"
                :disabled="isLoading"
                class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-brand-purple hover:bg-brand-purple-hover active:bg-brand-purple-active text-white font-bold text-sm transition-all shadow-md shadow-blue-600/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{{ isLoading ? 'Saving Profile...' : 'Complete Profile' }}</span>
                <UIcon v-if="!isLoading" name="i-heroicons-arrow-right" class="h-4 w-4" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
