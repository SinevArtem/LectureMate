import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'

export function Board() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-border bg-white">
      <Tldraw />
    </div>
  )
}