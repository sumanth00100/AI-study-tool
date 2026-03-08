<template>
  <div class="w-full max-w-lg mx-auto">
    <div class="relative">
      <span class="absolute left-4 top-1/2 -translate-y-1/2 text-2xl pointer-events-none">📚</span>
      <input
        v-model="topicValue"
        type="text"
        placeholder="e.g. Algebra, Photosynthesis, Gravity…"
        class="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none text-gray-800 font-medium text-base shadow-sm transition-all duration-200 focus:shadow-indigo-100 focus:shadow-lg bg-white"
        @keyup.enter="submit"
        :disabled="loading"
      />
    </div>

    <!-- Suggestions -->
    <div class="flex flex-wrap gap-2 mt-3 justify-center">
      <button
        v-for="s in suggestions"
        :key="s"
        @click="selectSuggestion(s)"
        class="text-sm bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium px-3 py-1.5 rounded-full transition-all duration-150 border border-indigo-200 hover:border-indigo-400 active:scale-95"
      >
        {{ s }}
      </button>
    </div>

    <button
      @click="submit"
      :disabled="!topicValue.trim() || loading"
      class="btn-primary w-full mt-5 flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span v-if="loading" class="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
      <span>{{ loading ? 'Loading…' : 'Start Learning 🚀' }}</span>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  loading: { type: Boolean, default: false },
})
const emit = defineEmits(['submit'])

const topicValue = ref('')
const suggestions = ['Algebra', 'Photosynthesis', 'Gravity', 'World War II', 'Shakespeare', 'DNA']

function selectSuggestion(s) {
  topicValue.value = s
}

function submit() {
  if (!topicValue.value.trim() || props.loading) return
  emit('submit', topicValue.value.trim())
}
</script>
