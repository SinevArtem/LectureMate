import { motion } from 'framer-motion'
import { AlertTriangle, Info, XCircle } from 'lucide-react'
import type { Hint } from '../../types/ai'
import { cn } from '../../lib/utils'

const styles = {
  info: {
    icon: Info,
    cls: 'border-sky-500/30 bg-sky-500/10 text-sky-200',
  },
  warning: {
    icon: AlertTriangle,
    cls: 'border-accent/30 bg-accent/10 text-accent',
  },
  error: {
    icon: XCircle,
    cls: 'border-rose-500/30 bg-rose-500/10 text-rose-200',
  },
} as const

export function HintCard({ hint }: { hint: Hint }) {
  const { icon: Icon, cls } = styles[hint.severity]
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className={cn('rounded-xl border p-3 text-sm', cls)}
    >
      <div className="flex items-start gap-2.5">
        <Icon className="mt-0.5 h-4 w-4 shrink-0" />
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-wide opacity-70">
            Строка {hint.lineIndex + 1}
          </div>
          <div className="mt-0.5 leading-snug text-text">{hint.text}</div>
        </div>
      </div>
    </motion.div>
  )
}