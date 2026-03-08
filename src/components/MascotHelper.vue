<template>
  <transition name="mascot-slide">
    <div
      v-if="visible"
      class="fixed bottom-5 right-5 z-50 flex items-end gap-3"
    >
      <!-- Speech bubble -->
      <transition name="bubble">
        <div
          v-if="showBubble"
          class="relative bg-white rounded-2xl shadow-xl px-4 py-3 max-w-[180px] text-sm font-semibold text-gray-700 border-2 border-indigo-100"
        >
          {{ currentMessage }}
          <!-- tail -->
          <span class="absolute -right-2 bottom-4 w-0 h-0 border-t-8 border-t-transparent border-l-8 border-l-white border-b-8 border-b-transparent"></span>
        </div>
      </transition>

      <!-- Mascot avatar -->
      <button
        @click="toggleBubble"
        class="w-16 h-16 rounded-full gradient-bg shadow-xl flex items-center justify-center text-3xl hover:scale-110 active:scale-95 transition-transform duration-200 border-4 border-white"
        title="Study Buddy"
      >
        🤖
      </button>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  message: { type: String, default: '' },
  visible: { type: Boolean, default: true },
})

const MESSAGES = [
  "You're doing amazing! 🌟",
  "Keep going, you've got this! 💪",
  "Learning every day makes you unstoppable! 🚀",
  "Great job! One step at a time! 🎯",
  "I believe in you! 🤗",
  "Mistakes help us learn — keep trying! 🧠",
  "You're smarter than you think! ✨",
]

const showBubble = ref(true)
const currentMessage = ref(props.message || MESSAGES[0])
let msgIndex = 0

function toggleBubble() {
  if (showBubble.value) {
    showBubble.value = false
  } else {
    msgIndex = (msgIndex + 1) % MESSAGES.length
    currentMessage.value = MESSAGES[msgIndex]
    showBubble.value = true
  }
}

watch(() => props.message, (val) => {
  if (val) {
    currentMessage.value = val
    showBubble.value = true
  }
})

onMounted(() => {
  // Cycle messages every 8s
  setInterval(() => {
    if (showBubble.value) {
      msgIndex = (msgIndex + 1) % MESSAGES.length
      currentMessage.value = MESSAGES[msgIndex]
    }
  }, 8000)
})
</script>

<style scoped>
.mascot-slide-enter-active, .mascot-slide-leave-active {
  transition: all 0.4s ease;
}
.mascot-slide-enter-from, .mascot-slide-leave-to {
  transform: translateY(80px);
  opacity: 0;
}

.bubble-enter-active, .bubble-leave-active {
  transition: all 0.25s ease;
}
.bubble-enter-from, .bubble-leave-to {
  transform: scale(0.8) translateX(10px);
  opacity: 0;
}
</style>
