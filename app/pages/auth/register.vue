<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useMutation } from '@tanstack/vue-query'

definePageMeta({
  layout: 'blank'
})

const authService = useAuthService()
const authStore = useAuthStore()
const appToast = useAppToast()



const currentStep = ref(1)
const customSkill = ref('')

const localSkillsList = ref([
  'Vue.js', 'Nuxt 3', 'React', 'Next.js', 'Angular', 'Svelte',
  'JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'SASS',
  'Node.js', 'Express.js', 'NestJS', 'Laravel', 'PHP', 'Python',
  'Django', 'Flask', 'C#', 'ASP.NET Core', 'Java', 'Spring Boot',
  'Kotlin', 'Swift', 'Flutter', 'React Native', 'SQL', 'MySQL',
  'PostgreSQL', 'SQLite', 'MongoDB', 'Redis', 'Firebase', 'Docker',
  'Kubernetes', 'AWS', 'Git', 'GitHub', 'GraphQL', 'REST API'
])

const { handleSubmit, errors, defineField, values, validateField } = useForm<RegisterInput>({
  validationSchema: toTypedSchema(RegisterSchema),
  initialValues: {
    role: 'student',
    academic_year: '1',
    skills: [],
    github_link: '',
    research_interests: [],
  }
})

const [role] = defineField('role')
const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')
const [passwordConfirmation, passwordConfirmationAttrs] = defineField('password_confirmation')
const [fullName, fullNameAttrs] = defineField('full_name')
const [department, departmentAttrs] = defineField('department')
const [universityId, universityIdAttrs] = defineField('university_id')
const [academicYear, academicYearAttrs] = defineField('academic_year')
const [academicTitle, academicTitleAttrs] = defineField('academic_title')
const [specialization, specializationAttrs] = defineField('specialization')
const [officeHours, officeHoursAttrs] = defineField('office_hours')
const [skillsField] = defineField('skills')
const researchInterestsRef = ref<string[]>([])
const [githubLink, githubLinkAttrs] = defineField('github_link')
const [bio, bioAttrs] = defineField('bio')

const addCustomSkill = (): void => {
  const trimmed = customSkill.value.trim()
  if (!trimmed) {
    return
  }

  const existingSkill = localSkillsList.value.find(s => s.toLowerCase() === trimmed.toLowerCase())
  
  if (!existingSkill) {
    localSkillsList.value.push(trimmed)
  }

  const targetSkill = existingSkill || trimmed
  if (!Array.isArray(skillsField.value)) {
    skillsField.value = []
  }

  if (!skillsField.value.includes(targetSkill)) {
    skillsField.value = [...skillsField.value, targetSkill]
  }

  customSkill.value = ''
}

const { mutate: executeRegister, isPending: isLoading } = useMutation({
  mutationFn: async (inputValues: RegisterInput) => {
    return await authService.register(inputValues)
  },
  onSuccess: async (responseData) => {
    if (responseData && responseData.status && responseData.data) {
      authStore.setAuth({
        token: responseData.data.token,
        user: responseData.data.user,
        role: values.role
      })
      
      appToast.success('Account Created!', `Welcome to DevPulse, ${values.full_name}!`)
      await navigateTo('/')
    }
  }
})

const submitRegistrationForm = (formValues: RegisterInput): void => {
  const payload = {
    role: formValues.role,
    email: formValues.email,
    password: formValues.password,
    password_confirmation: values.password_confirmation || formValues.password_confirmation,
    full_name: formValues.full_name,
    department: formValues.department,
    bio: formValues.bio || '',
    
    university_id: formValues.university_id,
    academic_year: formValues.academic_year,
    skills: [...(formValues.skills || [])],
    github_link: formValues.github_link || '',
    academic_title: formValues.academic_title,
    specialization: formValues.specialization,
    office_hours: formValues.office_hours,
    research_interests: [...researchInterestsRef.value],
  }

  if (formValues.role === 'supervisor') {
    payload.academic_title = formValues.academic_title || 'Doctor'
    payload.specialization = formValues.specialization || ''
    payload.office_hours = formValues.office_hours || ''
    payload.research_interests = [...researchInterestsRef.value]
    payload.bio = formValues.bio || ''
  }
  else if (formValues.role === 'committee-member') {
    payload.academic_title = formValues.academic_title || 'Doctor'
    payload.specialization = formValues.specialization || ''
  }

  const cleanPayload = JSON.parse(JSON.stringify(payload))
  executeRegister(cleanPayload)
}

