export type HintSeverity = 'info' | 'warning' | 'error'

export interface Hint {
  id: string
  /** Номер строки на доске, к которой относится подсказка */
  lineIndex: number
  severity: HintSeverity
  text: string
  createdAt: number
}

export interface TaskType {
  /** Например, "ОГЭ №21" */
  code: string
  /** "Квадратные уравнения" */
  title: string
  /** 0..1 */
  confidence: number
}

export interface BoardSnapshot {
  /** Версия состояния доски, чтобы API мог отбросить устаревший ответ. */
  revision: number
  /** Сериализованная часть документа tldraw. */
  document: unknown
  shapeCount: number
  /** Текстовые объекты доски; полезны для быстрого локального анализа. */
  textContent: string[]
  imageDataUrl?: string
  capturedAt: number
}

export interface SolutionStep {
  id: string
  order: number
  title: string
  explanation: string
  expression?: string
}

export type AIAnalysisStatus = 'idle' | 'connecting' | 'streaming' | 'ready' | 'error'

export type AIAnalysisEvent =
  | { type: 'task_type'; taskType: TaskType }
  | { type: 'hint'; hint: Hint }
  | { type: 'solution_step'; step: SolutionStep }
  | { type: 'status'; message: string }
  | { type: 'done' }
  | { type: 'error'; message: string }
