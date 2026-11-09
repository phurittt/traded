import { useState } from 'react'
import CashSheet from '../component/CashSheet'
import { DepositIcon, EyeIcon, EyeOffIcon, WithdrawIcon } from '../component/Icons'
import { buttonDark, Card, Change, EmptyState, Masked, SectionTitle, Sparkline, StockLogo, StockRow } from '../component/ui'
import { NEWS, STOCKS, STOCK_BY_SYMBOL, THEMES } from '../data/market'
import { fmtSigned, fmtTHB } from '../lib/format'
import { changeOf } from '../lib/market'
import { useStore } from '../store/context'
import { usePortfolio } from '../store/usePortfolio'

export default function Home() {
  const { account, prices, dispatch } = useStore()
  const p = usePortfolio()
  const [cashMode, setCashMode] = useState(null)

  const movers = [...STOCKS]
    .sort((a, b) => changeOf(b, prices[b.symbol]) - changeOf(a, prices[a.symbol]))
    .slice(0, 4)
  const watchlist = account.watchlist.map((s) => STOCK_BY_SYMBOL[s]).filter(Boolean)

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
      <div className="min-w-0 space-y-5">
        <section className="rounded-3xl bg-brand-400 p-5 sm:p-7">
          <div className="flex items-center gap-2 text-sm font-medium">
            มูลค่าพอร์ตรวม
            <button
              type="button"
              onClick={() => dispatch({ type: 'toggleHidden' })}
              aria-label={account.hidden ? 'แสดงยอดเงิน' : 'ซ่อนยอดเงิน'}
              className="rounded-full p-1 hover:bg-brand-500"
            >
              {account.hidden ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
            </button>
          </div>
          <p className="mt-1 text-4xl font-bold tabular-nums sm:text-5xl">
            <Masked>{fmtTHB(p.total)}</Masked>
          </p>
          <p className="mt-2 flex flex-wrap items-center gap-x-2 text-sm font-medium tabular-nums">
            <span>วันนี้</span>
            <Masked>
              <span>
                {p.dayChange >= 0 ? '▲' : '▼'} {fmtSigned(p.dayChange)} บาท ({p.dayChangePct >= 0 ? '+' : ''}
                {p.dayChangePct.toFixed(2)}%)
              </span>
            </Masked>
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <button type="button" className={buttonDark} onClick={() => setCashMode('deposit')}>
              <DepositIcon className="size-5" />
              ฝากเงิน
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-5 py-3 font-semibold hover:bg-white"
              onClick={() => setCashMode('withdraw')}
            >
              <WithdrawIcon className="size-5" />
              ถอนเงิน
            </button>
            <p className="ml-auto text-sm tabular-nums max-sm:w-full max-sm:mt-1">
              เงินสดพร้อมลงทุน{' '}
              <strong className="font-semibold">
                <Masked>{fmtTHB(p.cash)}</Masked>
              </strong>
            </p>
          </div>
        </section>

        <section aria-label="ธีมการลงทุน" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          {THEMES.map((t) => (
            <a
              key={t.id}
              href={`#/market?theme=${t.id}`}
              className="shrink-0 rounded-2xl bg-white px-4 py-2.5 ring-1 ring-line transition-colors hover:bg-brand-50 sm:flex-1"
            >
              <span className="block font-semibold whitespace-nowrap">{t.label}</span>
              <span className="block text-xs whitespace-nowrap text-muted">{t.hint}</span>
            </a>
          ))}
        </section>

        <section>
          <SectionTitle title="ขึ้นแรงวันนี้" href="#/market" />
          <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-4 sm:px-0">
            {movers.map((s) => (
              <a
                key={s.symbol}
                href={`#/stock/${s.symbol}`}
                className="w-40 shrink-0 rounded-3xl bg-white p-4 ring-1 ring-line transition-colors hover:bg-brand-50 sm:w-auto"
              >
                <span className="flex items-center gap-2 font-semibold">
                  <StockLogo stock={s} size="size-8" />
                  {s.symbol}
                </span>
                <Sparkline stock={s} className="mt-3 h-10 w-full" />
                <Change value={changeOf(s, prices[s.symbol])} className="mt-2 text-sm" />
              </a>
            ))}
          </div>
        </section>

        <Card>
          <SectionTitle title="หุ้นในพอร์ต" href="#/portfolio" linkLabel="ดูพอร์ต" />
          {p.positions.length ? (
            <div className="-mx-2 sm:-mx-3">
              {p.positions.slice(0, 4).map((pos) => (
                <StockRow key={pos.stock.symbol} stock={pos.stock} />
              ))}
            </div>
          ) : (
            <EmptyState title="ยังไม่มีหุ้นในพอร์ต" hint="เริ่มซื้อหุ้นตัวแรกได้จากหน้าตลาด" />
          )}
        </Card>
      </div>

      <div className="min-w-0 space-y-5">
        <Card>
          <SectionTitle title="รายการโปรด" href="#/market" />
          {watchlist.length ? (
            <div className="-mx-2 sm:-mx-3">
              {watchlist.map((s) => (
                <StockRow key={s.symbol} stock={s} compact />
              ))}
            </div>
          ) : (
            <EmptyState title="ยังไม่มีรายการโปรด" hint="กดดาวในหน้าหุ้นเพื่อเพิ่มที่นี่" />
          )}
        </Card>

        <Card>
          <div className="mb-2 flex items-baseline justify-between">
            <h2 className="text-lg font-semibold">เรื่องน่ารู้</h2>
            <span className="text-xs text-muted">เนื้อหาตัวอย่าง</span>
          </div>
          <ul className="divide-y divide-line">
            {NEWS.map((n) => (
              <li key={n.id} className="py-3 first:pt-1 last:pb-0">
                <p className="text-xs text-muted">
                  {n.tag} · {n.time}
                </p>
                <p className="mt-0.5 font-medium">{n.title}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {cashMode && <CashSheet initialMode={cashMode} onClose={() => setCashMode(null)} />}
    </div>
  )
}
