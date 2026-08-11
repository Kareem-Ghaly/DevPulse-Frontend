<script setup lang="ts">
import { useCreateProject } from '~/composables/useProject/useCreateProject.js'


const currentStep = ref(1)
const totalSteps = 3

const form = reactive({
  title: '',
  abstract: '',
  description: '',
  team_size: 1,
  required_skills: [] as string[],
})

const newSkill = ref('')
const stepErrors = reactive<Record<string, string>>({})

const { createProject, isPending } = useCreateProject()

const toPascalCase = (value: string): string => {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(word => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

const addSkill = () => {
  const skill = toPascalCase(newSkill.value)
  if (skill && !form.required_skills.includes(skill)) {
    form.required_skills.push(skill)
    newSkill.value = ''
    stepErrors.required_skills = ''
  }
}

const removeSkill = (index: number) => {
  form.required_skills.splice(index, 1)
}

const clearErrors = () => {
  Object.keys(stepErrors).forEach(key => {
    stepErrors[key] = ''
  })
}

const validateStep = (step: number): boolean => {
  clearErrors()

  let result
  if (step === 1) {
    result = step1Schema.safeParse({ title: form.title, team_size: form.team_size })
  } else if (step === 2) {
    result = step2Schema.safeParse({ abstract: form.abstract, description: form.description })
  } else {
    result = step3Schema.safeParse({ required_skills: form.required_skills })
  }

  if (!result.success) {
    result.error.errors.forEach((err: { path: (string | number)[]; message: string }) => {
      const field = String(err.path[0])
      if (!stepErrors[field]) stepErrors[field] = err.message
    })

    return false
  }

  return true
}

const nextStep = () => {
  if (!validateStep(currentStep.value)) return
  if (currentStep.value < totalSteps) {
    currentStep.value++
  } else {
    createProject({ ...form })
  }
}

const prevStep = () => {
  clearErrors()
  if (currentStep.value > 1) currentStep.value--
}

const router = useRouter()
</script>

<template>
  <div class="min-h-screen bg-bg-brand-dark text-white font-sans flex flex-col select-none">
    <header class="h-12 border-b border-brand-dark bg-brand-deep p-6 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="h-7 w-7 rounded-md bg-brand-purple flex items-center justify-center">
          <UIcon name="i-heroicons-bolt" class="h-4 w-4 text-white" />
        </div>
        <span class="text-sm font-semibold text-white">DevPulse</span>
      </div>
      <button class="text-xs text-slate-500 hover:text-white transition-colors cursor-pointer" @click="router.push('/student/my-projects')">
        Skip for now
      </button>
    </header>

    <main class="flex-1 flex justify-center sm:pt-12 pt-3 px-6 bg-brand-bg">
      <div class="w-full max-w-[520px]">
        <div class="text-center mb-2">
          <h1 class="sm:text-3xl text-xl font-bold pb-2 text-white">Create Your Project Identity</h1>
        </div>

        <div class="w-full h-1 rounded-full bg-border-dark overflow-hidden mb-6">
          <div
            class="h-full bg-brand-purple transition-all duration-300"
            :style="{ width: currentStep === 1 ? '15%' : currentStep === 2 ? '50%' : '100%' }"
          />
        </div>

        <div class="flex lg:flex  w-full justify-around items-center  text-xs font-medium mb-8">
          <div
            class="flex items-center gap-2"
            :class="currentStep === 1 ? 'text-white' : currentStep > 1 ? 'text-emerald-400' : 'text-slate-500'"
          >
            <div
              class="h-8 w-8 rounded-full items-center justify-center sm:flex hidden"
              :class="currentStep === 1 ? 'bg-brand-purple text-white' : currentStep > 1 ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-panel-dark border border-border-dark'"
            >
              <UIcon :name="currentStep > 1 ? 'i-heroicons-check' : 'i-heroicons-document-text'" class="h-4 w-4" />
            </div>
            <span :class="{ 'font-semibold': currentStep === 1 }">Project Title</span>
          </div>

          <div
            class="flex items-center gap-2"
            :class="currentStep === 2 ? 'text-white' : currentStep > 2 ? 'text-emerald-400' : 'text-slate-500'"
          >
            <div
              class="h-8 w-8 rounded-full items-center justify-center sm:flex hidden"
              :class="currentStep === 2 ? 'bg-brand-purple text-white' : currentStep > 2 ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-panel-dark border border-border-dark'"
            >
              <UIcon :name="currentStep > 2 ? 'i-heroicons-check' : 'i-heroicons-sparkles'" class="h-4 w-4" />
            </div>
            <span :class="{ 'font-semibold': currentStep === 2 }">Abstract</span>
          </div>

          <div
            class="flex items-center gap-2"
            :class="currentStep === 3 ? 'text-white' : 'text-slate-500'"
          >
            <div
              class="h-8 w-8 rounded-full items-center  sm:flex hidden justify-center"
              :class="currentStep === 3 ? 'bg-brand-purple text-white' : 'bg-panel-dark border border-border-dark'"
            >
              <UIcon name="i-heroicons-layers" class="h-4 w-4" />
            </div>
            <span :class="{ 'font-semibold': currentStep === 3 }">Tech Stack</span>
          </div>
        </div>

        <div class="bg-panel-dark border border-border-dark rounded-2xl px-7 py-6 shadow-[0_10px_40px_rgba(0,0,0,.45)]">
          <div v-if="currentStep === 1" class="space-y-5">
            <div>
              <h2 class="text-lg font-bold text-white">What's your project called?</h2>
              <p class="text-xs text-slate-400 mt-1">Choose a memorable name that reflects your project's purpose.</p>
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-2">Project Title</label>
              <input
                v-model="form.title"
                type="text"
                placeholder="e.g. EcoTrack - Sustainable Living Dashboard"
                class="w-full bg-input-bg border rounded-lg px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none transition-all"
                :class="stepErrors.title ? 'border-red-500 focus:border-red-500' : 'border-input-border focus:border-brand-purple'"
              >
              <p v-if="stepErrors.title" class="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                <UIcon name="i-heroicons-exclamation-circle" class="h-3.5 w-3.5" />
                {{ stepErrors.title }}
              </p>
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-2">Team Size</label>
              <input
                v-model.number="form.team_size"
                type="number"
                min="1"
                class="w-full bg-input-bg border rounded-lg px-4 py-3 text-sm text-white focus:outline-none transition-all"
                :class="stepErrors.team_size ? 'border-red-500 focus:border-red-500' : 'border-input-border focus:border-brand-purple'"
              >
              <p v-if="stepErrors.team_size" class="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                <UIcon name="i-heroicons-exclamation-circle" class="h-3.5 w-3.5" />
                {{ stepErrors.team_size }}
              </p>
            </div>
          </div>

          <div v-if="currentStep === 2" class="space-y-5">
            <div>
              <h2 class="text-lg font-bold text-white">Describe your project</h2>
              <p class="text-xs text-slate-400 mt-1">Write a brief abstract explaining what your project does and its goals.</p>
            </div>
            <div>
              <div class="flex justify-between mb-2">
                <label class="text-xs font-medium text-slate-300">Project Abstract</label>
                <span class="text-xs text-slate-500">{{ form.abstract.length }}/500</span>
              </div>
              <textarea
                v-model="form.abstract"
                rows="2"
                maxlength="500"
                placeholder="Describe your project's purpose..."
                class="w-full bg-input-bg border rounded-lg px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none resize-none"
                :class="stepErrors.abstract ? 'border-red-500 focus:border-red-500' : 'border-input-border focus:border-brand-purple'"
              />
              <p v-if="stepErrors.abstract" class="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                <UIcon name="i-heroicons-exclamation-circle" class="h-3.5 w-3.5" />
                {{ stepErrors.abstract }}
              </p>
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-2">Detailed Description</label>
              <textarea
                v-model="form.description"
                rows="2"
                placeholder="Provide further detailed requirements or features..."
                class="w-full bg-input-bg border rounded-lg px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none resize-none"
                :class="stepErrors.description ? 'border-red-500 focus:border-red-500' : 'border-input-border focus:border-brand-purple'"
              />
              <p v-if="stepErrors.description" class="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                <UIcon name="i-heroicons-exclamation-circle" class="h-3.5 w-3.5" />
                {{ stepErrors.description }}
              </p>
            </div>
          </div>

          <div v-if="currentStep === 3" class="space-y-5">
            <div>
              <h2 class="text-lg font-bold text-white">Required Skills & Frameworks</h2>
              <p class="text-xs text-slate-400 mt-1">Add technical frameworks and tools necessary to accomplish this scope.</p>
            </div>
            <div class="sm:flex block gap-2">
              <input
                v-model="newSkill"
                type="text"
                placeholder="e.g. Vue.js, Laravel, Machine Learning"
                class="flex-1 w-full bg-input-bg border border-input-border rounded-lg px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[var(--color-brand-purple)]"
                @keydown.enter.prevent="addSkill"
              >
              <button
                type="button"
                class="bg-brand-purple hover:cursor-pointer sm:w-20 w-full py-2 my-2 sm:py-1 sm:my-1 hover:bg-purple-hover text-white px-5 rounded-lg text-sm font-medium"
                @click="addSkill"
              >
                Add
              </button>
            </div>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(skill, index) in form.required_skills"
                :key="skill"
                class="flex items-center gap-2 px-3 py-1.5 bg-[var(--color-brand-purple)]/10 text-[#9b9aff] border border-[var(--color-brand-purple)]/20 rounded-md text-xs font-medium"
              >
                {{ skill }}
                <UIcon name="i-heroicons-x-mark" class="h-3 w-3 cursor-pointer" @click="removeSkill(index)" />
              </span>
              <p v-if="!form.required_skills.length" class="text-xs text-slate-500">No infrastructure skills injected yet.</p>
            </div>
            <p v-if="stepErrors.required_skills" class="text-xs text-red-400 flex items-center gap-1">
              <UIcon name="i-heroicons-exclamation-circle" class="h-3.5 w-3.5" />
              {{ stepErrors.required_skills }}
            </p>
          </div>

          <div class="flex justify-between items-center mt-8 pt-5 border-t border-[var(--color-border-dark)]">
            <button
              type="button"
              :class="{ 'opacity-0 pointer-events-none': currentStep === 1 }"
              class="flex items-center gap-2 text-slate-500 hover:text-white transition-colors"
              @click="prevStep"
            >
              <UIcon name="i-heroicons-arrow-left" class="h-4 w-4" />
              <span class="text-sm">Back</span>
            </button>
            <button
              type="button"
              :disabled="isPending"
              class="flex items-center gap-2 bg-brand-purple hover:bg-brand-purple-hover active:bg-brand-purple-active text-white font-medium px-5 py-2.5 rounded-xl transition-all disabled:opacity-50"
              @click="nextStep"
            >
              <span>{{ currentStep === totalSteps ? 'Submit Idea' : 'Continue' }}</span>
              <UIcon v-if="currentStep < totalSteps" name="i-heroicons-arrow-right" class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>