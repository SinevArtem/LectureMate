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