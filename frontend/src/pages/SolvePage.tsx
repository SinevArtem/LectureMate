import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Minimize2 } from 'lucide-react'
import { Board } from '../components/board/Board'
import { AIPanel } from '../components/ai-panel/AIPanel'
import { TaskHeader } from '../components/solve/TaskHeader'
import { useAIAnalysis } from '../hooks/useAIAnalysis'
import { useFullscreen } from '../context/FullscreenContext'
import {
  getRandomTask,
  getTaskByDifficulty,
  getTaskById,
  allTasks,
  type Difficulty,
  type Task,
} from '../data/tasks'

const DIFFICULTY_ORDER: Difficulty[] = ['easy', 'medium', 'hard']

export function SolvePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { isFullscreen, exit } = useFullscreen()
  const taskFromUrl = getTaskById(searchParams.get('task') ?? '')

  const [task, setTask] = useState<Task>(taskFromUrl ?? allTasks[0])
  const { hints, taskType, isAnalyzing, clearHints, pushHint } =
    useAIAnalysis(true)
  const [solveAllOpen, setSolveAllOpen] = useState(false)

  // Esc — выход из фуллскрина
  useEffect(() => {
    if (!isFullscreen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') exit()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isFullscreen, exit])

  useEffect(() => {
    const t = getTaskById(searchParams.get('task') ?? '')
    if (t) setTask(t)
  }, [searchParams])

  const setTaskAndReset = (next: Task) => {
    setTask(next)
    setSearchParams({ task: next.id })
    clearHints()
  }

  const handleNext = useCallback(() => {
    setTaskAndReset(getRandomTask(task.id))
  }, [task.id])

  const handleDifficulty = useCallback(
    (direction: 'up' | 'down') => {
      const idx = DIFFICULTY_ORDER.indexOf(task.difficulty)
      const nextIdx = Math.min(
        Math.max(idx + (direction === 'up' ? 1 : -1), 0),
        DIFFICULTY_ORDER.length - 1,
      )
      setTaskAndReset(getTaskByDifficulty(DIFFICULTY_ORDER[nextIdx], task.id))
    },
    [task.difficulty, task.id],
  )

  const handleHint = useCallback(() => {
    pushHint({
      id: crypto.randomUUID(),
      lineIndex: 0,
      severity: 'info',
      text: 'Попробуйте выразить коэффициенты a, b, c и посчитать дискриминант D = b² − 4ac.',
      createdAt: Date.now(),
    })
  }, [pushHint])

  // ⬇️ ВАЖНО: ОДНО дерево, классы меняются через isFullscreen
  return (
    <div
      className={
        isFullscreen
          ? 'fixed inset-0 z-50 flex flex-col bg-bg p-2'
          : 'mx-auto flex h-[calc(100vh-56px)] max-w-[1600px] flex-col gap-3 p-3'
      }
    >
      {/* Верхняя панель: полная шапка или компактная плашка */}
      {isFullscreen ? (
        <div className="mb-2 flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-2">
          <span className="rounded-md bg-surface-2 px-2 py-0.5 text-xs text-muted">
            {task.code}
          </span>
          <p className="line-clamp-1 flex-1 text-sm text-text">
            {task.statement}
          </p>
          <button
            onClick={exit}
            title="Свернуть (Esc)"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm text-text transition hover:border-accent/50"
          >
            <Minimize2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Свернуть</span>
          </button>
        </div>
      ) : (
        <TaskHeader
          task={task}
          onNext={handleNext}
          onEasier={() => handleDifficulty('down')}
          onHarder={() => handleDifficulty('up')}
          onHint={handleHint}
        />
      )}

      {/* Нижний блок: доска + панель ИИ (доска ВСЕГДА смонтирована) */}
      <div
        className={
          isFullscreen
            ? 'flex min-h-0 flex-1'
            : 'flex min-h-0 flex-1 flex-col gap-3 md:flex-row'
        }
      >
        <div className="min-h-0 flex-1">
          <Board />
        </div>

        {/* Панель ИИ: в фуллскрине скрыта через CSS, но остаётся в дереве */}
        <div
          className={
            isFullscreen
              ? 'hidden'
              : 'h-[340px] shrink-0 md:h-auto'
          }
        >
          <AIPanel
            taskType={taskType}
            hints={hints}
            isAnalyzing={isAnalyzing}
            onSolveAll={() => setSolveAllOpen(true)}
            onClear={clearHints}
          />
        </div>
      </div>

      {solveAllOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setSolveAllOpen(false)}
        >
          <div
            className="max-w-md rounded-2xl border border-border bg-surface p-6 text-text"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold">Решение всей задачи</h3>
            <p className="mt-2 text-sm text-muted">
              Модалка с пошаговым решением и KaTeX-формулами появится здесь
              следующим шагом.
            </p>
            <button
              onClick={() => setSolveAllOpen(false)}
              className="mt-4 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-bg hover:bg-accent-2"
            >
              Понятно
            </button>
          </div>
        </div>
      )}
    </div>
  )
}