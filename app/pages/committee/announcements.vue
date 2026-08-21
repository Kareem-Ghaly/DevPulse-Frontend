<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import type { AnnouncementPayload } from '~/types/committee.types'

const { publishAnnouncement, isLoading } = useCommitteeAnnouncements()

const validationSchema = toTypedSchema(
  z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    body: z.string().min(10, 'Body must be at least 10 characters'),
  }),
)

const { handleSubmit, errors, defineField, resetForm } = useForm<AnnouncementPayload>({
  validationSchema,
  initialValues: {
    title: '',
    body: '',
  },
})

const [title, titleAttrs] = defineField('title')
const [body, bodyAttrs] = defineField('body')

const onSubmit = handleSubmit(async (formValues) => {
  const result = await publishAnnouncement(formValues)
  if (result) {
    resetForm()
  }
})

const uiInputStyle = {
  root: 'rounded-lg',
  base: 'bg-input-bg border-input-border text-white placeholder-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm py-2.5 px-3 w-full',
}
</script>

<template>
  <div class="min-h-screen bg-brand-deep text-slate-100">
    <CommitteeNavbar />
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-2xl font-black text-white tracking-tight">
          Publish Announcement
        </h1>
        <p class="text-slate-400 text-sm mt-1">
          Send an important update to all project teams
        </p>
      </div>

      <form class="border border-border-dark bg-brand-dark p-8 rounded-xl shadow-xl space-y-5" @submit.prevent="onSubmit">
        <div class="space-y-1.5 w-full">
          <label class="block text-xs font-bold text-slate-300">Title</label>
          <UInput
            v-model="title"
            v-bind="titleAttrs"
            type="text"
            class="w-full"
            placeholder="Enter announcement title..."
            :ui="uiInputStyle"
          />
          <span v-if="errors.title" class="text-xs text-rose-500 block mt-1">{{ errors.title }}</span>
        </div>

        <div class="space-y-1.5">
          <label class="block text-xs font-bold text-slate-300">Body</label>
          <textarea
            v-model="body"
            v-bind="bodyAttrs"
            rows="6"
            class="w-full bg-input-bg border border-input-border rounded-lg p-3 text-sm text-white placeholder-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none resize-none"
            placeholder="Write the announcement content here..."
          />
          <span v-if="errors.body" class="text-xs text-rose-500 block mt-1">{{ errors.body }}</span>
        </div>

        <div class="pt-2">
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-brand-purple hover:bg-brand-purple-hover active:bg-brand-purple-active text-white font-bold text-sm transition-all shadow-md shadow-blue-600/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UIcon v-if="!isLoading" name="i-heroicons-paper-airplane" class="h-4 w-4" />
            <span>{{ isLoading ? 'Publishing...' : 'Publish Announcement' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>