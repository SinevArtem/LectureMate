export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Task {
  id: string
  /** "ОГЭ №21" */
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

/** Мета по каждому номеру задания ОГЭ (для вкладок) */
export interface TaskCategory {
  number: number
  title: string
  shortTitle: string
  description: string
  tasks: Task[]
}

/* ----------------------- ЗАДАЧИ ----------------------- */

const task1: Task[] = [
  {
    id: 't1-1',
    code: 'ОГЭ №1',
    title: 'Числа и вычисления',
    statement: 'Найдите значение выражения: 3,7 · 4,2 − 8,1 : 3',
    difficulty: 'easy',
  },
  {
    id: 't1-2',
    code: 'ОГЭ №1',
    title: 'Числа и вычисления',
    statement: 'Найдите значение выражения: (2/3 + 5/6) · 12',
    difficulty: 'easy',
  },
  {
    id: 't1-3',
    code: 'ОГЭ №1',
    title: 'Числа и вычисления',
    statement: 'Найдите значение выражения: (−0,5)² · 8 − 3 · (−0,5)',
    difficulty: 'medium',
  },
  {
    id: 't1-4',
    code: 'ОГЭ №1',
    title: 'Числа и вычисления',
    statement: 'Найдите значение выражения: (√17 − 5)(√17 + 5)',
    difficulty: 'hard',
  },
]

const task5: Task[] = [
  {
    id: 't5-1',
    code: 'ОГЭ №5',
    title: 'Уравнения',
    statement: 'Решите уравнение: 5x − 8 = 2x + 7',
    difficulty: 'easy',
  },
  {
    id: 't5-2',
    code: 'ОГЭ №5',
    title: 'Уравнения',
    statement: 'Решите уравнение: 3(x − 2) = 5x + 4',
    difficulty: 'medium',
  },
  {
    id: 't5-3',
    code: 'ОГЭ №5',
    title: 'Уравнения',
    statement: 'Решите уравнение: (x − 3)/(x + 4) = 2',
    difficulty: 'hard',
  },
]

const task6: Task[] = [
  {
    id: 't6-1',
    code: 'ОГЭ №6',
    title: 'Координатная прямая',
    statement:
      'На координатной прямой отмечены точки A, B, C, D. Установите соответствие между точками и числами: −1,5; 2,3; −2,8; 0,4.',
    difficulty: 'medium',
  },
  {
    id: 't6-2',
    code: 'ОГЭ №6',
    title: 'Координатная прямая',
    statement:
      'Известно, что a > b > 0. Выберите верное утверждение: 1) a − b < 0  2) a/b < 1  3) b − a < 0  4) ab < 0.',
    difficulty: 'hard',
  },
]

const task20: Task[] = [
  {
    id: 't20-1',
    code: 'ОГЭ №20',
    title: 'Неравенства',
    statement: 'Решите неравенство: (x − 3)(x + 5) < 0',
    difficulty: 'easy',
  },
  {
    id: 't20-2',
    code: 'ОГЭ №20',
    title: 'Неравенства',
    statement: 'Решите неравенство: x² − 4x + 3 ≥ 0',
    difficulty: 'medium',
  },
  {
    id: 't20-3',
    code: 'ОГЭ №20',
    title: 'Неравенства',
    statement: 'Решите неравенство: (x − 1)/(x + 2) > 0',
    difficulty: 'hard',
  },
]

const task21: Task[] = [
  {
    id: 't21-1',
    code: 'ОГЭ №21',
    title: 'Квадратные уравнения',
    statement: 'Решите уравнение: x² − 5x + 6 = 0',
    difficulty: 'easy',
  },
  {
    id: 't21-2',
    code: 'ОГЭ №21',
    title: 'Квадратные уравнения',
    statement: 'Решите уравнение: 2x² − 7x + 3 = 0',
    difficulty: 'medium',
  },
  {
    id: 't21-3',
    code: 'ОГЭ №21',
    title: 'Квадратные уравнения',
    statement: 'Решите уравнение: 3x² + 10x − 8 = 0',
    difficulty: 'hard',
  },
  {
    id: 't21-4',
    code: 'ОГЭ №21',
    title: 'Квадратные уравнения',
    statement: 'Решите уравнение: x² + 6x + 9 = 0',
    difficulty: 'easy',
  },
]

const task22: Task[] = [
  {
    id: 't22-1',
    code: 'ОГЭ №22',
    title: 'Текстовые задачи',
    statement:
      'Две трубы наполняют бассейн за 6 часов. Первая труба заполняет его на 5 часов быстрее второй. За сколько часов наполнит бассейн каждая труба?',
    difficulty: 'hard',
  },
  {
    id: 't22-2',
    code: 'ОГЭ №22',
    title: 'Текстовые задачи',
    statement:
      'Катер проплыл 30 км по течению реки и вернулся обратно, затратив на весь путь 5 часов. Найдите скорость катера в стоячей воде, если скорость течения 2 км/ч.',
    difficulty: 'medium',
  },
]

/* ----------------------- КАТЕГОРИИ ----------------------- */

export const categories: TaskCategory[] = [
  {
    number: 1,
    title: 'Числа и вычисления',
    shortTitle: 'Числа',
    description: 'Действия с дробями, корнями, степенями',
    tasks: task1,
  },
  {
    number: 5,
    title: 'Уравнения',
    shortTitle: 'Уравнения',
    description: 'Линейные и рациональные уравнения',
    tasks: task5,
  },
  {
    number: 6,
    title: 'Координатная прямая',
    shortTitle: 'Координаты',
    description: 'Сравнение чисел, изображение на прямой',
    tasks: task6,
  },
  {
    number: 20,
    title: 'Неравенства',
    shortTitle: 'Неравенства',
    description: 'Линейные и квадратные неравенства',
    tasks: task20,
  },
  {
    number: 21,
    title: 'Квадратные уравнения',
    shortTitle: 'Квадр. ур.',
    description: 'Решение уравнений второй степени',
    tasks: task21,
  },
  {
    number: 22,
    title: 'Текстовые задачи',
    shortTitle: 'Текстовые',
    description: 'Задачи на движение и работу',
    tasks: task22,
  },
]

/* ----------------------- УТИЛИТЫ ----------------------- */

export const allTasks: Task[] = categories.flatMap((c) => c.tasks)

export function getTaskById(id: string): Task | undefined {
  return allTasks.find((t) => t.id === id)
}

export function getRandomTask(exclude?: string): Task {
  const pool = exclude ? allTasks.filter((t) => t.id !== exclude) : allTasks
  return pool[Math.floor(Math.random() * pool.length)]
}

export function getTaskByDifficulty(
  difficulty: Difficulty,
  exclude?: string,
): Task {
  const pool = allTasks.filter(
    (t) => t.difficulty === difficulty && t.id !== exclude,
  )
  const fallback = allTasks.filter((t) => t.id !== exclude)
  const source = pool.length > 0 ? pool : fallback
  return source[Math.floor(Math.random() * source.length)]
}