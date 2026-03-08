<template>
  <div class="card max-w-md mx-auto text-center shadow-2xl border border-gray-100 animate-bounce-in">
    <!-- Trophy / emoji -->
    <div class="text-6xl mb-4">{{ emoji }}</div>
    <h2 class="text-2xl font-bold text-gray-800 mb-1">{{ headline }}</h2>
    <p class="text-gray-500 text-sm mb-6">You answered {{ correct }} out of {{ total }} correctly</p>

    <!-- Score circle -->
    <div class="relative w-32 h-32 mx-auto mb-6">
      <svg class="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="50" fill="none" stroke="#E5E7EB" stroke-width="12" />
        <circle
          cx="60" cy="60" r="50" fill="none"
          :stroke="scoreColor"
          stroke-width="12"
          stroke-linecap="round"
          stroke-dasharray="314"
          :stroke-dashoffset="314 - (314 * pct / 100)"
          style="transition: stroke-dashoffset 1s ease"
        />
      </svg>
      <div class="absolute inset-0 flex items-center justify-center">
        <span class="text-3xl font-extrabold" :style="{ color: scoreColor }">{{ pct }}%</span>
      </div>
    </div>

    <!-- XP earned -->
    <div class="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3 mb-6">
      <span class="text-2xl">⚡</span>
      <div class="text-left">
        <p class="text-xs text-amber-600 font-medium uppercase tracking-wide">XP Earned</p>
        <p class="text-2xl font-extrabold text-amber-600">+{{ xpEarned }}</p>
      </div>
    </div>

    <!-- Breakdown -->
    <div class="grid grid-cols-2 gap-3 mb-6">
      <div class="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
        <p class="text-2xl font-extrabold text-emerald-600">{{ correct }}</p>
        <p class="text-xs text-emerald-600 font-medium">Correct</p>
      </div>
      <div class="bg-red-50 rounded-xl p-3 border border-red-100">
        <p class="text-2xl font-extrabold text-red-500">{{ total - correct }}</p>
        <p class="text-xs text-red-500 font-medium">Incorrect</p>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex flex-col sm:flex-row gap-3">
      <button @click="emit('continue')" class="btn-primary flex-1 flex items-center justify-center gap-2">
        <span>Continue Learning</span> <span>📚</span>
      </button>
      <button @click="emit('retry')" class="btn-accent flex-1 flex items-center justify-center gap-2">
        <span>Retry Quiz</span> <span>🔁</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  correct: { type: Number, required: true },
  total:   { type: Number, required: true },
})
const emit = defineEmits(['continue', 'retry'])

const pct = computed(() => Math.round((props.correct / props.total) * 100))

const xpEarned = computed(() => props.correct * 10 + 50) // +50 for completion

const scoreColor = computed(() => {
  if (pct.value >= 80) return '#10B981'
  if (pct.value >= 50) return '#F59E0B'
  return '#EF4444'
})

const emoji = computed(() => {
  if (pct.value === 100) return '🏆'
  if (pct.value >= 80)  return '🎉'
  if (pct.value >= 50)  return '👍'
  return '💪'
})

const headline = computed(() => {
  if (pct.value === 100) return 'Perfect Score!'
  if (pct.value >= 80)  return 'Great Job!'
  if (pct.value >= 50)  return 'Good Effort!'
  return 'Keep Practicing!'
})
</script>
