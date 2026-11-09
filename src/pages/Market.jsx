import { useState } from 'react'
import { SearchIcon } from '../component/Icons'
import { Card, EmptyState, Segmented, StockRow } from '../component/ui'
import { STOCKS, THEMES } from '../data/market'
import { changeOf } from '../lib/market'
import { useStore } from '../store/context'

const TABS = [
  { value: 'all', label: 'ทั้งหมด' },
  { value: 'US', label: 'สหรัฐ' },
  { value: 'TH', label: 'ไทย' },
  { value: 'watch', label: 'โปรด' },
]

export default function Market({ theme }) {
  const { account, prices } = useStore()
  const [tab, setTab] = useState('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('default')

  const q = search.trim().toLowerCase()
  const list = STOCKS.filter((s) => {
    if (tab === 'watch' && !account.watchlist.includes(s.symbol)) return false
    if ((tab === 'US' || tab === 'TH') && s.market !== tab) return false
    if (theme && !s.tags.includes(theme)) return false
    return !q || s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
  })

  const change = (s) => changeOf(s, prices[s.symbol])
  if (sort === 'gain') list.sort((a, b) => change(b) - change(a))
  if (sort === 'lose') list.sort((a, b) => change(a) - change(b))
  if (sort === 'az') list.sort((a, b) => a.symbol.localeCompare(b.symbol))

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-2xl font-bold">ตลาด</h1>

      <div className="relative">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ค้นหาชื่อหรือสัญลักษณ์หุ้น"
          aria-label="ค้นหาหุ้น"
          className="w-full rounded-full bg-white py-3 pr-4 pl-12 ring-1 ring-line outline-none placeholder:text-muted focus:ring-2 focus:ring-ink"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <Segmented label="กรองตลาด" options={TABS} value={tab} onChange={setTab} className="max-sm:w-full" />
        <select
          aria-label="เรียงลำดับ"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-full bg-white px-4 py-2 text-sm font-medium ring-1 ring-line max-sm:w-full"
        >
          <option value="default">เรียงตามความนิยม</option>
          <option value="gain">ขึ้นมากสุด</option>
          <option value="lose">ลงมากสุด</option>
          <option value="az">ชื่อ A–Z</option>
        </select>
      </div>

      <nav aria-label="ธีมการลงทุน" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {THEMES.map((t) => (
          <a
            key={t.id}
            href={theme === t.id ? '#/market' : `#/market?theme=${t.id}`}
            aria-current={theme === t.id ? 'true' : undefined}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              theme === t.id ? 'bg-brand-400' : 'bg-brand-100 hover:bg-brand-200'
            }`}
          >
            {t.label}
          </a>
        ))}
      </nav>

      <Card className="px-2! py-2! sm:px-3!">
        {list.length ? (
          list.map((s) => <StockRow key={s.symbol} stock={s} />)
        ) : (
          <EmptyState title="ไม่พบหุ้นที่ค้นหา" hint="ลองเปลี่ยนคำค้นหรือตัวกรอง" />
        )}
      </Card>
    </div>
  )
}
