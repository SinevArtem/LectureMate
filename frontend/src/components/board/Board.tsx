import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'
import type { BoardSnapshot } from '../../types/ai'

interface BoardProps {
  onSnapshotChange?: (snapshot: BoardSnapshot) => void
}

export function Board({ onSnapshotChange }: BoardProps) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-border bg-white">
      <Tldraw
        onMount={(editor) => {
          let revision = 0
          let timer: number | undefined
          const emit = () => {
            revision += 1
            const document = editor.store.serialize('document')
            const records = Object.values(document as Record<string, unknown>)
            const textContent = records.flatMap((record) => {
              if (!record || typeof record !== 'object') return []
              const props = (record as { props?: { text?: unknown } }).props
              return typeof props?.text === 'string' && props.text.trim() ? [props.text.trim()] : []
            })
            void editor.toImage(editor.getCurrentPageShapes(), { format: 'png', background: true }).then(async ({ blob }) => {
              const imageDataUrl = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader()
                reader.onload = () => resolve(String(reader.result))
                reader.onerror = () => reject(reader.error)
                reader.readAsDataURL(blob)
              })
              onSnapshotChange?.({ revision, document, shapeCount: records.length, textContent, imageDataUrl, capturedAt: Date.now() })
            }).catch(() => onSnapshotChange?.({ revision, document, shapeCount: records.length, textContent, capturedAt: Date.now() }))
          }
          const schedule = () => { window.clearTimeout(timer); timer = window.setTimeout(emit, 900) }
          schedule()
          const unsubscribe = editor.store.listen(schedule, { scope: 'document' })
          return () => { window.clearTimeout(timer); unsubscribe() }
        }}
      />
    </div>
  )
}
