<script setup lang="ts">
import { useI18n } from '~/composables/useI18n.js'

const props = defineProps<{
  project: ProjectIdea | null
  isSaving: boolean
}>()

const emit = defineEmits<{
  submit: []
  saveDraft: []
}>()

const { t, dir } = useI18n()

const form = defineModel<ProposalPayload>('form', { required: true })
const mindMapProblemPreview = defineModel<string | null>('mindMapProblemPreview', { default: null })
const mindMapSolutionPreview = defineModel<string | null>('mindMapSolutionPreview', { default: null })

const mindMapProblemInput = ref<HTMLInputElement | null>(null)
const mindMapSolutionInput = ref<HTMLInputElement | null>(null)

const initializeFromProposal = (proposal: ProjectProposal | null): void => {
  if (!proposal) return

  if (!mindMapProblemPreview.value?.startsWith('blob:')) {
    mindMapProblemPreview.value = proposal.mind_map_problem_url || null
  }

  if (!mindMapSolutionPreview.value?.startsWith('blob:')) {
    mindMapSolutionPreview.value = proposal.mind_map_solution_url || null
  }
}


defineExpose({
  initializeFromProposal,
})

const handleMindMapProblem = (event: Event): void => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    form.value.mind_map_problem = target.files[0]
    mindMapProblemPreview.value = URL.createObjectURL(target.files[0])
  }
}

const handleMindMapSolution = (event: Event): void => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    form.value.mind_map_solution = target.files[0]
    mindMapSolutionPreview.value = URL.createObjectURL(target.files[0])
  }
}

const clearMindMapProblem = (): void => {
  form.value.mind_map_problem = null
  mindMapProblemPreview.value = null
  if (mindMapProblemInput.value) mindMapProblemInput.value.value = ''
}

const clearMindMapSolution = (): void => {
  form.value.mind_map_solution = null
  mindMapSolutionPreview.value = null
  if (mindMapSolutionInput.value) mindMapSolutionInput.value.value = ''
}
</script>

