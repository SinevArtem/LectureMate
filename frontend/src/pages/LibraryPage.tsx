import { Library } from 'lucide-react'

export function LibraryPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-24 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/15">
        <Library className="h-7 w-7 text-accent" />
      </div>
      <h1 className="mt-6 text-2xl font-semibold">Библиотека задач</h1>
      <p className="mt-2 max-w-md text-muted">
        Скоро здесь появятся типовые задания ОГЭ по номерам.
      </p>
    </div>
  )
}