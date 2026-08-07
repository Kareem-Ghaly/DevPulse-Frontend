<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import type { GradePayload } from '~/types/committee.types'

const route = useRoute()
const submissionId = computed(() => Number(route.params.id) || 0)

const { singleSubmission, isLoading, isSubmitting, fetchSubmissionById, gradeSubmission } = useCommitteeSubmissions()

const validationSchema = toTypedSchema(
  z.object({
    proposal_grade: z.number().min(0).max(100),
    proposal_feedback: z.string().min(1, 'Feedback is required'),
    presentation_grade: z.number().min(0).max(100),
    presentation_feedback: z.string().min(1, 'Feedback is required'),
    code_grade: z.number().min(0).max(100),
    code_feedback: z.string().min(1, 'Feedback is required'),
  }),
)

const { handleSubmit, errors, defineField, resetForm } = useForm<GradePayload>({
  validationSchema,
  initialValues: {
    proposal_grade: 0,
    proposal_feedback: '',
    presentation_grade: 0,
    presentation_feedback: '',
    code_grade: 0,
    code_feedback: '',
  },
})

const [proposalGrade, proposalGradeAttrs] = defineField('proposal_grade')
const [proposalFeedback, proposalFeedbackAttrs] = defineField('proposal_feedback')
const [presentationGrade, presentationGradeAttrs] = defineField('presentation_grade')
const [presentationFeedback, presentationFeedbackAttrs] = defineField('presentation_feedback')
const [codeGrade, codeGradeAttrs] = defineField('code_grade')
const [codeFeedback, codeFeedbackAttrs] = defineField('code_feedback')

onMounted(() => {
  if (submissionId.value) {
    fetchSubmissionById(submissionId.value)
  }
})

watch(singleSubmission, (sub) => {
  if (sub && sub.status === 'graded') {
    resetForm({
      values: {
        proposal_grade: Number(sub.proposal_grade) || 0,
        proposal_feedback: sub.proposal_feedback || '',
        presentation_grade: Number(sub.presentation_grade) || 0,
        presentation_feedback: sub.presentation_feedback || '',
        code_grade: Number(sub.code_grade) || 0,
        code_feedback: sub.code_feedback || '',
      },
    })
  }
})

const onSubmit = handleSubmit(async (formValues) => {
  await gradeSubmission(submissionId.value, formValues)
  await fetchSubmissionById(submissionId.value)
})

const goBack = () => {
  navigateTo('/committee/submissions')
}

const formatDate = (date: string | null) => {
  if (!date) return '-'
  
  return new Date(date).toLocaleDateString()
}

const uiInputStyle = {
  root: 'rounded-lg',
  base: 'bg-input-bg border-input-border text-white placeholder-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm py-2.5 px-3 w-full',
}
</script>

