import { useEffect, useMemo, useState } from 'react'
import { BackIcon, StarIcon } from '../component/Icons'
import PriceChart from '../component/PriceChart'
import Sheet from '../component/Sheet'
import TradePanel from '../component/TradePanel'
import { buttonDark, buttonPrimary, Card, Change, EmptyState, Masked, StockLogo } from '../component/ui'
import { STOCK_BY_SYMBOL } from '../data/market'
import { fmtNative, fmtNumber, fmtQty, fmtSigned, fmtTHB } from '../lib/format'
import { buildSeries } from '../lib/market'
import { useStore } from '../store/context'
import { usePortfolio } from '../store/usePortfolio'

function Stat({ label, value }) {
  return (
    <div>
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="mt-0.5 font-semibold tabular-nums">{value}</dd>
    </div>
  )
}

export default function StockDetail({ symbol }) {
  const stock = STOCK_BY_SYMBOL[symbol]
  const { account, prices, dispatch } = useStore()
  const { positions } = usePortfolio()
  const [sheetSide, setSheetSide] = useState(null)

  // ปิด sheet ของมือถือเมื่อจอกว้างขึ้นจนมีแผงซื้อขายด้านข้างแล้ว
  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)')
    const onChange = (e) => e.matches && setSheetSide(null)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  const price = stock ? prices[stock.symbol] : 0
  const yearRange = useMemo(() => {
    if (!stock) return null
    const values = buildSeries(stock.symbol, '1Y', price, stock.prevClose).map((d) => d.p)
    return { high: Math.max(...values), low: Math.min(...values) }
  }, [stock, price])

  if (!stock) {
    return (
      <EmptyState
        title="ไม่พบหุ้นนี้"
        action={
          <a href="#/market" className={buttonPrimary}>
            กลับไปหน้าตลาด
          </a>
        }
      />
    )
  }

  const watching = account.watchlist.includes(stock.symbol)
  const position = positions.find((p) => p.stock.symbol === stock.symbol)

  return (
    <div className="pb-4">
      <div className="mb-4 flex items-center gap-3">
        <a href="#/market" aria-label="กลับไปหน้าตลาด" className="-ml-1.5 rounded-full p-1.5 hover:bg-brand-100">
          <BackIcon className="size-6" />
        </a>
        <StockLogo stock={stock} />
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold">{stock.symbol}</h1>
          <p className="truncate text-sm text-muted">
            {stock.name} · {stock.sector}
          </p>
        </div>
        <button
          type="button"
          aria-pressed={watching}
          aria-label={watching ? 'นำออกจากรายการโปรด' : 'เพิ่มในรายการโปรด'}
          onClick={() => dispatch({ type: 'toggleWatch', symbol: stock.symbol })}
          className="rounded-full p-2 hover:bg-brand-100"
        >
          <StarIcon filled={watching} className={`size-6 ${watching ? 'text-brand-600' : ''}`} />
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div className="min-w-0 space-y-5">
          <Card>
            <PriceChart stock={stock} price={price} />
          </Card>

          {position && (
            <Card className="bg-brand-50!">
              <h2 className="text-lg font-semibold">หุ้นที่คุณถือ</h2>
              <dl className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <Stat label="จำนวนหุ้น" value={<Masked>{fmtQty(position.qty)}</Masked>} />
                <Stat label="ต้นทุนเฉลี่ย" value={fmtNative(position.avg, stock)} />
                <Stat label="มูลค่า" value={<Masked>{fmtTHB(position.value)}</Masked>} />
                <div>
                  <dt className="text-sm text-muted">กำไร/ขาดทุน</dt>
                  <dd className="mt-0.5">
                    <Masked>
                      <span className="font-semibold tabular-nums">{fmtSigned(position.pl)}</span>
                    </Masked>{' '}
                    <Change value={position.plPct} className="text-sm" />
                  </dd>
                </div>
              </dl>
            </Card>
          )}

          <Card>
            <h2 className="text-lg font-semibold">เกี่ยวกับบริษัท</h2>
            <p className="mt-2 leading-relaxed text-muted">{stock.about}</p>
            <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Stat label="สูงสุด 1 ปี" value={fmtNative(yearRange.high, stock)} />
              <Stat label="ต่ำสุด 1 ปี" value={fmtNative(yearRange.low, stock)} />
              <Stat label="P/E" value={fmtNumber(stock.pe)} />
              <Stat label="อัตราปันผล" value={`${fmtNumber(stock.dividend)}%`} />
            </dl>
          </Card>
        </div>

        <Card className="sticky top-8 hidden lg:block">
          <TradePanel stock={stock} />
        </Card>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-2 gap-2 border-t border-line bg-white p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
        <button type="button" className={buttonDark} onClick={() => setSheetSide('sell')}>
          ขาย
        </button>
        <button type="button" className={buttonPrimary} onClick={() => setSheetSide('buy')}>
          ซื้อ
        </button>
      </div>

      {sheetSide && (
        <Sheet title={`ซื้อขาย ${stock.symbol}`} onClose={() => setSheetSide(null)} className="lg:hidden">
          <TradePanel stock={stock} initialSide={sheetSide} onClose={() => setSheetSide(null)} />
        </Sheet>
      )}
    </div>
  )
}
