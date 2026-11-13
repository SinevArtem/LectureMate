import type { BoardSnapshot, AIAnalysisEvent } from '../types/ai'
import type { Task } from '../data/tasks'

export interface AIAnalysisRequest {
  task: Pick<Task, 'id' | 'code' | 'title' | 'statement'>
  board: BoardSnapshot | null
  mode: 'hint' | 'solution'
}

export interface AIProvider {
  analyze(request: AIAnalysisRequest, signal?: AbortSignal): AsyncGenerator<AIAnalysisEvent>
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
  return new HttpAIProvider(endpoint ?? '/api/ai/analyze')
}
