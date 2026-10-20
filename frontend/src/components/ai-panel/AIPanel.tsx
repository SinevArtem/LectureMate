import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles, Play, Loader2, Eraser } from 'lucide-react'
import type { Hint, TaskType } from '../../types/ai'
import { TaskTypeBadge } from './TaskTypeBadge'
import { HintCard } from './HintCard'

interface AIPanelProps {
  taskType: TaskType | null
  hints: Hint[]
  isAnalyzing: boolean
  onSolveAll: () => void
  onClear: () => void
}

export function AIPanel({
  taskType,
  hints,
  isAnalyzing,
  onSolveAll,
  onClear,
}: AIPanelProps) {
  return (
    <aside className="flex h-full w-full flex-col gap-3 rounded-2xl border border-border bg-surface p-3 md:w-[340px]">
      {/* Заголовок */}
      <div className="flex items-center gap-2 px-1">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/15">
          <Sparkles className="h-4 w-4 text-accent" />
        </div>
        <div className="text-sm font-medium text-text">ИИ-помощник</div>
        {isAnalyzing && (
          <Loader2 className="ml-auto h-4 w-4 animate-spin text-accent" />
        )}
      </div>

      {/* Тип задачи / пустое состояние */}
      <div className="shrink-0">
        {taskType ? (
          <TaskTypeBadge taskType={taskType} />
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-surface-2/60 p-3 text-sm text-muted">
            {isAnalyzing
              ? 'Распознаю условие задачи…'
              : 'Напишите условие задачи — определю её тип.'}
          </div>
        )}
      </div>

      {/* Лента подсказок */}
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
        <AnimatePresence mode="popLayout">
          {hints.map((h) => (
            <HintCard key={h.id} hint={h} />
          ))}
        </AnimatePresence>

        {hints.length === 0 && taskType && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl border border-dashed border-border p-3 text-sm text-muted"
          >
            Пока всё верно — продолжайте решать.
          </motion.div>
        )}
      </div>

      {/* Кнопки действий */}
      <div className="grid shrink-0 grid-cols-[1fr_auto] gap-2">
        <button
          onClick={onSolveAll}
          className="flex items-center justify-center gap-2 rounded-xl bg-accent px-3 py-2.5 text-sm font-semibold text-bg transition hover:bg-accent-2"
        >
          <Play className="h-4 w-4" />
          Решить всю задачу
        </button>
        <button
          onClick={onClear}
          title="Сбросить подсказки"
          className="flex items-center justify-center rounded-xl border border-border bg-surface-2 px-3 text-muted transition hover:text-text"
        >
          <Eraser className="h-4 w-4" />
        </button>
      </div>
    </aside>
  )
}