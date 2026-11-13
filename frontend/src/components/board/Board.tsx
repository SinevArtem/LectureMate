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
          const emit = () => {
            revision += 1
            const document = editor.store.serialize('document')
            onSnapshotChange?.({ revision, document, shapeCount: Object.keys(document).length, capturedAt: Date.now() })
          }
          emit()
          return editor.store.listen(emit, { scope: 'document' })
        }}
      />
    </div>
  )
}