const nextStep = async () => {
  if (currentStep.value === 1) {
    if (!values.role) {
      return
    }
    currentStep.value++
  }
  else if (currentStep.value === 2) {
    const emailRes = await validateField('email')
    const passRes = await validateField('password')
    const confRes = await validateField('password_confirmation')
    
    if ((emailRes.valid && passRes.valid && confRes.valid) || (!errors.value.email && !errors.value.password && !errors.value.password_confirmation)) {
      currentStep.value++
    }
  }
  else if (currentStep.value === 3) {
    const nameRes = await validateField('full_name')
    const deptRes = await validateField('department')
    
    const isStep3BasicValid = (nameRes.valid && deptRes.valid) || (!errors.value.full_name && !errors.value.department)

    if (values.role === 'student') {
      const univRes = await validateField('university_id')
      if (isStep3BasicValid && (univRes.valid || !errors.value.university_id)) {
        currentStep.value++
      }
    }
    else {
      if (isStep3BasicValid) {
        submitRegistrationForm(values)
      }
    }
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const onSubmit = handleSubmit((finalValues) => {
  submitRegistrationForm(finalValues)
})

const uiInputStyle = {
  root: 'rounded-lg',
  base: 'bg-input-bg border-input-border text-white placeholder-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm py-2.5 px-3 w-full'
}
const uiSelectStyle = {
  root: 'rounded-lg w-full',
  base: 'bg-input-bg border-input-border text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm py-2.5 px-3 w-full cursor-pointer'
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
          <h1 class="text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight">Join DevPulse Today</h1>
          <p class="text-slate-400 text-base leading-relaxed">Create your account and start managing your project lifecycle with powerful tools.</p>
        </div>

        <div class="space-y-4">
          <span class="text-xs font-bold tracking-wider text-slate-500 uppercase block">Registration Progress</span>
          
          <div :class="['flex items-center gap-4 p-4 rounded-xl border transition-all', currentStep === 1 ? 'border-blue-500/30 bg-blue-500/5' : 'border-transparent']">
            <div :class="['h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold', currentStep > 1 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400']">
              <UIcon v-if="currentStep > 1" name="i-heroicons-check" class="h-3.5 w-3.5" />
              <span v-else>1</span>
            </div>
            <div>
              <h4 :class="['font-bold', currentStep === 1 ? 'text-white' : 'text-slate-400']">Select Role</h4>
              <p class="text-xs text-slate-500">Choose your account type</p>
            </div>
          </div>

          <div :class="['flex items-center gap-4 p-4 rounded-xl border transition-all', currentStep === 2 ? 'border-blue-500/30 bg-blue-500/5' : 'border-transparent']">
            <div :class="['h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold', currentStep > 2 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400']">
              <UIcon v-if="currentStep > 2" name="i-heroicons-check" class="h-3.5 w-3.5" />
              <span v-else>2</span>
            </div>
            <div>
              <h4 :class="['font-bold', currentStep === 2 ? 'text-white' : 'text-slate-400']">Credentials</h4>
              <p class="text-xs text-slate-500">Set up your login</p>
            </div>
          </div>

          <div :class="['flex items-center gap-4 p-4 rounded-xl border transition-all', currentStep === 3 || currentStep === 4 ? 'border-blue-500/30 bg-blue-500/5' : 'border-transparent']">
            <div :class="['h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold', currentStep > 3 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400']">
              <UIcon v-if="currentStep > 3" name="i-heroicons-check" class="h-3.5 w-3.5" />
              <span v-else>3</span>
            </div>
            <div>
              <h4 :class="['font-bold', currentStep === 3 || currentStep === 4 ? 'text-white' : 'text-slate-400']">Profile Details</h4>
              <p class="text-xs text-slate-500">Complete your profile</p>
            </div>
          </div>
        </div>
      </div>

      <div class="text-slate-500 font-medium">
        Already have an account? <ULink to="/auth/login" class="text-blue-500 font-bold hover:underline">Sign in</ULink>
      </div>
    </div>

    <div class="w-full md:w-1/2 flex flex-col justify-center items-center px-6 py-12 lg:px-16 bg-brand-deep">
      <div class="w-full max-w-lg">
        
        <form class="space-y-6" @submit.prevent="onSubmit">

          <div v-if="currentStep === 1" class="space-y-6">
            <div class="text-center md:text-left space-y-1">
              <h2 class="text-4xl font-black text-white tracking-tight">Choose Your Role</h2>
              <p class="text-slate-400">Select how you want to use DevPulse</p>
            </div>

            <div class="space-y-3">
              <button type="button" class="w-full flex items-center justify-between p-5 rounded-xl border bg-brand-dark hover:border-blue-500/50 cursor-pointer" :class="role === 'student' ? 'border-blue-600' : 'border-border-dark'" @click="role = 'student'; nextStep()">
                <div class="flex items-center gap-4">
                  <div class="p-3 rounded-xl bg-blue-600/10 text-blue-400"><UIcon name="i-heroicons-academic-cap" class="h-6 w-6" /></div>
                  <div>
                    <h3 class="text-xl font-bold text-white text-left">Student</h3>
                    <p class="text-xs text-slate-400 mt-0.5">Manage projects and collaborate with teammates</p>
                  </div>
                </div>
                <UIcon name="i-heroicons-arrow-right" class="h-4 w-4 text-slate-500" />
              </button>

              <button type="button" class="w-full flex items-center justify-between p-5 rounded-xl border bg-brand-dark hover:border-emerald-500/50 cursor-pointer" :class="role === 'supervisor' ? 'border-emerald-600' : 'border-border-dark'" @click="role = 'supervisor'; nextStep()">
                <div class="flex items-center gap-4">
                  <div class="p-3 rounded-xl bg-emerald-600/10 text-emerald-400"><UIcon name="i-heroicons-user" class="h-6 w-6" /></div>
                  <div>
                    <h3 class="text-xl font-bold text-white text-left">Supervisor</h3>
                    <p class="text-xs text-slate-400 mt-0.5">Guide students and review contributions</p>
                  </div>
                </div>
                <UIcon name="i-heroicons-arrow-right" class="h-4 w-4 text-slate-500" />
              </button>

              <button type="button" class="w-full flex items-center justify-between p-5 rounded-xl border bg-brand-dark hover:border-purple-500/50 cursor-pointer" :class="role === 'committee-member' ? 'border-purple-600' : 'border-border-dark'" @click="role = 'committee-member'; nextStep()">
                <div class="flex items-center gap-4">
                  <div class="p-3 rounded-xl bg-purple-600/10 text-purple-400"><UIcon name="i-heroicons-shield-check" class="h-6 w-6" /></div>
                  <div>
                    <h3 class="text-xl font-bold text-white text-left">Committee Member</h3>
                    <p class="text-xs text-slate-400 mt-0.5">Evaluate projects and oversee standards</p>
                  </div>
                </div>
                <UIcon name="i-heroicons-arrow-right" class="h-4 w-4 text-slate-500" />
              </button>
            </div>
          </div>

          <div v-if="currentStep === 2" class="border border-border-dark bg-brand-dark p-8 rounded-xl shadow-xl space-y-5">
            <div class="flex items-center gap-2 text-xs font-semibold text-blue-500 cursor-pointer" @click="prevStep">
              <UIcon name="i-heroicons-arrow-left" class="h-3 w-3" /> Back
            </div>
            <div class="space-y-4">
              <div class="space-y-1.5">
                <label class="block text-xs font-bold text-slate-300">Email Address</label>
                <UInput v-model="email" class="w-full pt-2" v-bind="emailAttrs" type="email" placeholder="name@university.edu" :ui="uiInputStyle" />
                <span v-if="errors.email" class="text-xs text-rose-500 block mt-1">{{ errors.email }}</span>
              </div>
              <div class="space-y-1.5">
                <label class="block text-xs font-bold text-slate-300">Password</label>
                <UInput v-model="password" class="w-full pt-2" v-bind="passwordAttrs" type="password" placeholder="Create password" :ui="uiInputStyle" />
                <span v-if="errors.password" class="text-xs text-rose-500 block mt-1">{{ errors.password }}</span>
              </div>
              <div class="space-y-1.5">
                <label class="block text-xs font-bold text-slate-300">Confirm Password</label>
                <UInput v-model="passwordConfirmation" class="w-full pt-2" v-bind="passwordConfirmationAttrs" type="password" placeholder="Confirm password" :ui="uiInputStyle" />
                <span v-if="errors.password_confirmation" class="text-xs text-rose-500 block mt-1">{{ errors.password_confirmation }}</span>
              </div>
              <button type="button" class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-brand-purple text-white font-bold text-sm cursor-pointer" @click="nextStep">
                Continue <UIcon name="i-heroicons-arrow-right" class="h-4 w-4" />
              </button>
            </div>
          </div>

          <div v-if="currentStep === 3" class="border border-border-dark bg-brand-dark p-8 rounded-xl shadow-xl space-y-5">
            <div class="flex items-center gap-2 text-xs font-semibold text-blue-500 cursor-pointer" @click="prevStep">
              <UIcon name="i-heroicons-arrow-left" class="h-3 w-3" /> Back
            </div>
            <div class="space-y-4">
              <div class="space-y-1.5">
                <div :class="['space-y-1.5', role === 'supervisor' ? 'grid grid-cols-2 gap-4' : '']">
                  <div class="">
                    <label class="block text-xs font-bold text-slate-300">Full Name</label>
                    <UInput v-model="fullName" class="w-full pt-2" v-bind="fullNameAttrs" type="text" placeholder="Enter full name" :ui="uiInputStyle" />
                    <span v-if="errors.full_name" class="text-xs text-rose-500 block mt-1">{{ errors.full_name }}</span>
                  </div>
                  <div v-if="role === 'supervisor'">
                    <label class="block text-xs font-bold text-slate-300">Office Hours</label>
                    <UInput class="pt-2" v-model="officeHours" v-bind="officeHoursAttrs" type="text" placeholder="e.g. Sun 10:00 AM" :ui="uiInputStyle" />
                  </div>
                </div>
              </div>

              <div v-if="role === 'student'" class="grid grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label class="block text-xs font-bold text-slate-300">University ID</label>
                  <UInput v-model="universityId" v-bind="universityIdAttrs" type="text" placeholder="e.g. ASPU" :ui="uiInputStyle" />
                  <span v-if="errors.university_id" class="text-xs text-rose-500 block mt-1">{{ errors.university_id }}</span>
                </div>
                <div class="space-y-1.5">
                  <label class="block text-xs font-bold text-slate-300">Academic Year</label>
                  <select v-model="academicYear" v-bind="academicYearAttrs" :class="uiSelectStyle.base">
                    <option value="1">First Year</option><option value="2">Second Year</option><option value="3">Third Year</option><option value="4">Fourth Year</option><option value="5">Fifth Year</option>
                  </select>
                </div>
              </div>

              <div v-if="role === 'supervisor' || role === 'committee-member'" class="grid grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label class="block text-xs font-bold text-slate-300">Academic Title</label>
                  <select v-model="academicTitle" v-bind="academicTitleAttrs" :class="uiSelectStyle.base">
                    <option value="Doctor">Doctor</option><option value="Professor">Professor</option><option value="Engineer">Engineer</option>
                  </select>
                </div>
                <div class="space-y-1.5">
                  <label class="block text-xs font-bold text-slate-300">Specialization</label>
                  <UInput v-model="specialization" v-bind="specializationAttrs" type="text" placeholder="e.g. AI" :ui="uiInputStyle" />
                </div>
              </div>

              <div v-if="role === 'supervisor'" class="space-y-1.5">
                <label class="block text-xs font-bold text-slate-300">Research Interests</label>
                <USelectMenu
                  v-model="researchInterestsRef"
                  :items="localSkillsList"
                  multiple
                  searchable
                  placeholder="Select research interests..."
                  class="w-full"
                  :ui-menu="{ 
                    background: 'bg-brand-dark', 
                    border: 'border border-border-dark', 
                    option: { text: 'text-white active:bg-blue-600 font-medium' },
                    input: 'bg-brand-deep border-border-dark text-white placeholder-slate-500 focus:ring-1 focus:ring-blue-500'
                  }"
                />
              </div>

              <div class="space-y-1.5">
                <label class="block text-xs font-bold text-slate-300">Department</label>
                <UInput v-model="department" class="w-full pt-2" v-bind="departmentAttrs" type="text" placeholder="e.g. Software Engineering" :ui="uiInputStyle" />
                <span v-if="errors.department" class="text-xs text-rose-500 block mt-1">{{ errors.department }}</span>
              </div>

              <div v-if="role !== 'student'" class="space-y-1.5">
                <label class="block text-xs font-bold text-slate-300">Bio</label>
                <textarea v-model="bio" v-bind="bioAttrs" rows="3" class="w-full bg-input-bg border border-input-border rounded-lg p-2.5 text-sm text-white focus:border-blue-500 focus:outline-none" placeholder="Brief summary..." />
              </div>

              <button :disabled="isLoading" type="button" class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-brand-purple text-white font-bold text-sm cursor-pointer" @click="nextStep">
                <span>{{ values.role === 'student' ? 'Next: Skills & GitHub' : (isLoading ? 'Creating Account...' : 'Complete Registration') }}</span>
                <UIcon name="i-heroicons-arrow-right" class="h-4 w-4" />
              </button>
            </div>
          </div>

          <div v-if="currentStep === 4 && role === 'student'" class="border border-border-dark bg-brand-dark p-8 rounded-xl shadow-xl space-y-5">
            <div class="flex items-center gap-2 text-xs font-semibold text-blue-500 cursor-pointer" @click="prevStep">
              <UIcon name="i-heroicons-arrow-left" class="h-3 w-3" /> Back
            </div>
            <div>
              <h2 class="text-xl font-bold text-white">Skills & Links</h2>
            </div>

            <div class="space-y-4">
              <div class="space-y-1.5">
                <label class="block text-xs font-bold text-slate-300">Select Technical Skills</label>
                <USelectMenu
                  v-model="skillsField"
                  :items="localSkillsList"
                  multiple
                  searchable
                  placeholder="Select skills..."
                  class="w-full"
                  :ui-menu="{ 
                    background: 'bg-brand-dark', 
                    border: 'border border-border-dark', 
                    option: { text: 'text-white active:bg-blue-600 font-medium' },
                    input: 'bg-brand-deep border-border-dark text-white placeholder-slate-500 focus:ring-1 focus:ring-blue-500'
                  }"
                />
                <span v-if="errors.skills" class="text-xs text-rose-500 block mt-1">{{ errors.skills }}</span>
              </div>

              <div class="space-y-1.5">
                <label class="block text-xs font-bold text-slate-400">Can't find a skill? Add it manually:</label>
                <div class="flex gap-2">
                  <UInput v-model="customSkill" type="text" placeholder="e.g. Nuxt 3" :ui="uiInputStyle" class="flex-1" @keydown.enter.prevent="addCustomSkill" />
                  <button type="button" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer" @click="addCustomSkill">
                    Add
                  </button>
                </div>
              </div>

              <div class="space-y-1.5">
                <label class="block text-xs font-bold text-slate-300">GitHub Profile Link</label>
                <UInput v-model="githubLink" class="w-full" v-bind="githubLinkAttrs" type="url" placeholder="https://github.com/username" :ui="uiInputStyle" />
                <span v-if="errors.github_link" class="text-xs text-rose-500 block mt-1">{{ errors.github_link }}</span>
              </div>

              <div class="space-y-1.5">
                <label class="block text-xs font-bold text-slate-300">Academic Biography</label>
                <textarea v-model="bio" v-bind="bioAttrs" rows="3" class="w-full bg-input-bg border border-input-border rounded-lg p-2.5 text-sm text-white focus:border-blue-500 focus:outline-none" placeholder="Tell us about yourself..." />
                <span v-if="errors.bio" class="text-xs text-rose-500 block mt-1">{{ errors.bio }}</span>
              </div>

              <button :disabled="isLoading" type="submit" class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-brand-purple hover:bg-brand-purple-hover text-white font-bold text-sm transition-all disabled:opacity-50 cursor-pointer">
                <span>{{ isLoading ? 'Registering Account...' : 'Complete Registration' }}</span>
                <UIcon v-if="!isLoading" name="i-heroicons-arrow-right" class="h-4 w-4" />
              </button>
            </div>
          </div>

        </form>
        
        <div class="text-center mt-6">
          <ULink to="/auth/login" class="text-slate-500 font-medium hover:text-slate-300 transition-colors">
            Already have an account? <span class="text-brand-purple font-bold ml-1">Sign in</span>
          </ULink>
        </div>

      </div>
    </div>
  </div>
</template>