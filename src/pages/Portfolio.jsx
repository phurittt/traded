import { useState } from 'react'
import AllocationBar from '../component/AllocationBar'
import CashSheet from '../component/CashSheet'
import { buttonDark, buttonPrimary, Card, Change, EmptyState, Masked, Segmented, StockLogo } from '../component/ui'
import { fmtNative, fmtQty, fmtSigned, fmtTHB } from '../lib/format'
import { usePortfolio } from '../store/usePortfolio'

const TABS = [
  { value: 'all', label: 'ทั้งหมด' },
  { value: 'US', label: 'สหรัฐ' },
  { value: 'TH', label: 'ไทย' },
]

export default function Portfolio() {
  const p = usePortfolio()
  const [tab, setTab] = useState('all')
  const [cashOpen, setCashOpen] = useState(false)
  const list = p.positions.filter((x) => tab === 'all' || x.stock.market === tab)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">พอร์ตของฉัน</h1>
        <button type="button" className={`${buttonDark} py-2!`} onClick={() => setCashOpen(true)}>
          ฝาก/ถอนเงิน
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div className="min-w-0 space-y-5">
          <section className="grid grid-cols-2 gap-3">
            <div className="col-span-2 rounded-3xl bg-brand-400 p-5">
              <p className="text-sm font-medium">มูลค่าหุ้นทั้งหมด</p>
              <p className="mt-1 text-3xl font-bold tabular-nums sm:text-4xl">
                <Masked>{fmtTHB(p.invested)}</Masked>
              </p>
            </div>
            <Card>
              <p className="text-sm text-muted">กำไร/ขาดทุนสะสม</p>
              <p className="mt-1 font-semibold tabular-nums">
                <Masked>{fmtSigned(p.pl)} บาท</Masked>
              </p>
              <Change value={p.plPct} className="text-sm" />
            </Card>
            <Card>
              <p className="text-sm text-muted">เปลี่ยนแปลงวันนี้</p>
              <p className="mt-1 font-semibold tabular-nums">
                <Masked>{fmtSigned(p.dayChange)} บาท</Masked>
              </p>
              <Change value={p.dayChangePct} className="text-sm" />
            </Card>
          </section>

          <Card>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold">หุ้นที่ถือ</h2>
              <Segmented label="กรองตลาด" options={TABS} value={tab} onChange={setTab} />
            </div>
            {list.length ? (
              <ul className="-mx-2 sm:-mx-3">
                {list.map((x) => (
                  <li key={x.stock.symbol}>
                    <a
                      href={`#/stock/${x.stock.symbol}`}
                      className="flex items-center gap-3 rounded-2xl px-2 py-2.5 transition-colors hover:bg-brand-50 sm:px-3"
                    >
                      <StockLogo stock={x.stock} />
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold">{x.stock.symbol}</span>
                        <span className="block truncate text-sm text-muted tabular-nums">
                          <Masked>{fmtQty(x.qty)} หุ้น</Masked> · ทุน {fmtNative(x.avg, x.stock)}
                        </span>
                      </span>
                      <span className="shrink-0 text-right">
                        <span className="block font-semibold tabular-nums">
                          <Masked>{fmtTHB(x.value)}</Masked>
                        </span>
                        <Change value={x.plPct} className="justify-end text-sm" />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                title="ยังไม่มีหุ้นในกลุ่มนี้"
                hint="เลือกหุ้นที่สนใจแล้วเริ่มลงทุนได้เลย"
                action={
                  <a href="#/market" className={buttonPrimary}>
                    ไปหน้าตลาด
                  </a>
                }
              />
            )}
          </Card>
        </div>

        <Card>
          <h2 className="mb-4 text-lg font-semibold">สัดส่วนสินทรัพย์</h2>
          <AllocationBar us={p.usValue} th={p.thValue} cash={p.cash} />
          <div className="mt-4 flex justify-between border-t border-line pt-3 font-semibold tabular-nums">
            <span>รวมทั้งหมด</span>
            <Masked>{fmtTHB(p.total)}</Masked>
          </div>
        </Card>
      </div>

      {cashOpen && <CashSheet onClose={() => setCashOpen(false)} />}
    </div>
  )
}
