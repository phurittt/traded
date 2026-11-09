import { fmtNumber, fmtTHB } from '../lib/format'
import { Masked } from './ui'

const COLORS = { us: '#4C58C4', th: '#D19A00', cash: '#00A08A' }

export default function AllocationBar({ us, th, cash }) {
  const total = us + th + cash || 1
  const parts = [
    { key: 'us', label: 'หุ้นสหรัฐ', value: us },
    { key: 'th', label: 'หุ้นไทย', value: th },
    { key: 'cash', label: 'เงินสด', value: cash },
  ].map((p) => ({ ...p, pct: (p.value / total) * 100 }))

  return (
    <div>
      <div className="flex h-3 gap-0.5" aria-hidden="true">
        {parts
          .filter((p) => p.value > 0)
          .map((p) => (
            <span
              key={p.key}
              title={`${p.label} ${fmtNumber(p.pct)}%`}
              className="min-w-1 rounded"
              style={{ width: `${p.pct}%`, backgroundColor: COLORS[p.key] }}
            />
          ))}
      </div>
      <ul className="mt-4 space-y-2.5">
        {parts.map((p) => (
          <li key={p.key} className="flex items-center gap-2.5 text-sm">
            <span className="size-3 rounded-sm" style={{ backgroundColor: COLORS[p.key] }} aria-hidden="true" />
            <span className="flex-1 text-muted">{p.label}</span>
            <span className="w-16 text-right font-medium tabular-nums">{fmtNumber(p.pct)}%</span>
            <span className="w-28 text-right tabular-nums">
              <Masked>{fmtTHB(p.value)}</Masked>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
