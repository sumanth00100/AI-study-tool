<template>
  <div class="min-h-screen bg-app-bg px-4 py-8 max-w-2xl mx-auto">
    <!-- Back -->
    <button @click="$router.push('/')" class="flex items-center gap-2 text-indigo-600 font-semibold hover:underline mb-6 text-sm">
      ← Back to Home
    </button>

    <!-- Quiz in progress -->
    <div v-if="phase === 'quiz'">
      <div class="mb-6 flex items-center justify-between flex-wrap gap-2 animate-slide-up">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-xl">🎯</div>
          <div>
            <p class="text-xs text-gray-400 font-medium uppercase tracking-wide">Quiz Time</p>
            <h1 class="text-2xl font-extrabold text-gray-900">{{ store.topic }}</h1>
          </div>
        </div>
        <span
          v-if="store.isAiMode"
          class="text-xs bg-emerald-50 text-emerald-600 border border-emerald-200 font-semibold px-3 py-1 rounded-full"
        >✨ Claude AI</span>
      </div>

      <!-- key forces QuizGame to fully remount on every retry attempt -->
      <QuizGame
        :key="quizAttempt"
        :questions="store.quiz"
        @complete="onComplete"
      />
    </div>

    <!-- Score screen -->
    <div v-else-if="phase === 'score'" class="animate-bounce-in">
      <div class="mb-6 text-center animate-slide-up">
        <h1 class="text-2xl font-extrabold text-gray-900">Quiz Complete! 🎊</h1>
      </div>
      <ScoreBoard
        :correct="result.score"
        :total="result.total"
        @continue="$router.push('/')"
        @retry="retry"
      />
    </div>

    <MascotHelper :message="mascotMsg" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import QuizGame from '../components/QuizGame.vue'
import ScoreBoard from '../components/ScoreBoard.vue'
import MascotHelper from '../components/MascotHelper.vue'
import { studyStore } from '../store/studyStore.js'
import { saveProgress, addXP } from '../services/storageService.js'
import confetti from 'canvas-confetti'

const router = useRouter()
const store = studyStore   // alias so template can use `store.topic` etc.
const phase = ref('quiz')
const result = ref({ score: 0, total: 0 })
const quizAttempt = ref(0)   // increment to force QuizGame remount on retry
const mascotMsg = ref("You've got this! Think carefully before answering! 🤔")

onMounted(() => {
  if (!studyStore.hasData || !studyStore.quiz.length) {
    router.push('/')
  }
})

function onComplete({ score, total }) {
  result.value = { score, total }
  const pct = Math.round((score / total) * 100)

  saveProgress(studyStore.topic, pct)
  addXP(score * 10 + 50)

  phase.value = 'score'

  if (pct >= 50) {
    launchConfetti()
    mascotMsg.value = pct === 100 ? '🏆 PERFECT! You nailed it!' : '🎉 Great job finishing the quiz!'
  } else {
    mascotMsg.value = "Don't worry — practice makes perfect! 💪"
  }
}

function retry() {
  quizAttempt.value++   // this causes QuizGame to remount fresh
  phase.value = 'quiz'
  mascotMsg.value = "Try again — you've got this! 💪"
}

function launchConfetti() {
  const fire = (particleRatio, opts) => {
    confetti({
      origin: { y: 0.7 },
      ...opts,
      particleCount: Math.floor(200 * particleRatio),
    })
  }
  fire(0.25, { spread: 26, startVelocity: 55, colors: ['#4F46E5', '#7C3AED'] })
  fire(0.20, { spread: 60, colors: ['#22C55E', '#10B981'] })
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ['#F59E0B', '#EF4444'] })
  fire(0.10, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2, colors: ['#EC4899', '#8B5CF6'] })
  fire(0.10, { spread: 120, startVelocity: 45, colors: ['#06B6D4', '#3B82F6'] })
}
</script>
