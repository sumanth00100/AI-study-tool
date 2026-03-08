<template>
  <div class="min-h-screen bg-app-bg px-4 py-8 max-w-2xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6 animate-slide-up">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-xl">📊</div>
        <h1 class="text-2xl font-extrabold text-gray-900">My Progress</h1>
      </div>
      <button @click="$router.push('/')" class="text-sm text-indigo-600 font-semibold hover:underline">← Home</button>
    </div>

    <ProgressDashboard :progress="progress" />

    <!-- Reset button -->
    <div class="mt-8 text-center animate-fade-in">
      <button
        @click="confirmReset"
        class="text-sm text-gray-400 hover:text-red-500 transition-colors font-medium"
      >
        🗑️ Reset all progress
      </button>
    </div>

    <!-- Confirmation modal -->
    <transition name="fade">
      <div v-if="showConfirm" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
        <div class="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full animate-bounce-in">
          <p class="text-xl font-bold text-gray-800 mb-2">Reset all progress?</p>
          <p class="text-gray-500 text-sm mb-5">This will delete all your XP, streaks, and topic data. This cannot be undone.</p>
          <div class="flex gap-3">
            <button @click="doReset" class="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-xl transition active:scale-95">Yes, reset</button>
            <button @click="showConfirm = false" class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl transition active:scale-95">Cancel</button>
          </div>
        </div>
      </div>
    </transition>

    <MascotHelper :message="mascotMsg" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ProgressDashboard from '../components/ProgressDashboard.vue'
import MascotHelper from '../components/MascotHelper.vue'
import { getProgress, resetProgress } from '../services/storageService.js'

const router = useRouter()
const progress = ref({ xp: 0, streak: 0, topics: [], weakTopics: [] })
const showConfirm = ref(false)
const mascotMsg = ref('')

onMounted(() => {
  progress.value = getProgress()
  const xp = progress.value.xp
  mascotMsg.value = xp === 0
    ? "Start studying to earn XP and build your streak! 🚀"
    : `Wow, ${xp} XP! You're on fire! Keep it up! 🔥`
})

function confirmReset() {
  showConfirm.value = true
}

function doReset() {
  resetProgress()
  progress.value = { xp: 0, streak: 0, topics: [], weakTopics: [] }
  showConfirm.value = false
  mascotMsg.value = "Fresh start! Let's go! 🚀"
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to       { opacity: 0; }
</style>
