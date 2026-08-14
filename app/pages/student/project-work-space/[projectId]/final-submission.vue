<script setup lang="ts">
import { reactive, computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import AppTopNav from '~/components/layout/AppTopNav.vue'

const route = useRoute()
const api = useApiClient()
const appToast = useAppToast()

const projectIdeaId = computed(() => Number(route.params.projectId) || 0)
const projectTeamId = ref<number | null>(null)

const { submission, isLoading, isSubmitting, fetchSubmission, submit } = useFinalSubmission(projectTeamId)

const form = reactive({
  proposal_drive_link: '',
  presentation_drive_link: '',
  code_drive_link: '',
  student_notes: '',
})

const finalGrade = computed(() => {
  if (!submission.value) return 0
  
  const proposal = Number(submission.value.proposal_grade) || 0
  const presentation = Number(submission.value.presentation_grade) || 0
  const code = Number(submission.value.code_grade) || 0
  
  if (proposal === 0 && presentation === 0 && code === 0) return 0
  
  return Math.round((proposal + presentation + code) / 3)
})

const fetchTeam = async () => {
  if (!projectIdeaId.value) {
    return
  }

  try {
    const res = await api.request(`/project-ideas/${projectIdeaId.value}/team`)
    projectTeamId.value = res.data?.team?.id || null
  }
  catch (error: unknown) {
    const err = error as { message?: string }
    appToast.error('Error', err.message || 'Failed to load team')
  }
}

onMounted(async () => {
  await fetchTeam()
  if (projectTeamId.value) {
    const data = await fetchSubmission()
    if (data) {
      form.proposal_drive_link = data.proposal_drive_link || ''
      form.presentation_drive_link = data.presentation_drive_link || ''
      form.code_drive_link = data.code_drive_link || ''
      form.student_notes = data.student_notes || ''
    }
  }
})

const handleSubmit = (): void => {
  submit(form)
}
</script>

<template>
  <div>
    <AppTopNav />
    <div class="flex-1 p-4 md:p-8 overflow-y-auto">
      <div class="max-w-2xl mx-auto">
        <h2 class="text-xl font-bold text-white mb-6">
          Final Submission
        </h2>

        <div v-if="isLoading && !projectTeamId" class="text-center text-slate-400 py-10">
          Loading team info...
        </div>

        <div v-else-if="!projectTeamId" class="text-center  text-slate-400 py-10">
          Loading for Submission
        </div>

        <div v-else-if="!submission || submission.status === 'rejected'" class="bg-panel-dark border border-border-dark rounded-xl p-4 md:p-6 space-y-5">
          <div v-if="submission?.status === 'rejected'" class="bg-red-500/10 border border-red-500/20 p-4 rounded-lg text-red-400 text-sm mb-4">
            <span class="font-bold">Note:</span> Your previous submission was rejected. Please review the notes and submit again.
            <p v-if="submission.committee_notes" class="mt-2 text-xs text-slate-300">
              Committee Feedback: {{ submission.committee_notes }}
            </p>
          </div>

          <div>
            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Proposal (Google Drive)</label>
            <input
              v-model="form.proposal_drive_link"
              type="url"
              placeholder="https://drive.google.com/..."
              class="w-full bg-transparent text-sm text-white placeholder-slate-600 border-b border-slate-700 focus:border-brand-purple outline-none pb-2 transition-colors"
            >
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Presentation (Google Drive)</label>
            <input
              v-model="form.presentation_drive_link"
              type="url"
              placeholder="https://drive.google.com/..."
              class="w-full bg-transparent text-sm text-white placeholder-slate-600 border-b border-slate-700 focus:border-brand-purple outline-none pb-2 transition-colors"
            >
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Code (Google Drive)</label>
            <input
              v-model="form.code_drive_link"
              type="url"
              placeholder="https://drive.google.com/..."
              class="w-full bg-transparent text-sm text-white placeholder-slate-600 border-b border-slate-700 focus:border-brand-purple outline-none pb-2 transition-colors"
            >
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Notes for Committee</label>
            <textarea
              v-model="form.student_notes"
              rows="3"
              placeholder="Any additional notes..."
              class="w-full bg-transparent text-sm text-white placeholder-slate-600 border-b border-slate-700 focus:border-brand-purple outline-none pb-2 resize-none transition-colors"
            />
          </div>
          <button
            :disabled="isSubmitting"
            class="w-full bg-brand-purple hover:bg-brand-purple-hover text-white text-sm font-bold py-3 rounded-lg transition-all disabled:opacity-50"
            @click="handleSubmit"
          >
            {{ isSubmitting ? 'Submitting...' : 'Submit Final Work' }}
          </button>
        </div>

        <div v-else class="bg-panel-dark border border-border-dark rounded-xl p-4 md:p-6 space-y-4">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-base font-bold text-white">
              Your Grades & Status
            </h3>
            <span
              class="px-3 py-1 rounded-full text-xs font-bold capitalize"
              :class="{
                'bg-emerald-500/10 text-emerald-400': submission.status === 'graded',
                'bg-amber-500/10 text-amber-400': submission.status === 'submitted',
              }"
            >
              {{ submission.status === 'graded' ? 'Graded Successfully' : 'Pending Review' }}
            </span>
          </div>

          <div class="space-y-2 text-sm text-slate-300 border-t border-slate-800 pt-4">
            <p v-if="submission.proposal_drive_link">
              <strong>Proposal:</strong>
              <a :href="submission.proposal_drive_link" target="_blank" class="text-brand-purple underline">View Link</a>
            </p>
            <p v-if="submission.presentation_drive_link">
              <strong>Presentation:</strong>
              <a :href="submission.presentation_drive_link" target="_blank" class="text-brand-purple underline">View Link</a>
            </p>
            <p v-if="submission.code_drive_link">
              <strong>Code:</strong>
              <a :href="submission.code_drive_link" target="_blank" class="text-brand-purple underline">View Link</a>
            </p>
          </div>

          <div v-if="submission.status === 'graded'" class="mt-4 space-y-3">
            <div class="bg-slate-900/50 rounded-lg p-3 border border-slate-800">
              <div class="flex justify-between text-sm">
                <span class="text-slate-400">Proposal Grade</span>
                <span class="text-white font-bold">{{ submission.proposal_grade ?? '-' }}/100</span>
              </div>
              <p v-if="submission.proposal_feedback" class="text-xs text-slate-500 mt-1">
                {{ submission.proposal_feedback }}
              </p>
            </div>
            <div class="bg-slate-900/50 rounded-lg p-3 border border-slate-800">
              <div class="flex justify-between text-sm">
                <span class="text-slate-400">Presentation Grade</span>
                <span class="text-white font-bold">{{ submission.presentation_grade ?? '-' }}/100</span>
              </div>
              <p v-if="submission.presentation_feedback" class="text-xs text-slate-500 mt-1">
                {{ submission.presentation_feedback }}
              </p>
            </div>
            <div class="bg-slate-900/50 rounded-lg p-3 border border-slate-800">
              <div class="flex justify-between text-sm">
                <span class="text-slate-400">Code Grade</span>
                <span class="text-white font-bold">{{ submission.code_grade ?? '-' }}/100</span>
              </div>
              <p v-if="submission.code_feedback" class="text-xs text-slate-500 mt-1">
                {{ submission.code_feedback }}
              </p>
            </div>
            
            <div class="bg-emerald-900/20 rounded-lg p-3 border border-emerald-500/20">
              <div class="flex justify-between text-sm items-center">
                <span class="text-emerald-400 font-bold">Final Grade</span>
                <span class="text-emerald-400 font-bold text-lg">{{ finalGrade }}/100</span>
              </div>
            </div>
          </div>

          <div v-else class="text-xs text-slate-500 mt-4 italic">
            Your submission is currently under review by the committee. You will be notified once grades are posted.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>