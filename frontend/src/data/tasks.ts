export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Task {
  id: string
  /** Например, "ОГЭ №21" */
  code: string
  /** "Квадратные уравнения" */
  title: string
  /** Условие задачи */
  statement: string
  difficulty: Difficulty
}

export const difficultyLabel: Record<Difficulty, string> = {
  easy: 'Лёгкая',
  medium: 'Средняя',
  hard: 'Сложная',
}

export const tasks: Task[] = [
  {
    id: 't1',
    code: 'ОГЭ №21',
    title: 'Квадратные уравнения',
    statement: 'Решите уравнение: x² − 5x + 6 = 0',
    difficulty: 'easy',
  },
  {
    id: 't2',
    code: 'ОГЭ №21',
    title: 'Квадратные уравнения',
    statement: 'Решите уравнение: 2x² − 7x + 3 = 0',
    difficulty: 'medium',
  },
  {
    id: 't3',
    code: 'ОГЭ №21',
    title: 'Квадратные уравнения',
    statement: 'Решите уравнение: 3x² + 10x − 8 = 0',
    difficulty: 'hard',
  },
  {
    id: 't4',
    code: 'ОГЭ №20',
    title: 'Неравенства',
    statement: 'Решите неравенство: (x − 3)(x + 5) < 0',
    difficulty: 'easy',
  },
  {
    id: 't5',
    code: 'ОГЭ №20',
    title: 'Неравенства',
    statement: 'Решите неравенство: x² − 4x + 3 ≥ 0',
    difficulty: 'medium',
  },
  {
    id: 't6',
    code: 'ОГЭ №22',
    title: 'Текстовые задачи',
    statement:
      'Две трубы наполняют бассейн за 6 часов. Первая труба заполняет его на 5 часов быстрее второй. За сколько часов наполнит бассейн каждая труба?',
    difficulty: 'hard',
  },
]

export function getRandomTask(exclude?: string): Task {
  const pool = exclude ? tasks.filter((t) => t.id !== exclude) : tasks
  return pool[Math.floor(Math.random() * pool.length)]
}

export function getTaskByDifficulty(
  difficulty: Difficulty,
  exclude?: string,
): Task {
  const pool = tasks.filter((t) => t.difficulty === difficulty && t.id !== exclude)
  const fallback = tasks.filter((t) => t.id !== exclude)
  const source = pool.length > 0 ? pool : fallback
  return source[Math.floor(Math.random() * source.length)]
}