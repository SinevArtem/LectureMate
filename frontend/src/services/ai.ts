import type { BoardSnapshot, AIAnalysisEvent, SolutionStep, TaskType } from '../types/ai'
import type { Task } from '../data/tasks'

export interface AIAnalysisRequest {
  task: Pick<Task, 'id' | 'code' | 'title' | 'statement'>
  board: BoardSnapshot | null
  mode: 'hint' | 'solution'
}

export interface AIProvider {
  analyze(request: AIAnalysisRequest, signal?: AbortSignal): AsyncGenerator<AIAnalysisEvent>
}

const wait = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const timeout = window.setTimeout(resolve, ms)
    signal?.addEventListener('abort', () => {
      window.clearTimeout(timeout)
      reject(new DOMException('Analysis cancelled', 'AbortError'))
    }, { once: true })
  })

function taskTypeFor(task: AIAnalysisRequest['task']): TaskType {
  return { code: task.code, title: task.title, confidence: 0.94 }
}

function solutionFor(task: AIAnalysisRequest['task']): SolutionStep[] {
  return [
    { id: 'step-1', order: 1, title: 'Выделяем шаг', explanation: 'Перенесите известные слагаемые и приведите подобные.', expression: task.statement },
    { id: 'step-2', order: 2, title: 'Проверяем вычисления', explanation: 'Выполните действие аккуратно и сравните результат с условием.' },
    { id: 'step-3', order: 3, title: 'Записываем ответ', explanation: 'Подставьте найденное значение обратно и сформулируйте ответ.' },
  ]
}

function checkSimpleEquality(text: string): { actual: number; expected: number } | null {
  const match = text.replace(',', '.').match(/^\s*(-?\d+(?:\.\d+)?)\s*([+\-*])\s*(-?\d+(?:\.\d+)?)\s*=\s*(-?\d+(?:\.\d+)?)\s*$/)
  if (!match) return null
  const left = Number(match[1])
  const right = Number(match[3])
  const expected = Number(match[4])
  const actual = match[2] === '+' ? left + right : match[2] === '-' ? left - right : left * right
  return { actual, expected }
}

/** Локальный провайдер позволяет разрабатывать UI до подключения сервера. */
export class MockAIProvider implements AIProvider {
  async *analyze(request: AIAnalysisRequest, signal?: AbortSignal): AsyncGenerator<AIAnalysisEvent> {
    await wait(350, signal)
    yield { type: 'task_type', taskType: taskTypeFor(request.task) }
    if (request.mode === 'hint') {
      await wait(450, signal)
      const candidate = request.board?.textContent.find((text) => checkSimpleEquality(text))
      const checked = candidate ? checkSimpleEquality(candidate) : null
      yield {
        type: 'hint',
        hint: {
          id: crypto.randomUUID(), lineIndex: Math.max((request.board?.shapeCount ?? 1) - 1, 0),
          severity: checked && checked.actual !== checked.expected ? 'error' : 'info',
          text: checked && checked.actual !== checked.expected
            ? `Проверьте вычисление: получаете ${checked.actual}, а записано ${checked.expected}.`
            : 'Проверьте последний шаг: выражение должно сохранять равенство с обеих сторон.',
          createdAt: Date.now(),
        },
      }
    } else {
      for (const step of solutionFor(request.task)) {
        await wait(300, signal)
        yield { type: 'solution_step', step }
      }
    }
    yield { type: 'done' }
  }
}

/** SSE-адаптер для будущего backend/OpenAI-compatible сервиса. */
export class HttpAIProvider implements AIProvider {
  private readonly endpoint: string

  constructor(endpoint: string) {
    this.endpoint = endpoint
  }

  async *analyze(request: AIAnalysisRequest, signal?: AbortSignal): AsyncGenerator<AIAnalysisEvent> {
    const response = await fetch(this.endpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
      body: JSON.stringify(request), signal,
    })
    if (!response.ok || !response.body) throw new Error(`AI API: ${response.status}`)
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    while (true) {
      const { value, done } = await reader.read()
      buffer += decoder.decode(value ?? new Uint8Array(), { stream: !done })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''
      for (const line of lines) {
        if (!line.startsWith('data:')) continue
        const payload = line.slice(5).trim()
        if (payload === '[DONE]') {
          yield { type: 'done' }
          return
        }
        yield JSON.parse(payload) as AIAnalysisEvent
      }
      if (done) break
    }
    yield { type: 'done' }
  }
}

export function createAIProvider(): AIProvider {
  const endpoint = import.meta.env.VITE_AI_API_URL as string | undefined
  return endpoint ? new HttpAIProvider(endpoint) : new MockAIProvider()
}
