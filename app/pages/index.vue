<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showAccountModal = ref(false)
const scrollY = ref(0)

const particles = ref<Array<{x: number, y: number, size: number, speedX: number, speedY: number, opacity: number}>>([])
const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationFrame: number

const initParticles = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  const resize = () => {
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
  }
  resize()
  window.addEventListener('resize', resize)
  
  particles.value = Array.from({ length: 50 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2 + 0.5,
    speedX: (Math.random() - 0.5) * 0.5,
    speedY: (Math.random() - 0.5) * 0.5,
    opacity: Math.random() * 0.5 + 0.1
  }))
  
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    particles.value.forEach((p, i) => {
      p.x += p.speedX
      p.y += p.speedY
      
      if (p.x < 0 || p.x > canvas.width) p.speedX *= -1
      if (p.y < 0 || p.y > canvas.height) p.speedY *= -1
      
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(97, 95, 255, ${p.opacity})`
      ctx.fill()
      
      particles.value.slice(i + 1).forEach(p2 => {
        const dx = p.x - p2.x
        const dy = p.y - p2.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        
        if (dist < 150) {
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.strokeStyle = `rgba(97, 95, 255, ${0.1 * (1 - dist / 150)})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      })
    })
    
    animationFrame = requestAnimationFrame(animate)
  }
  
  animate()
  
  onUnmounted(() => {
    window.removeEventListener('resize', resize)
    cancelAnimationFrame(animationFrame)
  })
}

onMounted(() => {
  initParticles()
  window.addEventListener('scroll', () => {
    scrollY.value = window.scrollY
  })
})

const accounts = [
  {
    key: 'student',
    title: 'Student',
    desc: 'Learn, build skills, and join graduation projects.',
    route: '/auth/login',
    icon: 'i-heroicons-academic-cap',
  },
  {
    key: 'professor',
    title: 'Professor',
    desc: 'Guide students and supervise projects.',
    route: '/auth/login',
    icon: 'i-heroicons-user-group',
  },
  {
    key: 'committee',
    title: 'Committee',
    desc: 'Evaluate and track project progress.',
    route: '/auth/login',
    icon: 'i-heroicons-clipboard-document-check',
  },
  {
    key: 'admin',
    title: 'Admin',
    desc: 'Manage platform and users.',
    route: '/auth/admin/login',
    icon: 'i-heroicons-shield-check',
  },
]

const goToAuth = (path: string) => {
  showAccountModal.value = false
  router.push(path)
}

const features = [
  {
    title: 'Unified Workspace',
    desc: 'All project tools in one place — tasks, diagrams, files, and communication.',
    icon: 'i-heroicons-squares-2x2',
  },
  {
    title: 'Real-time Collaboration',
    desc: 'Edit diagrams and code together with your team in real-time.',
    icon: 'i-heroicons-users',
  },
  {
    title: 'Smart Team Matching',
    desc: 'Find teammates with complementary skills based on AI analysis.',
    icon: 'i-heroicons-user-plus',
  },
  {
    title: 'GitHub Integration',
    desc: 'Sync commits, branches, and track individual contributions automatically.',
    icon: 'i-heroicons-code-bracket',
  },
  {
    title: 'Activity Transparency',
    desc: 'Complete activity stream for fair academic evaluation and supervision.',
    icon: 'i-heroicons-eye',
  },
]

const steps = [
  { 
    title: 'Create Project Idea', 
    desc: 'Submit your graduation project concept and let AI analyze required skills.', 
    icon: 'i-heroicons-light-bulb' 
  },
  { 
    title: 'Build Your Team', 
    desc: 'AI matches you with students who have complementary technical skills.', 
    icon: 'i-heroicons-user-group' 
  },
  { 
    title: 'Collaborate & Build', 
    desc: 'Work together using integrated tools: Kanban, diagrams, chat, and video calls.', 
    icon: 'i-heroicons-wrench-screwdriver' 
  },
  { 
    title: 'Auto Document', 
    desc: 'Let AI generate your final academic report from all project activities.', 
    icon: 'i-heroicons-document-text' 
  },
]

