import { useCallback, useState } from 'react'
import { Board } from '../components/board/Board'
import { AIPanel } from '../components/ai-panel/AIPanel'
import { TaskHeader } from '../components/solve/TaskHeader'
import { useAIAnalysis } from '../hooks/useAIAnalysis'
import {
  getRandomTask,
  getTaskByDifficulty,
  tasks,
  type Difficulty,
  type Task,
} from '../data/tasks'

const DIFFICULTY_ORDER: Difficulty[] = ['easy', 'medium', 'hard']

export function SolvePage() {
  const [task, setTask] = useState<Task>(() => tasks[0])
  const { hints, taskType, isAnalyzing, clearHints, pushHint } =
    useAIAnalysis(true)
  const [solveAllOpen, setSolveAllOpen] = useState(false)

  // «Другая задача» — случайная, кроме текущей
  const handleNext = useCallback(() => {
    setTask((prev) => getRandomTask(prev.id))
    clearHints()
  }, [clearHints])

  // «Легче» / «Сложнее»
  const handleDifficulty = useCallback(
    (direction: 'up' | 'down') => {
      setTask((prev) => {
        const idx = DIFFICULTY_ORDER.indexOf(prev.difficulty)
        const nextIdx = Math.min(
          Math.max(idx + (direction === 'up' ? 1 : -1), 0),
          DIFFICULTY_ORDER.length - 1,
        )
        return getTaskByDifficulty(DIFFICULTY_ORDER[nextIdx], prev.id)
      })
      clearHints()
    },
    [clearHints],
  )

  // «Подсказка» — вручную добавить подсказку
  const handleHint = useCallback(() => {
    pushHint({
      id: crypto.randomUUID(),
      lineIndex: 0,
      severity: 'info',
      text: 'Попробуйте выразить коэффициенты a, b, c и посчитать дискриминант D = b² − 4ac.',
      createdAt: Date.now(),
    })
  }, [pushHint])

  return (
    <div className="mx-auto flex h-[calc(100vh-56px)] max-w-[1600px] flex-col gap-3 p-3">
      {/* Условие задачи */}
      <TaskHeader
        task={task}
        onNext={handleNext}
        onEasier={() => handleDifficulty('down')}
        onHarder={() => handleDifficulty('up')}
        onHint={handleHint}
      />

      {/* Доска + панель ИИ */}
      <div className="flex min-h-0 flex-1 flex-col gap-3 md:flex-row">
        <div className="min-h-0 flex-1">
          <Board />
        </div>
        <div className="h-[340px] shrink-0 md:h-auto">
          <AIPanel
            taskType={taskType}
            hints={hints}
            isAnalyzing={isAnalyzing}
            onSolveAll={() => setSolveAllOpen(true)}
            onClear={clearHints}
          />
        </div>
      </div>

      {/* Заглушка модалки */}
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