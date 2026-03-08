/**
 * AI Service — powered by OpenRouter (openrouter.ai)
 *
 * - API key set  → calls real AI via the Vite proxy (/api/openrouter)
 *                  throws on failure so the caller shows the real error
 * - No API key   → returns demo mocks for Algebra / Photosynthesis / Gravity only
 */

export function isAiEnabled() {
  return Boolean(import.meta.env.VITE_AI_ENABLED)
}

// ── Core fetch ────────────────────────────────────────────────────────────────

async function callAI(prompt, maxTokens = 800) {
  const res = await fetch('/api/openrouter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'arcee-ai/trinity-large-preview:free',
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data?.error?.message ?? `OpenRouter error (${res.status})`)
  }

  const text = data.choices?.[0]?.message?.content ?? ''
  if (!text) throw new Error('AI returned an empty response')
  return text
}

// ── JSON parser ───────────────────────────────────────────────────────────────

function parseJSON(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  return JSON.parse(fenced ? fenced[1].trim() : text.trim())
}

// ── Demo mocks (no API key) ───────────────────────────────────────────────────

const MOCKS = {
  explanation: {
    algebra: {
      explanation: "Algebra is a branch of mathematics where letters stand in for numbers we don't know yet. It's like a puzzle — the equation gives you clues and you solve for the missing piece!",
      keyPoints: ['Variables (x, y) represent unknown numbers', 'Equations must stay balanced on both sides', 'Solving means isolating the variable'],
      example: '3x + 6 = 12  →  3x = 6  →  x = 2',
    },
    photosynthesis: {
      explanation: 'Photosynthesis is how plants make food using sunlight. They act like tiny solar-powered kitchens — turning sunlight, water, and CO₂ into sugar and oxygen!',
      keyPoints: ['Chlorophyll in leaves captures sunlight', 'Plants absorb CO₂ and water as raw materials', 'They produce glucose (food) and release oxygen'],
      example: '6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂',
    },
    gravity: {
      explanation: "Gravity is the invisible force that pulls everything toward mass. Earth is so massive that it pulls you to the ground — that's why things fall down and not sideways!",
      keyPoints: ['Every object with mass attracts every other object', "Earth's gravity accelerates objects at 9.8 m/s²", 'Gravity keeps planets orbiting the Sun'],
      example: 'Drop a ball — it falls 9.8 m/s faster every second until it hits the ground.',
    },
  },
  quiz: {
    algebra: [
      { question: 'Solve for x: 3x + 6 = 12', options: ['1', '2', '3', '6'], answer: '2' },
      { question: 'What does a variable represent?', options: ['A known number', 'An unknown number', 'A symbol for multiply', 'A type of graph'], answer: 'An unknown number' },
      { question: 'If 5x = 25, what is x?', options: ['3', '4', '5', '6'], answer: '5' },
      { question: 'Which is an algebraic expression?', options: ['2 + 3 = 5', '4 × 6', '3x + 7', '100 ÷ 4'], answer: '3x + 7' },
    ],
    photosynthesis: [
      { question: 'What gas do plants absorb during photosynthesis?', options: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen'], answer: 'Carbon dioxide' },
      { question: 'What pigment makes leaves green?', options: ['Melanin', 'Chlorophyll', 'Carotene', 'Hemoglobin'], answer: 'Chlorophyll' },
      { question: 'What gas is released as a byproduct?', options: ['CO₂', 'Nitrogen', 'Oxygen', 'Water vapor'], answer: 'Oxygen' },
      { question: 'What energy source powers photosynthesis?', options: ['Heat', 'Electricity', 'Sunlight', 'Wind'], answer: 'Sunlight' },
    ],
    gravity: [
      { question: "What is Earth's gravitational acceleration?", options: ['5.4 m/s²', '7.2 m/s²', '9.8 m/s²', '12.6 m/s²'], answer: '9.8 m/s²' },
      { question: 'Who described universal gravitation?', options: ['Einstein', 'Galileo', 'Isaac Newton', 'Tesla'], answer: 'Isaac Newton' },
      { question: 'What keeps planets orbiting the Sun?', options: ['Magnetism', 'Gravity', 'Air pressure', 'Friction'], answer: 'Gravity' },
      { question: 'In a vacuum, which falls faster: feather or bowling ball?', options: ['Feather', 'Bowling ball', 'Same speed', 'Depends on shape'], answer: 'Same speed' },
    ],
  },
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function generateExplanation(topic) {
  if (!isAiEnabled()) {
    await new Promise((r) => setTimeout(r, 600))
    const mock = MOCKS.explanation[topic.trim().toLowerCase()]
    if (!mock) throw new Error('Demo mode only supports Algebra, Photosynthesis, or Gravity.\nAdd VITE_AI_ENABLED=true and OPENROUTER_API_KEY in .env for any topic!')
    return mock
  }

  const text = await callAI(
    `You are a friendly high school teacher. Explain "${topic}" simply for a 15-year-old student.

Respond with ONLY this JSON object — no extra text, no code fences:
{"explanation":"2-3 sentence plain-English explanation","keyPoints":["fact 1","fact 2","fact 3"],"example":"one concrete example, analogy, or equation"}`,
    600,
  )

  const data = parseJSON(text)
  if (!data.explanation || !Array.isArray(data.keyPoints) || !data.example) {
    throw new Error('Unexpected response format from AI')
  }
  return data
}

export async function generateQuiz(topic) {
  if (!isAiEnabled()) {
    await new Promise((r) => setTimeout(r, 400))
    const pool = MOCKS.quiz[topic.trim().toLowerCase()]
    if (!pool) throw new Error('Demo mode only supports Algebra, Photosynthesis, or Gravity.\nAdd VITE_AI_ENABLED=true and OPENROUTER_API_KEY in .env for any topic!')
    return [...pool].sort(() => Math.random() - 0.5)
  }

  const text = await callAI(
    `Create 4 multiple-choice quiz questions about "${topic}" for a high school student. Make them progressively harder.

Respond with ONLY a JSON array — no extra text, no code fences:
[{"question":"Question?","options":["A","B","C","D"],"answer":"exact text of correct option"}]

IMPORTANT: "answer" must exactly match one of the four options strings.`,
    900,
  )

  const questions = parseJSON(text)
  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error('AI returned an invalid quiz format')
  }

  const valid = questions.filter(
    (q) => q.question && Array.isArray(q.options) && q.options.length >= 2 && q.answer && q.options.includes(q.answer),
  )
  if (valid.length === 0) throw new Error('AI returned questions with mismatched answers — please retry')
  return valid.slice(0, 4)
}
