import { useCallback, useEffect, useRef, useState } from 'react'
import type { Task } from '../data/tasks'
import { createAIProvider, type AIAnalysisRequest } from '../services/ai'
import type { AIAnalysisStatus, BoardSnapshot, Hint, SolutionStep, TaskType } from '../types/ai'

export function useAIAnalysis(task: Task, board: BoardSnapshot | null, enabled = true) {
  const provider = useRef(createAIProvider())
  const controller = useRef<AbortController | null>(null)
  const lastMode = useRef<AIAnalysisRequest['mode']>('hint')
  const [hints, setHints] = useState<Hint[]>([])
  const [taskType, setTaskType] = useState<TaskType | null>(null)
  const [solution, setSolution] = useState<SolutionStep[]>([])
  const [status, setStatus] = useState<AIAnalysisStatus>('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const [error, setError] = useState<string | null>(null)

  const reset = useCallback(() => {
    controller.current?.abort()
    setHints([]); setSolution([]); setTaskType(null); setError(null); setStatus('idle'); setStatusMessage('')
  }, [])

  const run = useCallback(async (mode: AIAnalysisRequest['mode']) => {
    lastMode.current = mode
    controller.current?.abort()
    const nextController = new AbortController()
    controller.current = nextController
    setStatus('connecting'); setError(null)
    try {
      const request: AIAnalysisRequest = { task, board, mode }
      for await (const event of provider.current.analyze(request, nextController.signal)) {
        if (event.type === 'task_type') setTaskType(event.taskType)
        if (event.type === 'hint') setHints((current) => [...current, event.hint])
        if (event.type === 'solution_step') setSolution((current) => [...current, event.step])
        if (event.type === 'status') setStatusMessage(event.message)
        if (event.type === 'done') setStatus('ready')
        if (event.type === 'error') { setError(event.message); setStatus('error') }
        if (event.type !== 'done') setStatus('streaming')
      }
    } catch (cause) {
      if ((cause as Error).name === 'AbortError') return
      setError(cause instanceof Error ? cause.message : 'Не удалось получить ответ помощника')
      setStatus('error')
    }
  }, [board, task])

  useEffect(() => {
    if (!enabled) return
    const timer = window.setTimeout(() => void run('hint'), board ? 700 : 0)
    return () => window.clearTimeout(timer)
  }, [enabled, task.id, board, board?.revision, run])

  useEffect(() => () => controller.current?.abort(), [])

  const retry = useCallback(() => run(lastMode.current), [run])

  return { hints, taskType, solution, status, statusMessage, error, reset, retry, requestSolution: () => run('solution') }
}
