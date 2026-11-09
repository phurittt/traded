import { useState } from 'react'
import { DepositIcon, WithdrawIcon } from '../component/Icons'
import { Card, EmptyState, Masked, Segmented, StockLogo } from '../component/ui'
import { STOCK_BY_SYMBOL } from '../data/market'
import { fmtDateTime, fmtNative, fmtQty, fmtTHB } from '../lib/format'
import { useStore } from '../store/context'

const TABS = [
  { value: 'all', label: 'ทั้งหมด' },
  { value: 'trade', label: 'ซื้อขาย' },
  { value: 'cash', label: 'ฝาก/ถอน' },
]

const LABEL = { buy: 'ซื้อ', sell: 'ขาย', deposit: 'ฝากเงิน', withdraw: 'ถอนเงิน' }
const isTrade = (o) => o.kind === 'buy' || o.kind === 'sell'

function Row({ order }) {
  const trade = isTrade(order)
  const stock = trade ? STOCK_BY_SYMBOL[order.symbol] : null
  const incoming = order.kind === 'sell' || order.kind === 'deposit'
  const amount = trade ? order.total : order.amount
  return (
    <li className="flex items-center gap-3 py-3">
      {trade ? (
        <StockLogo stock={stock} />
      ) : (
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-100">
          {order.kind === 'deposit' ? <DepositIcon className="size-5" /> : <WithdrawIcon className="size-5" />}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="font-semibold">
          {LABEL[order.kind]} {trade && order.symbol}
        </p>
        <p className="truncate text-sm text-muted tabular-nums">
          {fmtDateTime(order.at)}
          {trade && ` · ${fmtQty(order.qty)} หุ้น @ ${fmtNative(order.price, stock)}`}
        </p>
      </div>
      <p className={`shrink-0 font-semibold tabular-nums ${incoming ? 'text-up' : ''}`}>
        <Masked>
          {incoming ? '+' : '−'}
          {fmtTHB(amount)}
        </Masked>
      </p>
    </li>
  )
}

export default function Activity() {
  const { account } = useStore()
  const [tab, setTab] = useState('all')
  const list = account.orders.filter((o) => tab === 'all' || (tab === 'trade') === isTrade(o))

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-2xl font-bold">กิจกรรม</h1>
      <Segmented label="กรองกิจกรรม" options={TABS} value={tab} onChange={setTab} className="max-sm:w-full" />
      <Card>
        {list.length ? (
          <ul className="divide-y divide-line">
            {list.map((o) => (
              <Row key={o.id} order={o} />
            ))}
          </ul>
        ) : (
          <EmptyState title="ยังไม่มีรายการ" hint="รายการซื้อขายและฝากถอนจะแสดงที่นี่" />
        )}
      </Card>
    </div>
  )
}
