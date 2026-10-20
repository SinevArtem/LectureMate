import { useState, useMemo } from 'react'
import { BookOpen, Search, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { categories } from '../data/tasks'
import { CategoryTabs } from '../components/library/CategoryTabs'
import { TaskListItem } from '../components/library/TaskListItem'

export function LibraryPage() {
  const [activeNumber, setActiveNumber] = useState(categories[0].number)
  const [query, setQuery] = useState('')

  const activeCategory = useMemo(
    () => categories.find((c) => c.number === activeNumber)!,
    [activeNumber],
  )

  const filteredTasks = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return activeCategory.tasks
    return activeCategory.tasks.filter((t) =>
      t.statement.toLowerCase().includes(q),
    )
  }, [activeCategory, query])

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      {/* Заголовок */}
      <section className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/15">
          <BookOpen className="h-6 w-6 text-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Библиотека задач ОГЭ
          </h1>
          <p className="mt-1 text-muted">
            Выберите номер задания и тренируйтесь на задачах из банка ФИПИ.
          </p>
        </div>
      </section>

      {/* Вкладки по номерам */}
      <section className="mt-8">
        <CategoryTabs
          categories={categories}
          active={activeNumber}
          onChange={(n) => {
            setActiveNumber(n)
            setQuery('')
          }}
        />
      </section>

      {/* Описание активной категории + поиск */}
      <section className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-medium">
            Задание №{activeCategory.number} — {activeCategory.title}
          </h2>
          <p className="text-sm text-muted">{activeCategory.description}</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по условию…"
            className="w-full rounded-xl border border-border bg-surface py-2 pl-9 pr-9 text-sm text-text outline-none transition focus:border-accent/60"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted hover:text-text"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </section>

      {/* Список задач */}
      <section className="mt-4 space-y-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeNumber}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {filteredTasks.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted">
                {query
                  ? 'По вашему запросу ничего не найдено.'
                  : 'В этом разделе пока нет задач.'}
              </div>
            ) : (
              filteredTasks.map((task) => (
                <TaskListItem key={task.id} task={task} />
              ))
            )}
          </motion.div>
        </AnimatePresence>

        {filteredTasks.length > 0 && (
          <div className="pt-2 text-center text-xs text-muted">
            Показано {filteredTasks.length} из {activeCategory.tasks.length}
          </div>
        )}
      </section>
    </div>
  )
}