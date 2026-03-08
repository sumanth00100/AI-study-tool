<template>
  <div class="space-y-6">
    <!-- Stats row -->
    <div class="grid grid-cols-3 gap-4">
      <div class="card text-center border-t-4 border-indigo-500">
        <p class="text-3xl font-extrabold text-indigo-600">{{ progress.xp }}</p>
        <p class="text-xs text-gray-500 font-semibold mt-1 uppercase tracking-wide">Total XP ⚡</p>
      </div>
      <div class="card text-center border-t-4 border-orange-400">
        <p class="text-3xl font-extrabold text-orange-500">{{ progress.streak }}</p>
        <p class="text-xs text-gray-500 font-semibold mt-1 uppercase tracking-wide">Day Streak 🔥</p>
      </div>
      <div class="card text-center border-t-4 border-emerald-500">
        <p class="text-3xl font-extrabold text-emerald-600">{{ progress.topics.length }}</p>
        <p class="text-xs text-gray-500 font-semibold mt-1 uppercase tracking-wide">Topics 📚</p>
      </div>
    </div>

    <!-- Topic progress -->
    <div class="card">
      <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span>📈</span> Topic Progress
      </h3>

      <div v-if="progress.topics.length === 0" class="text-center py-8 text-gray-400">
        <p class="text-4xl mb-2">🎯</p>
        <p class="font-medium">No topics studied yet. Start learning!</p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="topic in progress.topics"
          :key="topic.name"
          class="group"
        >
          <div class="flex items-center justify-between mb-1.5">
            <span class="font-semibold text-gray-700 text-sm">{{ topic.name }}</span>
            <span
              class="text-xs font-bold px-2 py-0.5 rounded-full"
              :class="scoreBadgeClass(topic.score)"
            >
              {{ topic.score }}%
            </span>
          </div>
          <div class="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-700"
              :class="barColorClass(topic.score)"
              :style="{ width: topic.score + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Weak topics -->
    <div v-if="progress.weakTopics && progress.weakTopics.length" class="card border-l-4 border-red-400">
      <h3 class="text-lg font-bold text-red-600 mb-3 flex items-center gap-2">
        <span>⚠️</span> Needs Improvement
      </h3>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="topic in progress.weakTopics"
          :key="topic"
          class="bg-red-50 text-red-600 border border-red-200 rounded-full px-3 py-1 text-sm font-semibold"
        >
          {{ topic }}
        </span>
      </div>
    </div>

    <!-- XP Level indicator -->
    <div class="card">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-lg font-bold text-gray-800 flex items-center gap-2"><span>🏅</span> Level {{ level }}</h3>
        <span class="text-sm text-gray-500">{{ progress.xp }} / {{ nextLevelXP }} XP</span>
      </div>
      <div class="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
        <div
          class="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700"
          :style="{ width: levelPct + '%' }"
        ></div>
      </div>
      <p class="text-xs text-gray-400 mt-2 text-right">{{ nextLevelXP - progress.xp }} XP to Level {{ level + 1 }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  progress: { type: Object, required: true },
})

const level = computed(() => Math.floor((props.progress.xp || 0) / 100) + 1)
const nextLevelXP = computed(() => level.value * 100)
const levelPct = computed(() => {
  const xpInLevel = (props.progress.xp || 0) % 100
  return xpInLevel
})

function barColorClass(score) {
  if (score >= 80) return 'bg-gradient-to-r from-emerald-400 to-emerald-500'
  if (score >= 50) return 'bg-gradient-to-r from-amber-400 to-amber-500'
  return 'bg-gradient-to-r from-red-400 to-red-500'
}

function scoreBadgeClass(score) {
  if (score >= 80) return 'bg-emerald-100 text-emerald-700'
  if (score >= 50) return 'bg-amber-100 text-amber-700'
  return 'bg-red-100 text-red-600'
}
</script>
