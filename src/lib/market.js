import { STOCKS, STOCK_BY_SYMBOL } from '../data/market'

const DAY = 86400000

export const RANGES = {
  '1D': { points: 78, span: DAY * 0.27, vol: 0.0016, trend: 0 },
  '1W': { points: 70, span: DAY * 7, vol: 0.004, trend: 0.03 },
  '1M': { points: 66, span: DAY * 30, vol: 0.011, trend: 0.06 },
  '3M': { points: 66, span: DAY * 91, vol: 0.018, trend: 0.12 },
  '1Y': { points: 104, span: DAY * 365, vol: 0.026, trend: 0.35 },
  '5Y': { points: 104, span: DAY * 1826, vol: 0.05, trend: 1.2 },
}

export const changeOf = (stock, price) => ((price - stock.prevClose) / stock.prevClose) * 100

function hash(text) {
  let h = 1779033703
  for (let i = 0; i < text.length; i++) {
    h = Math.imul(h ^ text.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return h >>> 0
}

function seededRandom(seed) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// กราฟย้อนหลังแบบกำหนดซ้ำได้ จุดสุดท้ายตรงกับราคาปัจจุบันเสมอ
// และช่วง 1D เริ่มจากราคาปิดก่อนหน้า เพื่อให้ % ตรงกับการเปลี่ยนแปลงรายวัน
export function buildSeries(symbol, range, price, prevClose, now = 0) {
  const { points, span, vol, trend } = RANGES[range]
  const rand = seededRandom(hash(symbol + range))
  const drift = ((rand() * 1.3 - 0.3) * trend) / points
  const walk = new Array(points)
  walk[points - 1] = 1
  for (let i = points - 2; i >= 0; i--) {
    const gauss = (rand() + rand() + rand() - 1.5) / 0.5
    walk[i] = Math.max(0.05, walk[i + 1] * (1 + gauss * vol - drift))
  }
  const fix = range === '1D' ? prevClose / price / walk[0] : 1
  const step = span / (points - 1)
  return walk.map((m, i) => ({
    t: now - (points - 1 - i) * step,
    p: price * m * (1 + (fix - 1) * (1 - i / (points - 1))),
  }))
}

function thaiTick(p) {
  if (p < 2) return 0.01
  if (p < 5) return 0.02
  if (p < 10) return 0.05
  if (p < 25) return 0.1
  if (p < 100) return 0.25
  if (p < 200) return 0.5
  if (p < 400) return 1
  return 2
}

export const initialPrices = () => {
  const out = {}
  for (const s of STOCKS) {
    const rand = seededRandom(hash(s.symbol + 'open'))
    const move = 1 + (rand() - 0.42) * 0.05
    const raw = s.prevClose * move
    const tick = s.market === 'TH' ? thaiTick(s.prevClose) : 0.01
    out[s.symbol] = Math.round(raw / tick) * tick
  }
  return out
}

export function nextPrices(prices) {
  const next = { ...prices }
  for (const symbol of Object.keys(next)) {
    if (Math.random() > 0.45) continue
    const stock = STOCK_BY_SYMBOL[symbol]
    const p = next[symbol]
    const delta =
      stock.market === 'TH'
        ? (Math.random() > 0.5 ? 1 : -1) * thaiTick(p)
        : p * (Math.random() - 0.5) * 0.0024
    const candidate = Math.round((p + delta) * 100) / 100
    const ratio = candidate / stock.prevClose
    if (ratio > 0.93 && ratio < 1.07) next[symbol] = candidate
  }
  return next
}
