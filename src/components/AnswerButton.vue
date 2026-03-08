<template>
  <button
    @click="handleClick"
    :disabled="disabled"
    :class="[
      'answer-option text-base',
      state === 'correct' ? 'answer-correct animate-bounce-in' : '',
      state === 'wrong'   ? 'answer-wrong animate-shake'    : '',
      state === 'neutral' && !disabled ? 'hover:scale-[1.01]' : '',
      disabled && state === 'neutral' ? 'opacity-50 cursor-not-allowed' : '',
    ]"
  >
    <div class="flex items-center gap-3">
      <span
        class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 transition-all"
        :class="labelClass"
      >
        {{ label }}
      </span>
      <span>{{ option }}</span>
      <span v-if="state === 'correct'" class="ml-auto text-emerald-500 font-bold">✓</span>
      <span v-else-if="state === 'wrong'" class="ml-auto text-red-500 font-bold">✗</span>
    </div>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  option:   { type: String, required: true },
  label:    { type: String, required: true },  // A, B, C, D
  state:    { type: String, default: 'neutral' }, // neutral | correct | wrong
  disabled: { type: Boolean, default: false },
})
const emit = defineEmits(['select'])

const labelClass = computed(() => {
  if (props.state === 'correct') return 'bg-emerald-500 text-white'
  if (props.state === 'wrong')   return 'bg-red-500 text-white'
  return 'bg-indigo-100 text-indigo-700'
})

function handleClick() {
  if (!props.disabled) emit('select', props.option)
}
</script>
