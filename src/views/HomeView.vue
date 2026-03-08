<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
    <!-- Decorative blobs -->
    <div class="absolute top-0 left-0 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse pointer-events-none"></div>
    <div class="absolute bottom-0 right-0 w-72 h-72 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse pointer-events-none" style="animation-delay:1.5s"></div>
    <div class="absolute top-1/2 left-1/4 w-48 h-48 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse pointer-events-none" style="animation-delay:3s"></div>

    <div class="relative z-10 w-full max-w-2xl">
      <!-- Header -->
      <div class="text-center mb-10 animate-slide-up">
        <div class="text-7xl mb-4 animate-bounce">🧠</div>
        <h1 class="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-3 leading-tight">
          AI Study <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Coach</span>
        </h1>
        <p class="text-gray-500 text-lg font-medium">What do you want to learn today?</p>

        <!-- AI / Demo badge -->
        <div class="mt-3 flex justify-center">
          <span
            class="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
            :class="aiEnabled
              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
              : 'bg-gray-100 text-gray-500 border border-gray-200'"
          >
            <span class="w-1.5 h-1.5 rounded-full inline-block" :class="aiEnabled ? 'bg-emerald-500' : 'bg-gray-400'"></span>
            {{ aiEnabled ? '✨ Powered by OpenRouter AI' : '🎭 Demo mode — add API key for real AI' }}
          </span>
        </div>
      </div>

      <!-- Error alert -->
      <div v-if="error" class="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-medium animate-bounce-in">
        ⚠️ {{ error }}
      </div>

      <!-- Topic input card -->
      <div class="card shadow-2xl border border-indigo-50 animate-slide-up" style="animation-delay:100ms;animation-fill-mode:both">
        <TopicInput :loading="loading" @submit="onSubmit" />
      </div>

      <!-- Quick stats if returning user -->
      <div v-if="hasProgress" class="mt-6 animate-fade-in" style="animation-delay:200ms;animation-fill-mode:both">
        <div class="flex items-center justify-center gap-4 flex-wrap">
          <div class="xp-badge text-sm">⚡ {{ progress.xp }} XP</div>
          <div class="streak-badge text-sm">🔥 {{ progress.streak }}-day streak</div>
          <button
            @click="$router.push('/progress')"
            class="text-sm text-indigo-600 font-semibold hover:underline flex items-center gap-1"
          >
            📊 View Progress →
          </button>
        </div>
      </div>

      <!-- Feature pills -->
      <div class="flex flex-wrap justify-center gap-3 mt-8 animate-fade-in" style="animation-delay:300ms;animation-fill-mode:both">
        <span v-for="f in features" :key="f" class="bg-white border border-gray-200 text-gray-600 text-sm font-medium px-4 py-2 rounded-full shadow-sm">{{ f }}</span>
      </div>
    </div>

    <MascotHelper :message="mascotMsg" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import TopicInput from '../components/TopicInput.vue'
import MascotHelper from '../components/MascotHelper.vue'
import { generateExplanation, generateQuiz, isAiEnabled } from '../services/aiService.js'
import { studyStore } from '../store/studyStore.js'
import { getProgress } from '../services/storageService.js'

const router = useRouter()
const loading = ref(false)
const error = ref('')
const progress = ref({ xp: 0, streak: 0, topics: [] })
const hasProgress = ref(false)
const aiEnabled = isAiEnabled()
const mascotMsg = ref(
  aiEnabled
    ? "Hi! I'm Study Buddy 🤖 Ask me anything — I'll explain it with real AI!"
    : "Hi! I'm Study Buddy 🤖 Try Algebra, Photosynthesis, or Gravity to start!",
)

const features = ['💡 AI Explanations', '🎯 Quiz Games', '⚡ XP Rewards', '📈 Progress Tracking']

onMounted(() => {
  progress.value = getProgress()
  hasProgress.value = progress.value.topics.length > 0 || progress.value.xp > 0
})

async function onSubmit(topic) {
  loading.value = true
  error.value = ''
  try {
    const [explanation, quiz] = await Promise.all([
      generateExplanation(topic),
      generateQuiz(topic),
    ])
    // Store data in reactive store (reliable across all browsers and navigation modes)
    studyStore.setStudyData(topic, explanation, quiz, aiEnabled)
    router.push({ name: 'study' })
  } catch (err) {
    console.error(err)
    error.value = err.message || 'Something went wrong. Please try again!'
  } finally {
    loading.value = false
  }
}
</script>
