<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import type { CommitteeProfilePayload } from '~/types/committee.types'

definePageMeta({
  layout: 'blank',
})

const { completeProfile, isLoading } = useCommitteeProfile()

const validationSchema = toTypedSchema(
  z.object({
    full_name: z.string().min(3, 'Full name must be at least 3 characters'),
    academic_title: z.string().min(1, 'Academic title is required'),
    department: z.string().min(1, 'Department is required'),
    specialization: z.string().min(1, 'Specialization is required'),
    bio: z.string().min(10, 'Bio must be at least 10 characters'),
  }),
)

const { handleSubmit, errors, defineField } = useForm<CommitteeProfilePayload>({
  validationSchema,
  initialValues: {
    full_name: '',
    academic_title: 'Professor',
    department: '',
    specialization: '',
    bio: '',
  },
})

const [fullName, fullNameAttrs] = defineField('full_name')
const [academicTitle, academicTitleAttrs] = defineField('academic_title')
const [department, departmentAttrs] = defineField('department')
const [specialization, specializationAttrs] = defineField('specialization')
const [bio, bioAttrs] = defineField('bio')

const onSubmit = handleSubmit((formValues) => {
  completeProfile(formValues)
})

const uiInputStyle = {
  root: 'rounded-lg',
  base: 'bg-input-bg border-input-border text-white placeholder-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm py-2.5 px-3 w-full',
}
</script>

<template>
  <div class="">
    <CommitteeNavbar />
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
            Please provide your professional details to help students and supervisors connect with you for graduation project evaluations.
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
              <UIcon name="i-heroicons-clipboard-document-check" class="h-5 w-5" />
            </div>
            <div>
              <h4 class="font-bold text-white">Evaluate Projects</h4>
              <p class="text-xs text-slate-400 mt-0.5">Review and approve graduation proposals</p>
            </div>
          </div>

          <div class="flex items-start gap-4 p-4 rounded-xl border border-border-dark bg-brand-bg/50 backdrop-blur-sm">
            <div class="p-2 rounded-lg bg-purple-600/10 text-purple-400 mt-0.5">
              <UIcon name="i-heroicons-megaphone" class="h-5 w-5" />
            </div>
            <div>
              <h4 class="font-bold text-white">Announcements</h4>
              <p class="text-xs text-slate-400 mt-0.5">Publish important updates to all teams</p>
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
          <h2 class="text-3xl font-black text-white tracking-tight">Committee Profile</h2>
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
                placeholder="Dr. Lina Committee"
                :ui="uiInputStyle"
              />
              <span v-if="errors.full_name" class="text-xs text-rose-500 block mt-1">{{ errors.full_name }}</span>
            </div>

            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-slate-300">Academic Title</label>
              <select
                v-model="academicTitle"
                v-bind="academicTitleAttrs"
                class="w-full bg-input-bg border border-input-border rounded-lg p-2.5 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none cursor-pointer"
              >
                <option value="Professor">Professor</option>
                <option value="Doctor">Doctor</option>
                <option value="Engineer">Engineer</option>
              </select>
              <span v-if="errors.academic_title" class="text-xs text-rose-500 block mt-1">{{ errors.academic_title }}</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-slate-300">Department</label>
              <UInput
                v-model="department"
                v-bind="departmentAttrs"
                type="text"
                placeholder="Information Engineering"
                :ui="uiInputStyle"
              />
              <span v-if="errors.department" class="text-xs text-rose-500 block mt-1">{{ errors.department }}</span>
            </div>

            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-slate-300">Specialization</label>
              <UInput
                v-model="specialization"
                v-bind="specializationAttrs"
                type="text"
                placeholder="Software Project Evaluation"
                :ui="uiInputStyle"
              />
              <span v-if="errors.specialization" class="text-xs text-rose-500 block mt-1">{{ errors.specialization }}</span>
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-slate-300">Biography</label>
            <textarea
              v-model="bio"
              v-bind="bioAttrs"
              rows="4"
              class="w-full bg-input-bg border border-input-border rounded-lg p-3 text-sm text-white placeholder-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none resize-none"
              placeholder="Brief summary about your expertise and evaluation criteria..."
            />
            <span v-if="errors.bio" class="text-xs text-rose-500 block mt-1">{{ errors.bio }}</span>
          </div>

          <div class="pt-2">
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-brand-purple hover:bg-brand-purple-hover active:bg-brand-purple-active text-white font-bold text-sm transition-all shadow-md shadow-blue-600/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{{ isLoading ? 'Completing Profile...' : 'Update Profile' }}</span>
              <UIcon v-if="!isLoading" name="i-heroicons-arrow-right" class="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  </div>
</template>