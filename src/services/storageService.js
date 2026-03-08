const STORAGE_KEY = 'study_progress'

const defaultData = () => ({
  xp: 0,
  streak: 0,
  lastStudyDate: null,
  topics: [],
  weakTopics: [],
})

export function getProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : defaultData()
  } catch {
    return defaultData()
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function saveProgress(topic, score) {
  const data = getProgress()
  const today = new Date().toISOString().split('T')[0]

  // Update streak
  if (data.lastStudyDate !== today) {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]
    data.streak = data.lastStudyDate === yesterdayStr ? (data.streak || 0) + 1 : 1
    data.lastStudyDate = today
  }

  // Upsert topic entry (keep best score? or latest)
  const idx = data.topics.findIndex(t => t.name.toLowerCase() === topic.toLowerCase())
  if (idx !== -1) {
    data.topics[idx] = { name: topic, score, date: today }
  } else {
    data.topics.push({ name: topic, score, date: today })
  }

  // Track weak topics (score < 60)
  if (score < 60) {
    if (!data.weakTopics.includes(topic)) data.weakTopics.push(topic)
  } else {
    data.weakTopics = data.weakTopics.filter(t => t.toLowerCase() !== topic.toLowerCase())
  }

  saveData(data)
  return data
}

export function addXP(points) {
  const data = getProgress()
  data.xp = (data.xp || 0) + points
  saveData(data)
  return data.xp
}

export function getWeakTopics() {
  return getProgress().weakTopics || []
}

export function resetProgress() {
  localStorage.removeItem(STORAGE_KEY)
}
