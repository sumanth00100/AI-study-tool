<template>
  <div id="app" class="font-poppins bg-app-bg min-h-screen">
    <!-- Top Navigation -->
    <nav class="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div class="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <router-link to="/" class="flex items-center gap-2 font-extrabold text-xl text-gray-900 hover:text-indigo-600 transition-colors">
          <span class="text-2xl">🧠</span>
          <span class="hidden sm:inline">AI Study Coach</span>
        </router-link>

        <div class="flex items-center gap-1 sm:gap-3">
          <router-link
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg transition-all duration-150"
            :class="$route.path === link.to
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'"
          >
            <span>{{ link.icon }}</span>
            <span class="hidden sm:inline">{{ link.label }}</span>
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Page content with transition -->
    <router-view v-slot="{ Component }">
      <transition name="page-fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
const navLinks = [
  { to: '/',         icon: '🏠', label: 'Home'     },
  { to: '/progress', icon: '📊', label: 'Progress' },
]
</script>

<style>
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.page-fade-enter-from { opacity: 0; transform: translateY(8px); }
.page-fade-leave-to   { opacity: 0; transform: translateY(-8px); }
</style>