<template>
  <div class="flex-1 p-4 md:p-8 overflow-y-auto" :dir="dir">
    <div class="mx-auto max-w-4xl">
      <div class="mb-6">
        <span
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold border"
          :class="form.status === 'draft' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'"
        >
          <span class="h-1.5 w-1.5 rounded-full" :class="form.status === 'draft' ? 'bg-amber-400' : 'bg-emerald-400'" />
          {{ form.status === 'draft' ? t('draft') : t('submitted') }}
        </span>
      </div>

      <div class="mb-8">
        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{{ t('projectTitle') }}</label>
        <input
          v-model="form.title"
          type="text"
          :placeholder="t('enterTitle')"
          class="w-full bg-transparent text-2xl md:text-3xl font-bold text-white placeholder-slate-600 focus:outline-none border-b border-transparent focus:border-brand-purple/50 pb-2 transition-colors"
          :class="dir === 'rtl' ? 'text-right' : 'text-left'"
        >
      </div>

      <div class="mb-8">
        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{{ t('problem') }}</label>
        <textarea
          v-model="form.problem"
          rows="3"
          :placeholder="t('describeProblem')"
          class="w-full bg-transparent text-sm text-slate-300 placeholder-slate-600 focus:outline-none border-b border-transparent focus:border-brand-purple/50 pb-2 transition-colors resize-none"
          :class="dir === 'rtl' ? 'text-right' : 'text-left'"
        />
      </div>

      <div class="mb-8">
        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{{ t('problemOverview') }}</label>
        <textarea
          v-model="form.problem_overview"
          rows="4"
          :placeholder="t('problemDetails')"
          class="w-full bg-transparent text-sm text-slate-300 placeholder-slate-600 focus:outline-none border-b border-transparent focus:border-brand-purple/50 pb-2 transition-colors resize-none"
          :class="dir === 'rtl' ? 'text-right' : 'text-left'"
        />
      </div>

      <div class="mb-8">
        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{{ t('comparison') }}</label>
        <textarea
          v-model="form.comparison_table_with_similar_applications"
          rows="4"
          :placeholder="t('compareApps')"
          class="w-full bg-transparent text-sm text-slate-300 placeholder-slate-600 focus:outline-none border-b border-transparent focus:border-brand-purple/50 pb-2 transition-colors resize-none"
          :class="dir === 'rtl' ? 'text-right' : 'text-left'"
        />
      </div>

      <div class="mb-8">
        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{{ t('targetUsers') }}</label>
        <textarea
          v-model="form.project_users"
          rows="3"
          :placeholder="t('targetUsersPlaceholder')"
          class="w-full bg-transparent text-sm text-slate-300 placeholder-slate-600 focus:outline-none border-b border-transparent focus:border-brand-purple/50 pb-2 transition-colors resize-none"
          :class="dir === 'rtl' ? 'text-right' : 'text-left'"
        />
      </div>

      <div class="mb-8">
        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">{{ t('problemMindMap') }}</label>
        <div
          class="border-2 border-dashed border-slate-700 rounded-xl p-4 md:p-6 text-center hover:border-brand-purple/50 transition-colors cursor-pointer"
          @click="mindMapProblemInput?.click()"
        >
          <input
            ref="mindMapProblemInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleMindMapProblem"
          >
          <div v-if="mindMapProblemPreview" class="relative inline-block">
            <img :key="mindMapProblemPreview" :src="mindMapProblemPreview + (mindMapProblemPreview?.startsWith('http') ? '?t=' + Date.now() : '')"  class="max-h-48 rounded-lg" alt="Problem Mind Map">
            <button
              class="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-rose-500 text-white flex items-center justify-center"
              @click.stop="clearMindMapProblem"
            >
              <UIcon name="i-heroicons-x-mark" class="h-3 w-3" />
            </button>
          </div>
          <div v-else>
            <UIcon name="i-heroicons-photo" class="h-8 w-8 text-slate-600 mx-auto mb-2" />
            <p class="text-xs text-slate-500">{{ t('clickUpload') }}</p>
          </div>
        </div>
      </div>

      <div class="mb-8">
        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{{ t('solutionOverview') }}</label>
        <textarea
          v-model="form.solution_overview"
          rows="4"
          :placeholder="t('solutionHighLevel')"
          class="w-full bg-transparent text-sm text-slate-300 placeholder-slate-600 focus:outline-none border-b border-transparent focus:border-brand-purple/50 pb-2 transition-colors resize-none"
          :class="dir === 'rtl' ? 'text-right' : 'text-left'"
        />
      </div>

      <div class="mb-8">
        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{{ t('proposedSolution') }}</label>
        <textarea
          v-model="form.proposed_solution"
          rows="5"
          :placeholder="t('solutionDetailed')"
          class="w-full bg-transparent text-sm text-slate-300 placeholder-slate-600 focus:outline-none border-b border-transparent focus:border-brand-purple/50 pb-2 transition-colors resize-none"
          :class="dir === 'rtl' ? 'text-right' : 'text-left'"
        />
      </div>

      <div class="mb-8">
        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">{{ t('solutionMindMap') }}</label>
        <div
          class="border-2 border-dashed border-slate-700 rounded-xl p-4 md:p-6 text-center hover:border-brand-purple/50 transition-colors cursor-pointer"
          @click="mindMapSolutionInput?.click()"
        >
          <input
            ref="mindMapSolutionInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleMindMapSolution"
          >
          <div v-if="mindMapSolutionPreview" class="relative inline-block">
            <img :key="mindMapSolutionPreview" :src="mindMapSolutionPreview + (mindMapSolutionPreview?.startsWith('http') ? '?t=' + Date.now() : '')"  class="max-h-48 rounded-lg" alt="Solution Mind Map">
            <button
              class="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-rose-500 text-white flex items-center justify-center"
              @click.stop="clearMindMapSolution"
            >
              <UIcon name="i-heroicons-x-mark" class="h-3 w-3" />
            </button>
          </div>
          <div v-else>
            <UIcon name="i-heroicons-photo" class="h-8 w-8 text-slate-600 mx-auto mb-2" />
            <p class="text-xs text-slate-500">{{ t('clickUpload') }}</p>
          </div>
        </div>
      </div>

      <div class="mb-8">
        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{{ t('functionalReq') }}</label>
        <textarea
          v-model="form.functional_requirements"
          rows="4"
          :placeholder="t('functionalPlaceholder')"
          class="w-full bg-transparent text-sm text-slate-300 placeholder-slate-600 focus:outline-none border-b border-transparent focus:border-brand-purple/50 pb-2 transition-colors resize-none"
          :class="dir === 'rtl' ? 'text-right' : 'text-left'"
        />
      </div>

      <div class="mb-8">
        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{{ t('nonFunctionalReq') }}</label>
        <textarea
          v-model="form.non_functional_requirements"
          rows="3"
          :placeholder="t('nonFunctionalPlaceholder')"
          class="w-full bg-transparent text-sm text-slate-300 placeholder-slate-600 focus:outline-none border-b border-transparent focus:border-brand-purple/50 pb-2 transition-colors resize-none"
          :class="dir === 'rtl' ? 'text-right' : 'text-left'"
        />
      </div>

      <div class="mb-8">
        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{{ t('projectManagement') }}</label>
        <textarea
          v-model="form.project_management"
          rows="3"
          :placeholder="t('managementPlaceholder')"
          class="w-full bg-transparent text-sm text-slate-300 placeholder-slate-600 focus:outline-none border-b border-transparent focus:border-brand-purple/50 pb-2 transition-colors resize-none"
          :class="dir === 'rtl' ? 'text-right' : 'text-left'"
        />
      </div>

      <div class="mb-8">
        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{{ t('programmingLanguages') }}</label>
        <input
          v-model="form.programming_languages"
          type="text"
          :placeholder="t('techPlaceholder')"
          class="w-full bg-transparent text-sm text-slate-300 placeholder-slate-600 focus:outline-none border-b border-transparent focus:border-brand-purple/50 pb-2 transition-colors"
          :class="dir === 'rtl' ? 'text-right' : 'text-left'"
        >
      </div>

      <div class="mb-8">
        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{{ t('teamMembers') }}</label>
        <textarea
          v-model="form.project_teams"
          rows="2"
          :placeholder="t('teamPlaceholder')"
          class="w-full bg-transparent text-sm text-slate-300 placeholder-slate-600 focus:outline-none border-b border-transparent focus:border-brand-purple/50 pb-2 transition-colors resize-none"
          :class="dir === 'rtl' ? 'text-right' : 'text-left'"
        />
      </div>

      <div class="mb-8">
        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{{ t('requiredSkills') }}</label>
        <div class="flex flex-wrap gap-2" :class="dir === 'rtl' ? 'justify-end' : 'justify-start'">
          <span
            v-for="skill in project?.required_skills || []"
            :key="skill"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold border bg-slate-500/10 text-slate-400 border-slate-700/50"
          >
            {{ skill }}
          </span>
          <span v-if="!project?.required_skills?.length" class="text-xs text-slate-600 italic">{{ t('noSkills') }}</span>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-800" :class="dir === 'rtl' ? 'flex-row-reverse' : ''">
        <button
          class="flex-1 flex items-center justify-center gap-2 bg-brand-purple hover:bg-brand-purple-hover text-white text-sm font-medium px-5 py-3 rounded-xl transition-all disabled:opacity-50"
          :disabled="isSaving"
          @click="emit('submit')"
        >
          <UIcon v-if="isSaving" name="i-heroicons-arrow-path" class="h-4 w-4 animate-spin" />
          <UIcon v-else name="i-heroicons-paper-airplane" class="h-4 w-4" />
          {{ isSaving ? t('saving') : t('submitProposal') }}
        </button>
      </div>
    </div>
  </div>
</template>