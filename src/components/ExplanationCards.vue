<template>
  <div class="space-y-4 w-full">
    <!-- Simple Explanation -->
    <div class="card animate-slide-up border-l-4 border-indigo-500" style="animation-delay: 0ms">
      <div class="flex items-center gap-3 mb-3">
        <div class="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-xl">💡</div>
        <h3 class="text-lg font-bold text-indigo-700">Simple Explanation</h3>
      </div>
      <p class="text-gray-700 leading-relaxed">{{ explanation.explanation }}</p>
    </div>

    <!-- Key Points -->
    <div class="card animate-slide-up border-l-4 border-emerald-500" style="animation-delay: 80ms">
      <div class="flex items-center gap-3 mb-3">
        <div class="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-xl">🔑</div>
        <h3 class="text-lg font-bold text-emerald-700">Key Points</h3>
      </div>
      <ul class="space-y-2">
        <li
          v-for="(point, i) in explanation.keyPoints"
          :key="i"
          class="flex items-start gap-2 text-gray-700"
        >
          <span class="mt-1 w-5 h-5 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center font-bold flex-shrink-0">{{ i + 1 }}</span>
          <span>{{ point }}</span>
        </li>
      </ul>
    </div>

    <!-- Example -->
    <div class="card animate-slide-up border-l-4 border-amber-500" style="animation-delay: 160ms">
      <div class="flex items-center gap-3 mb-3">
        <div class="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-xl">🔬</div>
        <h3 class="text-lg font-bold text-amber-700">Real-World Example</h3>
      </div>
      <div class="bg-amber-50 rounded-xl p-4 font-mono text-sm text-amber-900 border border-amber-200">
        {{ explanation.example }}
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  explanation: {
    type: Object,
    required: true,
  },
})
</script>
