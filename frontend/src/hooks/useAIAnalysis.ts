import { useEffect, useState, useCallback } from 'react'
import type { Hint, TaskType } from '../types/ai'

export function useAIAnalysis(active: boolean) {
  const [hints, setHints] = useState<Hint[]>([])
  const [taskType, setTaskType] = useState<TaskType | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    if (!active) return

    setIsAnalyzing(true)

    const t1 = setTimeout(() => {
      setTaskType({
        code: 'ОГЭ №21',
        title: 'Квадратные уравнения',
        confidence: 0.94,
      })
      setIsAnalyzing(false)
    }, 1200)

    const t2 = setTimeout(() => {
      setHints((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          lineIndex: 1,
          severity: 'warning',
          text: 'Проверьте знак при переносе слагаемого через знак «=».',
          createdAt: Date.now(),
        },
      ])
    }, 5000)

    const t3 = setTimeout(() => {
      setHints((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          lineIndex: 2,
          severity: 'error',
          text: 'Дискриминант посчитан неверно: b² − 4ac, у вас c взято с минусом.',
          createdAt: Date.now(),
        },
      ])
    }, 9000)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [active])

  const clearHints = useCallback(() => {
    setHints([])
    setTaskType(null)
  }, [])

  const pushHint = useCallback((hint: Hint) => {
    setHints((prev) => [...prev, hint])
  }, [])

  return { hints, taskType, isAnalyzing, clearHints, pushHint }
}