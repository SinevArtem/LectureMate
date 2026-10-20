import { motion } from 'framer-motion'
import { Brain } from 'lucide-react'
import type { TaskType } from '../../types/ai'

export function TaskTypeBadge({ taskType }: { taskType: TaskType }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-accent/30 bg-accent/10 p-3"
    >
      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-accent">
        <Brain className="h-3.5 w-3.5" />
        {taskType.code}
        <span className="ml-auto text-[11px] text-accent/70">
          {Math.round(taskType.confidence * 100)}%
        </span>
      </div>
      <div className="mt-1.5 font-medium text-text">{taskType.title}</div>
    </motion.div>
  )
}