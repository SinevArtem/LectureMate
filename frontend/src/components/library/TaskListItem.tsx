import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { Task } from '../../data/tasks'
import { difficultyLabel } from '../../data/tasks'
import { cn } from '../../lib/utils'

const difficultyStyle = {
  easy: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  medium: 'bg-accent/15 text-accent border-accent/30',
  hard: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
} as const

export function TaskListItem({ task }: { task: Task }) {
  return (
    <Link
      to={`/solve?task=${task.id}`}
      className="group block rounded-2xl border border-border bg-surface p-4 transition hover:-translate-y-0.5 hover:border-accent/50"
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-md bg-surface-2 px-2 py-0.5 text-muted">
              {task.code}
            </span>
            <span
              className={cn(
                'rounded-md border px-2 py-0.5 font-medium',
                difficultyStyle[task.difficulty],
              )}
            >
              {difficultyLabel[task.difficulty]}
            </span>
          </div>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-text">
            {task.statement}
          </p>
        </div>

        <div className="mt-1 flex items-center gap-1 text-sm text-muted transition group-hover:text-accent">
          <span className="hidden sm:inline">Решать</span>
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  )
}