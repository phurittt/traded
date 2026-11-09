import { useState } from 'react'
import { FEE_RATE, MIN_US_ORDER } from '../data/market'
import { fmtNative, fmtQty, fmtTHB, fxOf, round2 } from '../lib/format'
import { useStore } from '../store/context'
import { CheckIcon } from './Icons'
import { buttonDark, buttonGhost, buttonPrimary, Segmented } from './ui'

const PERCENTS = [0.25, 0.5, 0.75, 1]
const EPS = 1e-9

function sanitize(value, isUS) {
  if (!isUS) return value.replace(/\D/g, '')
  const clean = value.replace(/[^\d.]/g, '').replace(/(\..*)\./g, '$1')
  const [whole, decimals] = clean.split('.')
  return decimals === undefined ? whole : `${whole}.${decimals.slice(0, 2)}`
}

export default function TradePanel({ stock, initialSide = 'buy', onClose }) {
  const { account, prices, dispatch } = useStore()
  const [side, setSide] = useState(initialSide)
  const [input, setInput] = useState('')
  const [sellAll, setSellAll] = useState(false)
  const [filled, setFilled] = useState(null)
  const [reviewing, setReviewing] = useState(false)

  const isUS = stock.market === 'US'
  const isBuy = side === 'buy'
  const price = prices[stock.symbol]
  const fx = fxOf(stock)
  const owned = account.holdings[stock.symbol]?.qty ?? 0
  const entered = parseFloat(input) || 0
  const allOut = !isBuy && sellAll

  const qty = allOut ? owned : isUS ? entered / (price * fx) : entered
  const gross = allOut || !isUS ? qty * price * fx : entered
  const fee = round2(gross * FEE_RATE)
  const total = isBuy ? gross + fee : gross - fee

  let error = ''
  if (!isBuy && owned === 0) error = 'คุณยังไม่มีหุ้นตัวนี้ในพอร์ต'
  else if (qty > 0 && isBuy && total > account.cash + 0.005) error = 'เงินสดไม่พอ ฝากเงินเพิ่มได้ที่หน้าพอร์ต'
  else if (qty > 0 && !isBuy && qty > owned + EPS) error = 'จำนวนเกินหุ้นที่ถืออยู่'
  else if (qty > 0 && isUS && !allOut && gross < MIN_US_ORDER) error = `ขั้นต่ำต่อคำสั่ง ฿${MIN_US_ORDER}`
  const canSubmit = qty > 0 && !error

  const reset = () => {
    setInput('')
    setSellAll(false)
    setReviewing(false)
  }

  const changeSide = (next) => {
    setSide(next)
    reset()
  }

  const applyPercent = (ratio) => {
    if (isBuy) {
      const budget = (account.cash * ratio) / (1 + FEE_RATE)
      setInput(String(isUS ? Math.floor(budget * 100) / 100 : Math.floor(budget / price)))
      setSellAll(false)
    } else if (ratio === 1) {
      setSellAll(true)
      setInput(isUS ? (owned * price * fx).toFixed(2) : String(owned))
    } else {
      setInput(isUS ? (Math.floor(owned * ratio * price * fx * 100) / 100).toFixed(2) : String(Math.floor(owned * ratio)))
      setSellAll(false)
    }
  }

  const confirm = () => {
    if (!canSubmit) return
    const order = {
      id: crypto.randomUUID(),
      kind: side,
      at: new Date().toISOString(),
      symbol: stock.symbol,
      qty,
      price,
      fx,
      fee,
      total,
    }
    dispatch({ type: 'trade', order })
    setFilled(order)
    reset()
  }

  if (filled) {
    return (
      <div className="py-2 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-brand-400">
          <CheckIcon className="size-7" />
        </span>
        <h3 className="mt-3 text-lg font-semibold">{filled.kind === 'buy' ? 'ซื้อสำเร็จ' : 'ขายสำเร็จ'}</h3>
        <p className="mt-1 text-sm text-muted tabular-nums">
          {stock.symbol} {fmtQty(filled.qty)} หุ้น ที่ราคา {fmtNative(filled.price, stock)}
        </p>
        <p className="mt-3 text-2xl font-semibold tabular-nums">{fmtTHB(filled.total)}</p>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button type="button" className={buttonGhost} onClick={() => setFilled(null)}>
            ทำรายการต่อ
          </button>
          <a href="#/portfolio" className={buttonDark} onClick={onClose}>
            ดูพอร์ต
          </a>
        </div>
      </div>
    )
  }

  const summary = [
    ['ราคาตลาดโดยประมาณ', fmtNative(price, stock)],
    ['จำนวนหุ้นโดยประมาณ', fmtQty(qty)],
    ['มูลค่า', fmtTHB(gross)],
    [`ค่าธรรมเนียม (${FEE_RATE * 100}%)`, fmtTHB(fee)],
  ]

  if (reviewing) {
    return (
      <div>
        <h3 className="font-semibold">
          ตรวจสอบคำสั่ง{isBuy ? 'ซื้อ' : 'ขาย'} {stock.symbol}
        </h3>
        <dl className="mt-3 space-y-2.5 text-sm">
          {summary.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-3">
              <dt className="text-muted">{k}</dt>
              <dd className="font-medium tabular-nums">{v}</dd>
            </div>
          ))}
          <div className="flex justify-between gap-3 border-t border-line pt-3 text-base">
            <dt className="font-semibold">{isBuy ? 'ยอดชำระ' : 'เงินที่จะได้รับ'}</dt>
            <dd className="font-semibold tabular-nums">{fmtTHB(total)}</dd>
          </div>
        </dl>
        {error && <p className="mt-3 text-sm text-down">{error}</p>}
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button type="button" className={buttonGhost} onClick={() => setReviewing(false)}>
            แก้ไข
          </button>
          <button type="button" disabled={!canSubmit} onClick={confirm} className={isBuy ? buttonPrimary : buttonDark}>
            ยืนยัน{isBuy ? 'ซื้อ' : 'ขาย'}
          </button>
        </div>
        <p className="mt-3 text-center text-xs text-muted">บัญชีทดลอง ไม่มีการซื้อขายจริง</p>
      </div>
    )
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        if (canSubmit) setReviewing(true)
      }}
    >
      <Segmented
        label="ประเภทคำสั่ง"
        className="w-full"
        value={side}
        onChange={changeSide}
        options={[
          { value: 'buy', label: 'ซื้อ' },
          { value: 'sell', label: 'ขาย' },
        ]}
      />
      <div>
        <label htmlFor={`amount-${stock.symbol}`} className="text-sm text-muted">
          {isUS ? 'จำนวนเงิน (บาท)' : 'จำนวนหุ้น'}
        </label>
        <input
          id={`amount-${stock.symbol}`}
          inputMode={isUS ? 'decimal' : 'numeric'}
          autoComplete="off"
          placeholder={isUS ? '0.00' : '0'}
          value={input}
          onChange={(e) => {
            setSellAll(false)
            setInput(sanitize(e.target.value, isUS))
          }}
          className="mt-1 w-full rounded-2xl bg-paper px-4 py-3 text-2xl font-semibold tabular-nums ring-1 ring-line outline-none focus:ring-2 focus:ring-ink"
        />
        <p className={`mt-1.5 text-sm ${error ? 'text-down' : 'text-muted'}`}>
          {error ||
            (isBuy
              ? `เงินสดพร้อมซื้อ ${fmtTHB(account.cash)}`
              : `หุ้นที่ถือ ${fmtQty(owned)} หุ้น`)}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {PERCENTS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => applyPercent(p)}
            className="rounded-full bg-brand-100 py-2 text-sm font-medium tabular-nums hover:bg-brand-200"
          >
            {p === 1 ? 'ทั้งหมด' : `${p * 100}%`}
          </button>
        ))}
      </div>

      <dl className="space-y-1.5 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-muted">{isUS ? 'จำนวนหุ้นโดยประมาณ' : 'มูลค่าโดยประมาณ'}</dt>
          <dd className="font-medium tabular-nums">{isUS ? fmtQty(qty) : fmtTHB(gross)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted">{isBuy ? 'ยอดชำระรวมค่าธรรมเนียม' : 'เงินที่จะได้รับหลังหักค่าธรรมเนียม'}</dt>
          <dd className="font-medium tabular-nums">{fmtTHB(Math.max(total, 0))}</dd>
        </div>
      </dl>

      <button type="submit" disabled={!canSubmit} className={`${isBuy ? buttonPrimary : buttonDark} w-full`}>
        ตรวจสอบคำสั่ง{isBuy ? 'ซื้อ' : 'ขาย'}
      </button>
    </form>
  )
}
