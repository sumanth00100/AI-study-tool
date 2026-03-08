/**
 * Simple reactive store for passing study data between routes.
 * Using a module-level reactive object is far more reliable than history.state,
 * which can be cleared by browser navigation, refreshes, or SSR hydration issues.
 */
import { reactive } from 'vue'

export const studyStore = reactive({
  topic: '',
  explanation: null,   // { explanation, keyPoints[], example }
  quiz: [],            // [{ question, options[], answer }]
  hasData: false,
  isAiMode: false,     // true when real Claude API is being used

  setStudyData(topic, explanation, quiz, isAiMode = false) {
    this.topic = topic
    this.explanation = explanation
    this.quiz = quiz
    this.hasData = true
    this.isAiMode = isAiMode
  },

  clear() {
    this.topic = ''
    this.explanation = null
    this.quiz = []
    this.hasData = false
    this.isAiMode = false
  },
})
