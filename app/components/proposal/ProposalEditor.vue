<script setup lang="ts">
const props = defineProps<{
  project: ProjectIdea | null
  isSaving: boolean
}>()

const emit = defineEmits<{
  submit: []
  saveDraft: []
}>()

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
  <div class="flex-1 p-4 md:p-8 overflow-y-auto">
    <div class="mx-auto max-w-4xl">
      <div class="mb-6">
        <span
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold border"
          :class="form.status === 'draft' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'"
        >
          <span class="h-1.5 w-1.5 rounded-full" :class="form.status === 'draft' ? 'bg-amber-400' : 'bg-emerald-400'" />
          {{ form.status === 'draft' ? 'DRAFT' : 'SUBMITTED' }}
        </span>
      </div>

      <div class="mb-8">
        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Project Title</label>
        <input
          v-model="form.title"
          type="text"
          placeholder="Enter project title..."
          class="w-full bg-transparent text-2xl md:text-3xl font-bold text-white placeholder-slate-600 focus:outline-none border-b border-transparent focus:border-brand-purple/50 pb-2 transition-colors"
        >
      </div>

      <div class="mb-8">
        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Problem</label>
        <textarea
          v-model="form.problem"
          rows="3"
          placeholder="Describe the core problem your project addresses..."
          class="w-full bg-transparent text-sm text-slate-300 placeholder-slate-600 focus:outline-none border-b border-transparent focus:border-brand-purple/50 pb-2 transition-colors resize-none"
        />
      </div>

      <div class="mb-8">
        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Problem Overview</label>
        <textarea
          v-model="form.problem_overview"
          rows="4"
          placeholder="Provide a detailed overview of the problem..."
          class="w-full bg-transparent text-sm text-slate-300 placeholder-slate-600 focus:outline-none border-b border-transparent focus:border-brand-purple/50 pb-2 transition-colors resize-none"
        />
      </div>

      <div class="mb-8">
        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Comparison with Similar Applications</label>
        <textarea
          v-model="form.comparison_table_with_similar_applications"
          rows="4"
          placeholder="Compare your project with similar existing applications..."
          class="w-full bg-transparent text-sm text-slate-300 placeholder-slate-600 focus:outline-none border-b border-transparent focus:border-brand-purple/50 pb-2 transition-colors resize-none"
        />
      </div>

      <div class="mb-8">
        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Target Users</label>
        <textarea
          v-model="form.project_users"
          rows="3"
          placeholder="Who will use this system? Students, supervisors, admins..."
          class="w-full bg-transparent text-sm text-slate-300 placeholder-slate-600 focus:outline-none border-b border-transparent focus:border-brand-purple/50 pb-2 transition-colors resize-none"
        />
      </div>

      <div class="mb-8">
        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Problem Mind Map</label>
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
            <p class="text-xs text-slate-500">Click to upload mind map image</p>
          </div>
        </div>
      </div>

      <div class="mb-8">
        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Solution Overview</label>
        <textarea
          v-model="form.solution_overview"
          rows="4"
          placeholder="High-level overview of your proposed solution..."
          class="w-full bg-transparent text-sm text-slate-300 placeholder-slate-600 focus:outline-none border-b border-transparent focus:border-brand-purple/50 pb-2 transition-colors resize-none"
        />
      </div>

      <div class="mb-8">
        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Proposed Solution</label>
        <textarea
          v-model="form.proposed_solution"
          rows="5"
          placeholder="Detailed explanation of your solution, architecture, and approach..."
          class="w-full bg-transparent text-sm text-slate-300 placeholder-slate-600 focus:outline-none border-b border-transparent focus:border-brand-purple/50 pb-2 transition-colors resize-none"
        />
      </div>

      <div class="mb-8">
        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Solution Mind Map</label>
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
            <p class="text-xs text-slate-500">Click to upload mind map image</p>
          </div>
        </div>
      </div>

      <div class="mb-8">
        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Functional Requirements</label>
        <textarea
          v-model="form.functional_requirements"
          rows="4"
          placeholder="List the functional requirements of the system..."
          class="w-full bg-transparent text-sm text-slate-300 placeholder-slate-600 focus:outline-none border-b border-transparent focus:border-brand-purple/50 pb-2 transition-colors resize-none"
        />
      </div>

      <div class="mb-8">
        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Non-Functional Requirements</label>
        <textarea
          v-model="form.non_functional_requirements"
          rows="3"
          placeholder="Performance, security, scalability, usability requirements..."
          class="w-full bg-transparent text-sm text-slate-300 placeholder-slate-600 focus:outline-none border-b border-transparent focus:border-brand-purple/50 pb-2 transition-colors resize-none"
        />
      </div>

      <div class="mb-8">
        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Project Management</label>
        <textarea
          v-model="form.project_management"
          rows="3"
          placeholder="Agile methodology, meeting schedule, communication tools, task management..."
          class="w-full bg-transparent text-sm text-slate-300 placeholder-slate-600 focus:outline-none border-b border-transparent focus:border-brand-purple/50 pb-2 transition-colors resize-none"
        />
      </div>

      <div class="mb-8">
        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Programming Languages & Technologies</label>
        <input
          v-model="form.programming_languages"
          type="text"
          placeholder="e.g. PHP, JavaScript, TypeScript, HTML, CSS, Laravel, Vue.js, Nuxt..."
          class="w-full bg-transparent text-sm text-slate-300 placeholder-slate-600 focus:outline-none border-b border-transparent focus:border-brand-purple/50 pb-2 transition-colors"
        >
      </div>

      <div class="mb-8">
        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Project Team Members</label>
        <textarea
          v-model="form.project_teams"
          rows="2"
          placeholder="Name - Role, Name - Role..."
          class="w-full bg-transparent text-sm text-slate-300 placeholder-slate-600 focus:outline-none border-b border-transparent focus:border-brand-purple/50 pb-2 transition-colors resize-none"
        />
      </div>

      <div class="mb-8">
        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Required Skills (from Project)</label>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="skill in project?.required_skills || []"
            :key="skill"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold border bg-slate-500/10 text-slate-400 border-slate-700/50"
          >
            {{ skill }}
          </span>
          <span v-if="!project?.required_skills?.length" class="text-xs text-slate-600 italic">No skills specified</span>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-800">
        <button
          class="flex-1 flex items-center justify-center gap-2 bg-brand-purple hover:bg-brand-purple-hover text-white text-sm font-medium px-5 py-3 rounded-xl transition-all disabled:opacity-50"
          :disabled="isSaving"
          @click="emit('submit')"
        >
          <UIcon v-if="isSaving" name="i-heroicons-arrow-path" class="h-4 w-4 animate-spin" />
          <UIcon v-else name="i-heroicons-paper-airplane" class="h-4 w-4" />
          {{ isSaving ? 'Saving...' : 'Submit Proposal' }}
        </button>
      </div>
    </div>
  </div>
</template>