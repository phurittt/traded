import { useMemo } from 'react'
import { fmtNative, fmtPct } from '../lib/format'
import { buildSeries, changeOf } from '../lib/market'
import { useStore } from '../store/context'

export function Masked({ children }) {
  const { account } = useStore()
  return account.hidden ? <span aria-label="ซ่อนยอดอยู่">••••••</span> : children
}

export function StockLogo({ stock, size = 'size-11' }) {
  const tone = stock.market === 'US' ? 'bg-ink text-brand-400' : 'bg-brand-400 text-ink'
  return (
    <span
      className={`${size} ${tone} grid shrink-0 place-items-center rounded-full text-xs font-bold`}
      aria-hidden="true"
    >
      {stock.symbol.slice(0, 2)}
    </span>
  )
}

export function Change({ value, pill = false, className = '' }) {
  const up = value >= 0
  const tone = up ? 'text-up' : 'text-down'
  const bg = pill ? (up ? 'bg-up/10 px-2 py-0.5 rounded-full' : 'bg-down/10 px-2 py-0.5 rounded-full') : ''
  return (
    <span className={`${tone} ${bg} ${className} inline-flex items-center gap-1 tabular-nums font-medium`}>
      <span aria-hidden="true" className="text-[0.7em]">
        {up ? '▲' : '▼'}
      </span>
      {fmtPct(value)}
    </span>
  )
}

export function Sparkline({ stock, className = 'h-8 w-24' }) {
  const { prices } = useStore()
  const price = prices[stock.symbol]
  const d = useMemo(() => {
    const pts = buildSeries(stock.symbol, '1D', price, stock.prevClose)
      .filter((_, i) => i % 3 === 0)
      .map((x) => x.p)
    const min = Math.min(...pts)
    const span = Math.max(...pts) - min || 1
    return pts
      .map((p, i) => `${i ? 'L' : 'M'}${((i / (pts.length - 1)) * 100).toFixed(1)} ${(30 - ((p - min) / span) * 28).toFixed(1)}`)
      .join('')
  }, [stock, price])
  return (
    <svg viewBox="0 0 100 32" preserveAspectRatio="none" className={className} aria-hidden="true">
      <path
        d={d}
        fill="none"
        stroke={price >= stock.prevClose ? 'var(--color-up)' : 'var(--color-down)'}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function StockRow({ stock, compact = false }) {
  const { prices } = useStore()
  const price = prices[stock.symbol]
  return (
    <a
      href={`#/stock/${stock.symbol}`}
      className="flex items-center gap-3 rounded-2xl px-2 py-2.5 transition-colors hover:bg-brand-50 sm:px-3"
    >
      <StockLogo stock={stock} />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5 font-semibold">
          {stock.symbol}
          <span className="rounded bg-paper px-1 text-[10px] font-medium text-muted ring-1 ring-line">
            {stock.market}
          </span>
        </span>
        <span className="block truncate text-sm text-muted">{stock.name}</span>
      </span>
      {!compact && <Sparkline stock={stock} className="hidden h-8 w-24 sm:block" />}
      <span className="w-28 shrink-0 text-right">
        <span className="block font-semibold tabular-nums">{fmtNative(price, stock)}</span>
        <Change value={changeOf(stock, price)} className="justify-end text-sm" />
      </span>
    </a>
  )
}

export function Segmented({ options, value, onChange, label, className = '' }) {
  return (
    <div role="group" aria-label={label} className={`inline-flex rounded-full bg-line/70 p-1 ${className}`}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={`flex-1 rounded-full px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
            value === o.value ? 'bg-ink text-white' : 'text-muted hover:text-ink'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function Card({ className = '', children }) {
  return <section className={`rounded-3xl bg-white p-4 ring-1 ring-line sm:p-5 ${className}`}>{children}</section>
}

export function SectionTitle({ title, href, linkLabel = 'ดูทั้งหมด' }) {
  return (
    <div className="mb-2 flex items-center justify-between gap-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      {href && (
        <a href={href} className="text-sm font-medium text-muted underline-offset-4 hover:text-ink hover:underline">
          {linkLabel}
        </a>
      )}
    </div>
  )
}

export function EmptyState({ title, hint, action }) {
  return (
    <div className="py-10 text-center">
      <p className="font-semibold">{title}</p>
      {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export const buttonPrimary =
  'inline-flex items-center justify-center gap-2 rounded-full bg-brand-400 px-5 py-3 font-semibold text-ink transition-colors hover:bg-brand-500 disabled:cursor-not-allowed disabled:bg-line disabled:text-muted'
export const buttonDark =
  'inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 font-semibold text-white transition-colors hover:bg-ink/85 disabled:cursor-not-allowed disabled:bg-line disabled:text-muted'
export const buttonGhost =
  'inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 font-semibold text-ink ring-1 ring-line transition-colors hover:bg-brand-50'
