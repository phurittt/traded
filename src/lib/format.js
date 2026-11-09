import { FX_USDTHB } from '../data/market'

const n2 = new Intl.NumberFormat('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const n4 = new Intl.NumberFormat('th-TH', { maximumFractionDigits: 4 })

export const fxOf = (stock) => (stock.market === 'US' ? FX_USDTHB : 1)
export const fmtNumber = (v) => n2.format(v)
export const fmtTHB = (v) => `฿${n2.format(v)}`
export const fmtNative = (v, stock) => (stock.market === 'US' ? `$${n2.format(v)}` : `฿${n2.format(v)}`)
export const fmtQty = (v) => n4.format(v)
export const fmtSigned = (v) => `${v >= 0 ? '+' : '−'}${n2.format(Math.abs(v))}`
export const fmtPct = (v) => `${v >= 0 ? '+' : '−'}${n2.format(Math.abs(v))}%`
export const round2 = (v) => Math.round(v * 100) / 100

export const fmtDateTime = (iso) =>
  new Date(iso).toLocaleString('th-TH', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })

export const fmtChartTime = (ms, range) =>
  range === '1D'
    ? new Date(ms).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
    : new Date(ms).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })
