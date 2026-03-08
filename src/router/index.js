import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import StudyView from '../views/StudyView.vue'
import QuizView from '../views/QuizView.vue'
import ProgressView from '../views/ProgressView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/study', name: 'study', component: StudyView },
  { path: '/quiz', name: 'quiz', component: QuizView },
  { path: '/progress', name: 'progress', component: ProgressView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

export default router