<template>
  <div class="min-h-screen bg-brand-deep text-slate-100">
    <CommitteeNavbar />
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex items-center gap-3 mb-6">
        <button
          class="text-slate-400 hover:text-white transition-colors cursor-pointer"
          @click="goBack"
        >
          <UIcon name="i-heroicons-arrow-left" class="h-5 w-5" />
        </button>
        <h1 class="text-xl font-black text-white tracking-tight">
          Grade Submission
        </h1>
      </div>

      <div v-if="isLoading" class="text-center py-12 text-slate-400">
        <UIcon name="i-heroicons-arrow-path" class="h-8 w-8 animate-spin mx-auto mb-3" />
        <p>Loading submission...</p>
      </div>

      <div v-else-if="!singleSubmission" class="text-center py-12">
        <UIcon name="i-heroicons-exclamation-triangle" class="h-12 w-12 mx-auto mb-3 text-slate-600" />
        <h3 class="text-lg font-bold text-white mb-1">
          Submission not found
        </h3>
        <button class="mt-4 text-brand-purple text-sm font-bold cursor-pointer" @click="goBack">
          Back to list
        </button>
      </div>

      <div v-else class="space-y-6">
        <div
          class="flex items-center justify-between p-4 rounded-xl border"
          :class="singleSubmission.status === 'graded' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-amber-500/5 border-amber-500/20'"
        >
          <div>
            <span class="text-xs font-bold text-slate-500 uppercase tracking-widest">Status</span>
            <p
              class="text-sm font-bold mt-1 capitalize"
              :class="singleSubmission.status === 'graded' ? 'text-emerald-400' : 'text-amber-400'"
            >
              {{ singleSubmission.status }}
            </p>
          </div>
          <div v-if="singleSubmission.total_grade">
            <span class="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Grade</span>
            <p class="text-sm text-emerald-400 font-bold mt-1">
              {{ singleSubmission.total_grade }}
            </p>
          </div>
          <div>
            <span class="text-xs font-bold text-slate-500 uppercase tracking-widest">Submitted</span>
            <p class="text-sm text-slate-300 mt-1">
              {{ formatDate(singleSubmission.created_at) }}
            </p>
          </div>
        </div>

        <div class="bg-panel-dark border border-border-dark rounded-xl p-5">
          <h2 class="text-sm font-bold text-white mb-4 uppercase tracking-widest">
            Submission Links
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              :href="singleSubmission.proposal_drive_link"
              target="_blank"
              class="flex items-center gap-3 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <UIcon name="i-heroicons-document-text" class="h-5 w-5 text-blue-400" />
              <div>
                <p class="text-xs font-bold text-white">Proposal Document</p>
                <p class="text-[10px] text-slate-400">Open in Google Drive</p>
              </div>
            </a>
            <a
              :href="singleSubmission.presentation_drive_link"
              target="_blank"
              class="flex items-center gap-3 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <UIcon name="i-heroicons-presentation-chart-line" class="h-5 w-5 text-purple-400" />
              <div>
                <p class="text-xs font-bold text-white">Presentation</p>
                <p class="text-[10px] text-slate-400">Open in Google Drive</p>
              </div>
            </a>
            <a
              :href="singleSubmission.code_drive_link"
              target="_blank"
              class="flex items-center gap-3 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <UIcon name="i-heroicons-code-bracket" class="h-5 w-5 text-emerald-400" />
              <div>
                <p class="text-xs font-bold text-white">Source Code</p>
                <p class="text-[10px] text-slate-400">Open in Google Drive</p>
              </div>
            </a>
            <a
              v-if="singleSubmission.student_notes"
              :href="singleSubmission.student_notes"
              target="_blank"
              class="flex items-center gap-3 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <UIcon name="i-heroicons-chat-bubble-left-text" class="h-5 w-5 text-amber-400" />
              <div>
                <p class="text-xs font-bold text-white">Student Notes</p>
                <p class="text-[10px] text-slate-400">Open in Google Drive</p>
              </div>
            </a>
          </div>
        </div>

        <form class="bg-panel-dark border border-border-dark rounded-xl p-5 space-y-5" @submit.prevent="onSubmit">
          <h2 class="text-sm font-bold text-white uppercase tracking-widest">
            Evaluation
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-slate-300">Proposal Grade (0-100)</label>
              <UInput
                v-model.number="proposalGrade"
                v-bind="proposalGradeAttrs"
                type="number"
                min="0"
                max="100"
                placeholder="85"
                :ui="uiInputStyle"
              />
              <span v-if="errors.proposal_grade" class="text-xs text-rose-500 block mt-1">{{ errors.proposal_grade }}</span>
            </div>

            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-slate-300">Presentation Grade (0-100)</label>
              <UInput
                v-model.number="presentationGrade"
                v-bind="presentationGradeAttrs"
                type="number"
                min="0"
                max="100"
                placeholder="90"
                :ui="uiInputStyle"
              />
              <span v-if="errors.presentation_grade" class="text-xs text-rose-500 block mt-1">{{ errors.presentation_grade }}</span>
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-slate-300">Code Grade (0-100)</label>
            <UInput
              v-model.number="codeGrade"
              v-bind="codeGradeAttrs"
              type="number"
              min="0"
              max="100"
              placeholder="88"
              :ui="uiInputStyle"
            />
            <span v-if="errors.code_grade" class="text-xs text-rose-500 block mt-1">{{ errors.code_grade }}</span>
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-slate-300">Proposal Feedback</label>
            <textarea
              v-model="proposalFeedback"
              v-bind="proposalFeedbackAttrs"
              rows="3"
              class="w-full bg-input-bg border border-input-border rounded-lg p-3 text-sm text-white placeholder-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none resize-none"
              placeholder="Enter feedback about the proposal..."
            />
            <span v-if="errors.proposal_feedback" class="text-xs text-rose-500 block mt-1">{{ errors.proposal_feedback }}</span>
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-slate-300">Presentation Feedback</label>
            <textarea
              v-model="presentationFeedback"
              v-bind="presentationFeedbackAttrs"
              rows="3"
              class="w-full bg-input-bg border border-input-border rounded-lg p-3 text-sm text-white placeholder-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none resize-none"
              placeholder="Enter feedback about the presentation..."
            />
            <span v-if="errors.presentation_feedback" class="text-xs text-rose-500 block mt-1">{{ errors.presentation_feedback }}</span>
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-slate-300">Code Feedback</label>
            <textarea
              v-model="codeFeedback"
              v-bind="codeFeedbackAttrs"
              rows="3"
              class="w-full bg-input-bg border border-input-border rounded-lg p-3 text-sm text-white placeholder-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none resize-none"
              placeholder="Enter feedback about the code..."
            />
            <span v-if="errors.code_feedback" class="text-xs text-rose-500 block mt-1">{{ errors.code_feedback }}</span>
          </div>

          <div class="pt-2">
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-brand-purple hover:bg-brand-purple-hover active:bg-brand-purple-active text-white font-bold text-sm transition-all shadow-md shadow-blue-600/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <UIcon v-if="!isSubmitting" name="i-heroicons-check-circle" class="h-4 w-4" />
              <span>{{ isSubmitting ? 'Saving...' : 'Submit Grades' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>