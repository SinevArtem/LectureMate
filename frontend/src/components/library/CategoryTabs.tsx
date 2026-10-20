import { motion } from 'framer-motion'
import type { TaskCategory } from '../../data/tasks'
import { cn } from '../../lib/utils'

interface CategoryTabsProps {
  categories: TaskCategory[]
  active: number
  onChange: (number: number) => void
}

export function CategoryTabs({ categories, active, onChange }: CategoryTabsProps) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1">
      {categories.map((cat) => {
        const isActive = cat.number === active
        return (
          <button
            key={cat.number}
            onClick={() => onChange(cat.number)}
            className={cn(
              'relative shrink-0 rounded-xl px-3.5 py-2 text-sm font-medium transition',
              isActive
                ? 'text-bg'
                : 'text-muted hover:bg-surface hover:text-text',
            )}
          >
            {isActive && (
              <motion.span
                layoutId="tab-bg"
                className="absolute inset-0 rounded-xl bg-accent"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">№{cat.number}</span>
          </button>
        )
      })}
    </div>
  )
}