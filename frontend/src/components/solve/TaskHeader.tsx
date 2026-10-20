import {
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Lightbulb,
  Maximize2,
} from 'lucide-react'
import type { Task } from '../../data/tasks'
import { difficultyLabel } from '../../data/tasks'
import { cn } from '../../lib/utils'
import { useFullscreen } from '../../context/FullscreenContext'

interface TaskHeaderProps {
  task: Task
  onNext: () => void
  onEasier: () => void
  onHarder: () => void
  onHint: () => void
}

const difficultyStyle = {
  easy: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  medium: 'bg-accent/15 text-accent border-accent/30',
  hard: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
} as const

export function TaskHeader({
  task,
  onNext,
  onEasier,
  onHarder,
  onHint,
}: TaskHeaderProps) {
  const { enter } = useFullscreen()

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-md bg-surface-2 px-2 py-1 font-medium text-text">
          {task.code}
        </span>
        <span className="text-muted">{task.title}</span>
        <span
          className={cn(
            'ml-auto rounded-md border px-2 py-1 font-medium',
            difficultyStyle[task.difficulty],
          )}
        >
          {difficultyLabel[task.difficulty]}
        </span>
      </div>

      <p className="text-base leading-relaxed text-text">{task.statement}</p>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={onNext}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm text-text transition hover:border-accent/50"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Другая задача
        </button>

        <button
          onClick={onEasier}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm text-text transition hover:border-emerald-500/50"
        >
          <TrendingDown className="h-3.5 w-3.5" />
          Легче
        </button>

        <button
          onClick={onHarder}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm text-text transition hover:border-rose-500/50"
        >
          <TrendingUp className="h-3.5 w-3.5" />
          Сложнее
        </button>

        <button
          onClick={onHint}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-accent/15 px-3 py-1.5 text-sm font-medium text-accent transition hover:bg-accent/25"
        >
          <Lightbulb className="h-3.5 w-3.5" />
          Подсказка
        </button>

        <button
          onClick={enter}
          title="Развернуть доску на весь экран"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm text-text transition hover:border-accent/50"
        >
          <Maximize2 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Развернуть</span>
        </button>
      </div>
    </div>
  )
}