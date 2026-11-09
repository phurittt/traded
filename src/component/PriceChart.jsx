import { useMemo, useState } from 'react'
import { fmtChartTime, fmtNative, fmtPct, fmtSigned, fmtTHB, fxOf } from '../lib/format'
import { buildSeries, RANGES } from '../lib/market'
import { useStore } from '../store/context'

const W = 800
const H = 300

export default function PriceChart({ stock, price }) {
  const { now } = useStore()
  const [range, setRange] = useState('1D')
  const [hover, setHover] = useState(null)

  const series = useMemo(
    () => buildSeries(stock.symbol, range, price, stock.prevClose, now),
    [stock, range, price, now],
  )

  const values = series.map((d) => d.p)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const pad = (max - min) * 0.1 || max * 0.01
  const lo = min - pad
  const hi = max + pad
  const last = series.length - 1
  const x = (i) => (i / last) * W
  const y = (p) => H - ((p - lo) / (hi - lo)) * H
  const line = series.map((d, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(d.p).toFixed(1)}`).join('')

  const index = hover ?? last
  const active = series[index]
  const base = series[0].p
  const delta = active.p - base
  const pct = (delta / base) * 100
  const up = delta >= 0

  const scrub = (e) => {
    const box = e.currentTarget.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (e.clientX - box.left) / box.width))
    setHover(Math.round(ratio * last))
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') setHover(Math.max(0, index - 1))
    else if (e.key === 'ArrowRight') setHover(Math.min(last, index + 1))
    else if (e.key === 'Escape') setHover(null)
  }

  return (
    <div>
      <p className="text-3xl font-semibold tabular-nums sm:text-4xl">{fmtNative(active.p, stock)}</p>
      <p className="mt-1 flex flex-wrap items-center gap-x-2 text-sm tabular-nums">
        <span className={`font-medium ${up ? 'text-up' : 'text-down'}`}>
          <span aria-hidden="true" className="text-[0.7em]">
            {up ? '▲ ' : '▼ '}
          </span>
          {fmtSigned(delta)} ({fmtPct(pct)})
        </span>
        <span className="text-muted">
          {hover === null ? `ช่วง ${range}` : fmtChartTime(active.t, range)}
          {stock.market === 'US' && ` · ≈ ${fmtTHB(active.p * fxOf(stock))}`}
        </span>
      </p>

      <div
        role="img"
        tabIndex={0}
        aria-label={`กราฟราคา ${stock.symbol} ช่วง ${range} ใช้ปุ่มลูกศรซ้ายขวาเพื่อดูราคาแต่ละจุด`}
        className="relative mt-4 h-52 touch-pan-y select-none sm:h-72"
        onPointerMove={scrub}
        onPointerDown={scrub}
        onPointerLeave={() => setHover(null)}
        onKeyDown={onKeyDown}
        onBlur={() => setHover(null)}
      >
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="size-full" aria-hidden="true">
          <defs>
            <linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="var(--color-brand-400)" stopOpacity="0.75" />
              <stop offset="1" stopColor="var(--color-brand-400)" stopOpacity="0.04" />
            </linearGradient>
          </defs>
          <path d={`${line}L${W} ${H}L0 ${H}Z`} fill="url(#chart-fill)" />
          {range === '1D' && (
            <line
              x1="0"
              x2={W}
              y1={y(base)}
              y2={y(base)}
              stroke="var(--color-muted)"
              strokeDasharray="3 5"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          )}
          <path
            d={line}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth="2"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        {hover !== null && (
          <span
            className="pointer-events-none absolute inset-y-0 w-px bg-ink/30"
            style={{ left: `${(index / last) * 100}%` }}
          />
        )}
        <span
          className="pointer-events-none absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink ring-2 ring-white"
          style={{ left: `${(index / last) * 100}%`, top: `${(y(active.p) / H) * 100}%` }}
        />
      </div>

      <div role="group" aria-label="ช่วงเวลาของกราฟ" className="mt-3 flex justify-between gap-1">
        {Object.keys(RANGES).map((r) => (
          <button
            key={r}
            type="button"
            aria-pressed={range === r}
            onClick={() => {
              setRange(r)
              setHover(null)
            }}
            className={`flex-1 rounded-full py-1.5 text-sm font-medium transition-colors sm:flex-none sm:px-4 ${
              range === r ? 'bg-brand-400 text-ink' : 'text-muted hover:bg-brand-50 hover:text-ink'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <dl className="mt-3 flex gap-6 text-sm">
        <div className="flex gap-1.5">
          <dt className="text-muted">สูงสุดช่วงนี้</dt>
          <dd className="font-medium tabular-nums">{fmtNative(max, stock)}</dd>
        </div>
        <div className="flex gap-1.5">
          <dt className="text-muted">ต่ำสุดช่วงนี้</dt>
          <dd className="font-medium tabular-nums">{fmtNative(min, stock)}</dd>
        </div>
      </dl>
    </div>
  )
}
