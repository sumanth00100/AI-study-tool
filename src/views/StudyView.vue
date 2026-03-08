<template>
  <div class="min-h-screen bg-app-bg px-4 py-8 max-w-2xl mx-auto">
    <!-- Back button -->
    <button @click="$router.push('/')" class="flex items-center gap-2 text-indigo-600 font-semibold hover:underline mb-6 text-sm">
      ← Back to Home
    </button>

    <!-- Topic header -->
    <div class="mb-6 animate-slide-up">
      <div class="flex items-center justify-between flex-wrap gap-2">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center text-xl">🧠</div>
          <div>
            <p class="text-xs text-gray-400 font-medium uppercase tracking-wide">Studying</p>
            <h1 class="text-2xl font-extrabold text-gray-900">{{ store.topic }}</h1>
          </div>
        </div>
        <span
          v-if="store.isAiMode"
          class="text-xs bg-emerald-50 text-emerald-600 border border-emerald-200 font-semibold px-3 py-1 rounded-full"
        >✨ Claude AI</span>
      </div>
    </div>

    <!-- Explanation cards -->
    <ExplanationCards :explanation="store.explanation" />

    <!-- CTA -->
    <div class="mt-8">
      <div class="card bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-center shadow-2xl border-0">
        <p class="text-lg font-bold mb-1">Ready to test your knowledge?</p>
        <p class="text-indigo-200 text-sm mb-4">Take a quick quiz on <strong>{{ store.topic }}</strong></p>
        <button
          @click="goToQuiz"
          class="bg-white text-indigo-700 font-bold py-3 px-8 rounded-xl hover:bg-indigo-50 active:scale-95 transition-all duration-200 shadow-lg"
        >
          Start Quiz 🎯
        </button>
      </div>
    </div>

    <MascotHelper :message="`Let's learn about ${store.topic}! Read carefully — there's a quiz coming! 😊`" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ExplanationCards from '../components/ExplanationCards.vue'
import MascotHelper from '../components/MascotHelper.vue'
import { studyStore } from '../store/studyStore.js'

const router = useRouter()
const store = studyStore   // alias so template can use `store.topic` etc.

onMounted(() => {
  // If no study data loaded (e.g. direct URL navigation), go home
  if (!studyStore.hasData) {
    router.push('/')
  }
})

function goToQuiz() {
  router.push({ name: 'quiz' })
}
</script>
