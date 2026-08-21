import { ref, computed } from 'vue'
import { useHead } from '#imports'

export type Locale = 'ar' | 'en'

const currentLocale = ref<Locale>('en')
const dir = computed(() => currentLocale.value === 'ar' ? 'rtl' : 'ltr')

const messages = {
  en: {
    projectTitle: 'Project Title',
    problem: 'Problem',
    problemOverview: 'Problem Overview',
    comparison: 'Comparison with Similar Applications',
    targetUsers: 'Target Users',
    problemMindMap: 'Problem Mind Map',
    solutionOverview: 'Solution Overview',
    proposedSolution: 'Proposed Solution',
    solutionMindMap: 'Solution Mind Map',
    functionalReq: 'Functional Requirements',
    nonFunctionalReq: 'Non-Functional Requirements',
    projectManagement: 'Project Management',
    programmingLanguages: 'Programming Languages & Technologies',
    teamMembers: 'Project Team Members',
    requiredSkills: 'Required Skills (from Project)',
    noSkills: 'No skills specified',
    submitProposal: 'Submit Proposal',
    saving: 'Saving...',
    save: 'Save',
    kanban: 'Kanban',
    editor: 'Editor',
    share: 'Share',
    finalSubmission: 'Final Submission',
    live: 'Live',
    offline: 'Offline',
    tasksLive: 'Tasks Live',
    editing: 'editing',
    clickUpload: 'Click to upload mind map image',
    draft: 'DRAFT',
    submitted: 'SUBMITTED',
    enterTitle: 'Enter project title...',
    describeProblem: 'Describe the core problem your project addresses...',
    problemDetails: 'Provide a detailed overview of the problem...',
    compareApps: 'Compare your project with similar existing applications...',
    targetUsersPlaceholder: 'Who will use this system? Students, supervisors, admins...',
    solutionHighLevel: 'High-level overview of your proposed solution...',
    solutionDetailed: 'Detailed explanation of your solution, architecture, and approach...',
    functionalPlaceholder: 'List the functional requirements of the system...',
    nonFunctionalPlaceholder: 'Performance, security, scalability, usability requirements...',
    managementPlaceholder: 'Agile methodology, meeting schedule, communication tools, task management...',
    techPlaceholder: 'e.g. PHP, JavaScript, TypeScript, HTML, CSS, Laravel, Vue.js, Nuxt...',
    teamPlaceholder: 'Name - Role, Name - Role...',
    switchLang: 'عربي',
  },
  ar: {
    projectTitle: 'عنوان المشروع',
    problem: 'المشكلة',
    problemOverview: 'نظرة عامة على المشكلة',
    comparison: 'المقارنة مع التطبيقات المشابهة',
    targetUsers: 'المستخدمون المستهدفون',
    problemMindMap: 'خريطة ذهنية للمشكلة',
    solutionOverview: 'نظرة عامة على الحل',
    proposedSolution: 'الحل المقترح',
    solutionMindMap: 'خريطة ذهنية للحل',
    functionalReq: 'المتطلبات الوظيفية',
    nonFunctionalReq: 'المتطلبات غير الوظيفية',
    projectManagement: 'إدارة المشروع',
    programmingLanguages: 'لغات البرمجة والتقنيات',
    teamMembers: 'أعضاء فريق المشروع',
    requiredSkills: 'المهارات المطلوبة (من المشروع)',
    noSkills: 'لم يتم تحديد مهارات',
    submitProposal: 'تقديم المقترح',
    saving: 'جاري الحفظ...',
    save: 'حفظ',
    kanban: 'لوحة كانبان',
    editor: 'المحرر',
    share: 'مشاركة',
    finalSubmission: 'التسليم النهائي',
    live: 'متصل',
    offline: 'غير متصل',
    tasksLive: 'المهام متصلة',
    editing: 'محرر',
    clickUpload: 'انقر لرفع صورة الخريطة الذهنية',
    draft: 'مسودة',
    submitted: 'مُقدَّم',
    enterTitle: 'أدخل عنوان المشروع...',
    describeProblem: 'صف المشكلة الأساسية التي يعالجها مشروعك...',
    problemDetails: 'قدم نظرة تفصيلية على المشكلة...',
    compareApps: 'قارن مشروعك مع التطبيقات المشابهة الموجودة...',
    targetUsersPlaceholder: 'من سيستخدم هذا النظام؟ طلاب، مشرفون، مسؤولون...',
    solutionHighLevel: 'نظرة عامة عالية المستوى على الحل المقترح...',
    solutionDetailed: 'شرح مفصل للحل، البنية، والمنهجية...',
    functionalPlaceholder: 'اذكر المتطلبات الوظيفية للنظام...',
    nonFunctionalPlaceholder: 'الأداء، الأمان، القابلية للتوسع، متطلبات الاستخدام...',
    managementPlaceholder: 'منهجية أجايل، جدول الاجتماعات، أدوات التواصل، إدارة المهام...',
    techPlaceholder: 'مثال: PHP، JavaScript، TypeScript، HTML، CSS، Laravel، Vue.js، Nuxt...',
    teamPlaceholder: 'الاسم - الدور، الاسم - الدور...',
    switchLang: 'English',
  }
}

export function useI18n() {
  useHead(() => ({
    htmlAttrs: {
      dir: dir.value,
      lang: currentLocale.value,
    }
  }))

  const t = (key: keyof typeof messages.en) => {
    return messages[currentLocale.value][key] || key
  }

  const toggleLocale = () => {
    currentLocale.value = currentLocale.value === 'en' ? 'ar' : 'en'
  }

  const setLocale = (locale: Locale) => {
    currentLocale.value = locale
  }

  return {
    locale: currentLocale,
    dir,
    t,
    toggleLocale,
    setLocale,
  }
}