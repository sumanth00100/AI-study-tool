<template>
  <div class="w-full max-w-xl mx-auto space-y-6">
    <!-- Progress header -->
    <div class="flex items-center justify-between mb-1">
      <span class="text-sm font-semibold text-gray-500">
        Question {{ currentIndex + 1 }} of {{ questions.length }}
      </span>
      <span class="xp-badge">⚡ +{{ score * 10 }} XP</span>
    </div>

    <!-- Progress bar -->
    <div class="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
      <div
        class="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
        :style="{ width: progressPct + '%' }"
      ></div>
    </div>

    <!-- Question card -->
    <transition name="question-slide" mode="out-in">
      <div :key="currentIndex" class="card shadow-xl border border-gray-100">
        <p class="text-xl font-bold text-gray-800 leading-snug mb-6">
          {{ current.question }}
        </p>

        <div class="space-y-3">
          <AnswerButton
            v-for="(opt, i) in current.options"
            :key="opt"
            :option="opt"
            :label="labels[i]"
            :state="getState(opt)"
            :disabled="answered"
            @select="onSelect"
          />
        </div>

        <!-- Feedback banner -->
        <transition name="fade">
          <div
            v-if="answered"
            class="mt-5 rounded-xl px-5 py-3 flex items-center justify-between font-semibold"
            :class="lastCorrect ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'"
          >
            <span>{{ lastCorrect ? '🎉 Correct!' : `❌ The answer is "${current.answer}"` }}</span>
            <button
              @click="next"
              class="ml-4 text-sm font-bold bg-white border rounded-lg px-3 py-1.5 transition hover:bg-gray-50 active:scale-95"
              :class="lastCorrect ? 'border-emerald-300 text-emerald-700' : 'border-red-300 text-red-700'"
            >
              {{ isLast ? 'See Results →' : 'Next →' }}
            </button>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AnswerButton from './AnswerButton.vue'

const props = defineProps({
  questions: { type: Array, required: true },
})
const emit = defineEmits(['complete'])

const labels = ['A', 'B', 'C', 'D']

const currentIndex = ref(0)
const score = ref(0)
const answered = ref(false)
const selectedAnswer = ref(null)
const lastCorrect = ref(false)

const current = computed(() => props.questions[currentIndex.value])
const isLast = computed(() => currentIndex.value === props.questions.length - 1)
const progressPct = computed(() =>
  Math.round((currentIndex.value / props.questions.length) * 100)
)

function getState(opt) {
  if (!answered.value) return 'neutral'
  if (opt === current.value.answer) return 'correct'
  if (opt === selectedAnswer.value) return 'wrong'
  return 'neutral'
}

function onSelect(opt) {
  if (answered.value) return
  selectedAnswer.value = opt
  answered.value = true
  lastCorrect.value = opt === current.value.answer
  if (lastCorrect.value) score.value++
}

function next() {
  if (isLast.value) {
    emit('complete', { score: score.value, total: props.questions.length })
    return
  }
  currentIndex.value++
  answered.value = false
  selectedAnswer.value = null
}
</script>

<style scoped>
.question-slide-enter-active, .question-slide-leave-active {
  transition: all 0.3s ease;
}
.question-slide-enter-from { transform: translateX(40px); opacity: 0; }
.question-slide-leave-to  { transform: translateX(-40px); opacity: 0; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to       { opacity: 0; }
</style>
