import http from 'node:http'

const port = Number(process.env.PORT ?? 8787)
const model = process.env.OPENAI_VISION_MODEL ?? 'gpt-4o-mini'
const seen = new Map()

const json = (res, status, body) => { res.writeHead(status, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(body)) }
const readBody = (req) => new Promise((resolve, reject) => { let data = ''; req.on('data', (chunk) => { data += chunk }); req.on('end', () => resolve(JSON.parse(data))); req.on('error', reject) })
const sse = (res, event) => res.write(`data: ${JSON.stringify(event)}\n\n`)

function checkArithmetic(text) {
  const match = text.replace(',', '.').match(/^\s*(-?\d+(?:\.\d+)?)\s*([+\-*])\s*(-?\d+(?:\.\d+)?)\s*=\s*(-?\d+(?:\.\d+)?)\s*$/)
  if (!match) return null
  const a = Number(match[1]); const b = Number(match[3]); const written = Number(match[4])
  const actual = match[2] === '+' ? a + b : match[2] === '-' ? a - b : a * b
  return { actual, written, correct: actual === written }
}

async function analyzeWithVision(payload) {
  if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is not configured on the backend')
  if (!payload.board?.imageDataUrl) throw new Error('Board image is missing')
  const prompt = `Ты проверяешь решение школьника. Распознай ВСЕ рукописные математические записи на изображении доски. Верни JSON без markdown: {"taskType":{"code":"string","title":"string","confidence":0},"recognizedText":["string"],"hints":[{"lineIndex":0,"severity":"info|warning|error","text":"string"}]}. Если равенство неверно, обязательно укажи фактический результат и ошибку. Не выдумывай записи, которых нет.`
  const response = await fetch('https://api.openai.com/v1/chat/completions', { method: 'POST', headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ model, temperature: 0, response_format: { type: 'json_object' }, messages: [{ role: 'user', content: [{ type: 'text', text: `${prompt}\nУсловие: ${payload.task.statement}` }, { type: 'image_url', image_url: { url: payload.board.imageDataUrl, detail: 'high' } }] }] }) })
  if (!response.ok) throw new Error(`Vision API returned ${response.status}`)
  const data = await response.json()
  return JSON.parse(data.choices?.[0]?.message?.content ?? '{}')
}

const server = http.createServer(async (req, res) => {
  if (req.method !== 'POST' || req.url !== '/api/ai/analyze') return json(res, 404, { error: 'Not found' })
  try {
    const payload = await readBody(req)
    const key = `${payload.task?.id}:${payload.board?.revision}:${payload.mode}`
    if (seen.has(key)) {
      res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' })
      sse(res, { type: 'status', message: 'Эта ревизия уже была проверена' })
      sse(res, { type: 'done' })
      return res.end()
    }
    const result = await analyzeWithVision(payload)
    seen.set(key, Date.now())
    if (seen.size > 1000) seen.delete(seen.keys().next().value)
    const arithmetic = (result.recognizedText ?? []).map(checkArithmetic).find(Boolean)
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' })
    if (result.taskType) sse(res, { type: 'task_type', taskType: result.taskType })
    if (payload.mode === 'hint') {
      for (const [index, hint] of (result.hints ?? []).entries()) sse(res, { type: 'hint', hint: { id: crypto.randomUUID(), lineIndex: hint.lineIndex ?? index, severity: hint.severity ?? 'info', text: hint.text, createdAt: Date.now() } })
      if (arithmetic && !arithmetic.correct) sse(res, { type: 'hint', hint: { id: crypto.randomUUID(), lineIndex: 0, severity: 'error', text: `Проверьте вычисление: правильный результат ${arithmetic.actual}, а записано ${arithmetic.written}.`, createdAt: Date.now() } })
    }
    sse(res, { type: 'done' }); res.end()
  } catch (error) { json(res, 502, { error: error instanceof Error ? error.message : 'AI analysis failed' }) }
})
server.listen(port, () => console.log(`LectureMate AI backend listening on :${port}`))
