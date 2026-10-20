import { Link } from 'react-router-dom'
import {
  PencilLine,
  Library,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Target,
  Clock,
} from 'lucide-react'
import { Card } from '../components/ui/Card'

const quickActions = [
  {
    to: '/solve',
    icon: PencilLine,
    title: 'Новая задача',
    desc: 'Открыть доску и начать решать',
    accent: true,
  },
  {
    to: '/library',
    icon: Library,
    title: 'Библиотека задач',
    desc: 'Типовые задания ОГЭ',
  },
  {
    to: '/solve',
    icon: Sparkles,
    title: 'Разбор с ИИ',
    desc: 'Пошаговое решение с комментариями',
  },
]

const stats = [
  { icon: Target, label: 'Решено задач', value: '0' },
  { icon: TrendingUp, label: 'Правильно', value: '0%' },
  { icon: Clock, label: 'Время за неделю', value: '0 ч' },
]

export function Dashboard() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {/* Приветствие */}
      <section>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          Подготовка к ОГЭ по математике
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          Привет 👋
        </h1>
        <p className="mt-2 max-w-xl text-muted">
          Решай задачи от руки прямо на доске — ИИ в реальном времени подскажет,
          где ты ошибся, и объяснит каждый шаг.
        </p>
      </section>

      {/* Быстрые действия */}
      <section className="mt-10">
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted">
          Быстрый старт
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {quickActions.map(({ to, icon: Icon, title, desc, accent }) => (
            <Link key={title} to={to} className="group">
              <Card
                className={[
                  'h-full group-hover:-translate-y-0.5 group-hover:border-accent/60',
                  accent
                    ? 'border-accent/40 bg-gradient-to-br from-accent/15 to-surface'
                    : '',
                ].join(' ')}
              >
                <Icon
                  className={[
                    'h-6 w-6',
                    accent ? 'text-accent' : 'text-muted group-hover:text-text',
                  ].join(' ')}
                />
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-medium text-text">{title}</span>
                  <ArrowRight className="h-4 w-4 text-muted transition group-hover:translate-x-0.5 group-hover:text-accent" />
                </div>
                <p className="mt-1 text-sm text-muted">{desc}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Статистика */}
      <section className="mt-10">
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted">
          Прогресс
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map(({ icon: Icon, label, value }) => (
            <Card key={label} className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-2">
                <Icon className="h-5 w-5 text-accent" />
              </div>
              <div>
                <div className="text-xl font-semibold text-text">{value}</div>
                <div className="text-xs text-muted">{label}</div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Нижний блок */}
      <section className="mt-10">
        <Card className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-medium text-text">Пока нет решённых задач</h3>
            <p className="mt-1 text-sm text-muted">
              Начни с первой задачи — ИИ определит её тип и поможет не сбиться.
            </p>
          </div>
          <Link
            to="/solve"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-bg transition hover:bg-accent-2"
          >
            <PencilLine className="h-4 w-4" />
            Начать решать
          </Link>
        </Card>
      </section>
    </div>
  )
}