const stats = [
  { value: '500+', label: 'Active Projects' },
  { value: '2,000+', label: 'Students' },
  { value: '150+', label: 'Professors' },
  { value: '99.9%', label: 'Uptime' },
]

const scrollToSection = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <div class="min-h-screen bg-brand-bg text-white font-sans select-none overflow-x-hidden">
    <header 
      class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      :class="scrollY > 50 ? 'bg-brand-dark/90 backdrop-blur-md border-b border-border-dark' : 'bg-transparent'"
    >
      <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="h-9 w-9 rounded-xl bg-brand-purple flex items-center justify-center shadow-lg shadow-brand-purple/25">
            <UIcon name="i-heroicons-bolt" class="h-5 w-5 text-white" />
          </div>
          <span class="text-lg font-bold text-white tracking-tight">DevPulse</span>
        </div>

        <nav class="hidden md:flex items-center gap-8 text-sm">
          <button class="text-slate-400 hover:text-white transition-colors" @click="scrollToSection('features')">
            Features
          </button>
          <button class="text-slate-400 hover:text-white transition-colors" @click="scrollToSection('how')">
            How it works
          </button>
          <button class="text-slate-400 hover:text-white transition-colors" @click="scrollToSection('stats')">
            Stats
          </button>
        </nav>

        <div class="flex items-center gap-3">
          <button 
            class="hidden hover:cursor-pointer sm:block text-sm text-slate-400 hover:text-white transition-colors px-4 py-2"
            @click="showAccountModal = true"
          >
            Sign in
          </button>
          <button 
            class="bg-brand-purple hover:bg-brand-purple-hover active:bg-brand-purple-active text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-brand-purple/20"
            @click="showAccountModal = true"
          >
            Get Started
          </button>
        </div>
      </div>
    </header>

    <main>
      <section class="relative min-h-screen sm:mt-0 mt-20 flex items-center justify-center overflow-hidden">
        <div class="absolute inset-0 bg-brand-bg">
          <canvas ref="canvasRef" class="absolute inset-0 w-full h-full opacity-60"/>
          
          <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-purple/10 rounded-full blur-3xl"/>
          <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-purple/5 rounded-full blur-3xl"/>
          <div class="absolute top-1/2 right-1/3 w-64 h-64 bg-brand-purple/8 rounded-full blur-3xl"/>
          
          <div
              class="absolute inset-0 opacity-[0.03]" 
               style="background-image: linear-gradient(rgba(97,95,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(97,95,255,0.3) 1px, transparent 1px); background-size: 60px 60px;"/>
        </div>

        <div class="relative z-10 max-w-7xl mx-auto px-6">
          <div class="grid lg:grid-cols-2 gap-x-16 items-center">
            <div class="text-center lg:text-left">
              <h1 class="text-5xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] text-white mb-6">
                Manage Your
                <span class="block text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-[#9b9aff]">
                  Graduation Project
                </span>
                Journey
              </h1>

              <p class="text-lg text-slate-400 leading-relaxed max-w-xl mb-8 mx-auto lg:mx-0">
                DevPulse is the all-in-one engineering platform that unifies project management, 
                real-time collaboration, AI documentation, and academic supervision in one powerful workspace.
              </p>

              <div class="flex flex-wrap gap-4 justify-center lg:justify-start mb-12">
                <button 
                  class="bg-brand-purple hover:bg-brand-purple-hover active:bg-brand-purple-active text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-xl shadow-brand-purple/25 flex items-center gap-2"
                  @click="showAccountModal = true"
                >
                  <span>Start Your Project</span>
                  <UIcon name="i-heroicons-arrow-right" class="h-5 w-5" />
                </button>
                <button 
                  class="px-8 py-4 rounded-xl border border-border-slate text-slate-300 hover:text-white hover:border-brand-purple/50 transition-all flex items-center gap-2"
                  @click="scrollToSection('features')"
                >
                  <UIcon name="i-heroicons-play-circle" class="h-5 w-5" />
                  <span>Explore Features</span>
                </button>
              </div>
            </div>

            <div class="relative hidden lg:block">
              <div class="relative rounded-2xl border border-border-dark bg-panel-dark/80 backdrop-blur-sm p-1 shadow-2xl shadow-black/50">
                <div class="flex items-center gap-2 px-4 py-3 border-b border-border-dark">
                  <div class="flex gap-1.5">
                    <div class="h-3 w-3 rounded-full bg-red-500/80"/>
                    <div class="h-3 w-3 rounded-full bg-yellow-500/80"/>
                    <div class="h-3 w-3 rounded-full bg-green-500/80"/>
                  </div>
                  <div class="flex-1 mx-4">
                    <div class="h-7 bg-input-bg rounded-lg flex items-center px-3 text-xs text-slate-500">
                      <UIcon name="i-heroicons-lock-closed" class="h-3 w-3 mr-2" />
                      devpulse.app/dashboard
                    </div>
                  </div>
                </div>
                
                <div class="p-5 space-y-4">
                  <div class="grid grid-cols-3 gap-3">
                    <div class="bg-brand-dark rounded-xl p-4 border border-border-dark">
                      <div class="flex items-center gap-2 mb-2">
                        <div class="h-8 w-8 rounded-lg bg-brand-purple/10 flex items-center justify-center">
                          <UIcon name="i-heroicons-folder" class="h-4 w-4 text-brand-purple" />
                        </div>
                        <span class="text-xs text-slate-400">Projects</span>
                      </div>
                      <div class="text-2xl font-bold text-white">12</div>
                      <div class="text-xs text-emerald-400 mt-1">+3 this month</div>
                    </div>
                    <div class="bg-brand-dark rounded-xl p-4 border border-border-dark">
                      <div class="flex items-center gap-2 mb-2">
                        <div class="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                          <UIcon name="i-heroicons-check-circle" class="h-4 w-4 text-emerald-400" />
                        </div>
                        <span class="text-xs text-slate-400">Tasks Done</span>
                      </div>
                      <div class="text-2xl font-bold text-white">89</div>
                      <div class="text-xs text-emerald-400 mt-1">94% completion</div>
                    </div>
                    <div class="bg-brand-dark rounded-xl p-4 border border-border-dark">
                      <div class="flex items-center gap-2 mb-2">
                        <div class="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                          <UIcon name="i-heroicons-users" class="h-4 w-4 text-blue-400" />
                        </div>
                        <span class="text-xs text-slate-400">Team</span>
                      </div>
                      <div class="text-2xl font-bold text-white">5</div>
                      <div class="text-xs text-slate-400 mt-1">Active members</div>
                    </div>
                  </div>

                  <div class="bg-brand-dark rounded-xl p-4 border border-border-dark">
                    <div class="flex items-center justify-between mb-4">
                      <span class="text-sm font-semibold text-white">Sprint Board</span>
                      <div class="flex gap-2">
                        <div class="h-6 w-16 rounded-full bg-brand-purple/10 border border-brand-purple/20"/>
                      </div>
                    </div>
                    <div class="grid grid-cols-3 gap-3">
                      <div class="space-y-2">
                        <div class="text-xs text-slate-500 font-medium mb-2">To Do</div>
                        <div class="bg-panel-dark rounded-lg p-3 border border-border-dark">
                          <div class="h-2 w-3/4 bg-slate-600 rounded mb-2"/>
                          <div class="h-2 w-1/2 bg-slate-700 rounded"/>
                        </div>
                        <div class="bg-panel-dark rounded-lg p-3 border border-border-dark">
                          <div class="h-2 w-2/3 bg-slate-600 rounded mb-2"/>
                          <div class="h-2 w-1/2 bg-slate-700 rounded"/>
                        </div>
                      </div>
                      <div class="space-y-2">
                        <div class="text-xs text-slate-500 font-medium mb-2">In Progress</div>
                        <div class="bg-panel-dark rounded-lg p-3 border border-brand-purple/30">
                          <div class="h-2 w-3/4 bg-brand-purple/60 rounded mb-2"/>
                          <div class="h-2 w-1/2 bg-slate-700 rounded"/>
                          <div class="mt-2 flex gap-1">
                            <div class="h-1.5 w-8 rounded-full bg-brand-purple"/>
                            <div class="h-1.5 w-4 rounded-full bg-slate-700"/>
                          </div>
                        </div>
                      </div>
                      <div class="space-y-2">
                        <div class="text-xs text-slate-500 font-medium mb-2">Done</div>
                        <div class="bg-panel-dark rounded-lg p-3 border border-emerald-500/20">
                          <div class="flex items-center gap-1 mb-2">
                            <UIcon name="i-heroicons-check" class="h-3 w-3 text-emerald-400" />
                            <div class="h-2 w-2/3 bg-emerald-500/40 rounded"/>
                          </div>
                          <div class="h-2 w-1/2 bg-slate-700 rounded"/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="absolute -top-6 -right-6 bg-panel-dark border border-border-dark rounded-xl p-3 shadow-xl animate-bounce" style="animation-duration: 3s;">
                <div class="flex items-center gap-2">
                  <div class="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <UIcon name="i-heroicons-sparkles" class="h-4 w-4 text-emerald-400" />
                  </div>
                  <div>
                    <div class="text-xs font-semibold text-white">Kanban Board</div>
                    <div class="text-[10px] text-slate-400">Generated</div>
                  </div>
                </div>
              </div>

              <div class="absolute -bottom-8 -left-4 bg-panel-dark border border-border-dark rounded-xl p-3 shadow-xl" style="animation: bounce 4s infinite;">
                <div class="flex items-center gap-2">
                  <div class="h-8 w-8 rounded-lg bg-brand-purple/10 flex items-center justify-center">
                    <UIcon name="i-heroicons-user-plus" class="h-4 w-4 text-brand-purple" />
                  </div>
                  <div>
                    <div class="text-xs font-semibold text-white">New Member</div>
                    <div class="text-[10px] text-slate-400">Joined team</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

      <section id="stats" class="relative py-20 border-y border-border-dark bg-brand-dark/50">
        <div class="absolute inset-0 bg-gradient-to-r from-brand-purple/5 via-transparent to-brand-purple/5"/>
        <div class="relative max-w-7xl mx-auto px-6">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div v-for="stat in stats" :key="stat.label" class="text-center">
              <div class="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 mb-2">
                {{ stat.value }}
              </div>
              <div class="text-sm text-slate-400">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" class="py-24 relative">
        <div class="max-w-7xl mx-auto px-6">
          <div class="text-center mb-16">
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-xs font-medium mb-4">
              <UIcon name="i-heroicons-cube" class="h-4 w-4" />
              Platform Features
            </div>
            <h2 class="text-4xl font-extrabold text-white mb-4">
              Everything You Need to
              <span class="text-brand-purple">Build & Document</span>
            </h2>
            <p class="text-slate-400 max-w-2xl mx-auto">
              DevPulse combines project management, engineering diagrams, AI documentation, 
              and academic supervision in one unified platform.
            </p>
          </div>

          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="(f, idx) in features" 
              :key="f.title"
              class="group relative bg-panel-dark border border-border-dark rounded-2xl p-6 hover:border-brand-purple/30 transition-all duration-300 hover:shadow-xl hover:shadow-brand-purple/5"
            >
              <div class="absolute inset-0 bg-gradient-to-br from-brand-purple/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"/>
              
              <div class="relative">
                <div class="h-12 w-12 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <UIcon :name="f.icon" class="h-6 w-6 text-brand-purple" />
                </div>
                
                <h3 class="text-lg font-bold text-white mb-2">{{ f.title }}</h3>
                <p class="text-sm text-slate-400 leading-relaxed">{{ f.desc }}</p>
              </div>

              <div class="absolute top-4 right-4 text-slate-700 text-5xl font-extrabold opacity-20">
                0{{ idx + 1 }}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how" class="py-24 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-b from-brand-dark/30 to-transparent"/>
        
        <div class="relative max-w-7xl mx-auto px-6">
          <div class="text-center mb-16">
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-xs font-medium mb-4">
              <UIcon name="i-heroicons-map" class="h-4 w-4" />
              Process
            </div>
            <h2 class="text-4xl font-extrabold text-white mb-4">
              How <span class="text-brand-purple">DevPulse</span> Works
            </h2>
            <p class="text-slate-400 max-w-2xl mx-auto">
              From idea to final documentation — a streamlined journey for your graduation project.
            </p>
          </div>

          <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div 
              v-for="(s, idx) in steps" 
              :key="s.title"
              class="relative"
            >
              <div v-if="idx < steps.length - 1" class="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-brand-purple/50 to-border-dark z-0"/>
              
              <div class="relative bg-panel-dark border border-border-dark rounded-2xl p-6 hover:border-brand-purple/30 transition-all duration-300 group">
                <div class="flex items-center justify-between mb-4">
                  <div class="h-12 w-12 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center group-hover:bg-brand-purple group-hover:border-brand-purple transition-all">
                    <UIcon :name="s.icon" class="h-6 w-6 text-brand-purple group-hover:text-white transition-colors" />
                  </div>
                  <div class="h-8 w-8 rounded-full bg-brand-dark border border-border-dark flex items-center justify-center text-xs font-bold text-brand-purple">
                    {{ idx + 1 }}
                  </div>
                </div>
                
                <h3 class="text-lg font-bold text-white mb-2">{{ s.title }}</h3>
                <p class="text-sm text-slate-400 leading-relaxed">{{ s.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="py-24 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-brand-purple/10 via-brand-dark to-brand-bg"/>
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-purple/10 rounded-full blur-3xl"/>
        
        <div class="relative max-w-4xl mx-auto px-6 text-center">
          <h2 class="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Ready to Start Your
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-[#9b9aff]">Graduation Project?</span>
          </h2>
          <p class="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
            Join thousands of engineering students who are building, collaborating, and documenting 
            their projects with DevPulse's intelligent platform.
          </p>
          
          <div class="flex flex-wrap gap-4 justify-center">
            <button 
              class="bg-brand-purple hover:bg-brand-purple-hover active:bg-brand-purple-active text-white font-semibold px-10 py-4 rounded-xl transition-all shadow-xl shadow-brand-purple/25 flex items-center gap-2"
              @click="showAccountModal = true"
            >
              <UIcon name="i-heroicons-rocket-launch" class="h-5 w-5" />
              <span>Get Started Free</span>
            </button>
            <button 
              class="px-10 py-4 rounded-xl border border-border-slate text-slate-300 hover:text-white hover:border-brand-purple/50 transition-all flex items-center gap-2"
            >
              <UIcon name="i-heroicons-book-open" class="h-5 w-5" />
              <span>View Documentation</span>
            </button>
          </div>
        </div>
      </section>

      <footer class="border-t border-border-dark bg-brand-dark">
        <div class="max-w-7xl mx-auto px-6 py-16">
          <div class="grid md:grid-cols-4 gap-12">
            <div class="md:col-span-2">
              <div class="flex items-center gap-3 mb-4">
                <div class="h-10 w-10 rounded-xl bg-brand-purple flex items-center justify-center">
                  <UIcon name="i-heroicons-bolt" class="h-5 w-5 text-white" />
                </div>
                <span class="text-xl font-bold text-white">DevPulse</span>
              </div>
              <p class="text-slate-400 text-sm leading-relaxed max-w-md mb-6">
                The unified engineering platform for managing graduation projects. 
                Built for students, professors, and academic committees.
              </p>
              <div class="flex gap-3">
                <div class="h-10 w-10 rounded-lg bg-panel-dark border border-border-dark flex items-center justify-center hover:border-brand-purple/50 transition-colors cursor-pointer">
                  <UIcon name="i-heroicons-globe-alt" class="h-5 w-5 text-slate-400" />
                </div>
                <div class="h-10 w-10 rounded-lg bg-panel-dark border border-border-dark flex items-center justify-center hover:border-brand-purple/50 transition-colors cursor-pointer">
                  <UIcon name="i-heroicons-envelope" class="h-5 w-5 text-slate-400" />
                </div>
              </div>
            </div>

            <div>
              <h4 class="text-white font-semibold mb-4">Platform</h4>
              <ul class="space-y-3">
                <li><button class="text-sm text-slate-400 hover:text-white transition-colors" @click="scrollToSection('features')">Features</button></li>
                <li><button class="text-sm text-slate-400 hover:text-white transition-colors" @click="scrollToSection('how')">How it works</button></li>
                <li><span class="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer">Documentation</span></li>
                <li><span class="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer">API</span></li>
              </ul>
            </div>

            <div>
              <h4 class="text-white font-semibold mb-4">Support</h4>
              <ul class="space-y-3">
                <li><span class="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer">Help Center</span></li>
                <li><span class="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer">Privacy Policy</span></li>
                <li><span class="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer">Terms of Service</span></li>
                <li><span class="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer">Contact</span></li>
              </ul>
            </div>
          </div>

          <div class="mt-12 pt-8 border-t border-border-dark flex flex-col sm:flex-row items-center justify-between gap-4">
            <span class="text-sm text-slate-500">
              © {{ new Date().getFullYear() }} DevPulse. All rights reserved.
            </span>
            <span class="text-sm text-slate-600">
              Al-Sham Private University — Informatics Engineering
            </span>
          </div>
        </div>
      </footer>
    </main>

    <UModal
      v-model:open="showAccountModal"
      :close="{ color: 'primary', variant: 'outline', class: 'rounded-full' }"
      class="bg-brand-deep sm:min-w-2xl"
    >
      <template #title>
        <div class="text-xl font-extrabold text-white">
          Account Type
        </div>
      </template>

      <template #body>
        <div class="grid sm:grid-cols-2 gap-4">
          <div
            v-for="acc in accounts"
            :key="acc.key"
            class="cursor-pointer rounded-2xl bg-panel-dark border border-border-dark hover:border-brand-purple/50 p-5 transition-all hover:shadow-lg hover:shadow-brand-purple/10 group"
            @click="goToAuth(acc.route)"
          >
            <div class="flex items-start gap-4">
              <div class="hidden h-12 mt-2 w-12 rounded-xl bg-brand-purple/10 border border-brand-purple/20 sm:flex items-center justify-center group-hover:bg-brand-purple group-hover:border-brand-purple transition-all">
                <UIcon
                  :name="acc.icon"
                  class="w-10 h-8 text-brand-purple group-hover:text-white transition-colors"
                />
              </div>

              <div>
                <h3 class="font-bold text-white">
                  {{ acc.title }}
                </h3>
                <p class="mt-1 text-sm text-slate-400">
                  {{ acc.desc }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex w-full justify-end">
          <button
            class="text-slate-400 hover:text-white transition-colors text-sm px-4 py-2"
            @click="showAccountModal = false"
          >
            Cancel
          </button>
        </div>
      </template>
    </UModal>
  </div>
</template>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
</style>