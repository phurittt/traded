import { useState } from 'react'
import { fmtTHB, round2 } from '../lib/format'
import { useStore } from '../store/context'
import Sheet from './Sheet'
import { buttonPrimary, Segmented } from './ui'

const PRESETS = [500, 1000, 5000, 10000]

export default function CashSheet({ initialMode = 'deposit', onClose }) {
  const { account, dispatch } = useStore()
  const [mode, setMode] = useState(initialMode)
  const [input, setInput] = useState('')
  const amount = round2(parseFloat(input) || 0)
  const tooMuch = mode === 'withdraw' && amount > account.cash

  const submit = (e) => {
    e.preventDefault()
    if (amount <= 0 || tooMuch) return
    dispatch({
      type: 'cash',
      order: { id: crypto.randomUUID(), kind: mode, at: new Date().toISOString(), amount },
    })
    onClose()
  }

  return (
    <Sheet title={mode === 'deposit' ? 'ฝากเงินเข้าบัญชี' : 'ถอนเงินออกจากบัญชี'} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <Segmented
          label="ประเภทรายการ"
          className="w-full"
          value={mode}
          onChange={setMode}
          options={[
            { value: 'deposit', label: 'ฝากเงิน' },
            { value: 'withdraw', label: 'ถอนเงิน' },
          ]}
        />
        <div>
          <label htmlFor="cash-amount" className="text-sm text-muted">
            จำนวนเงิน (บาท)
          </label>
          <input
            id="cash-amount"
            autoFocus
            inputMode="decimal"
            autoComplete="off"
            placeholder="0.00"
            value={input}
            onChange={(e) => setInput(e.target.value.replace(/[^\d.]/g, '').replace(/(\..*)\./g, '$1'))}
            className="mt-1 w-full rounded-2xl bg-paper px-4 py-3 text-2xl font-semibold tabular-nums ring-1 ring-line outline-none focus:ring-2 focus:ring-ink"
          />
          <p className={`mt-1.5 text-sm ${tooMuch ? 'text-down' : 'text-muted'}`}>
            {tooMuch ? 'ยอดถอนเกินเงินสดที่มี' : `เงินสดคงเหลือ ${fmtTHB(account.cash)}`}
          </p>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {PRESETS.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setInput(String(v))}
              className="rounded-full bg-brand-100 py-2 text-sm font-medium tabular-nums hover:bg-brand-200"
            >
              {v.toLocaleString('th-TH')}
            </button>
          ))}
        </div>
        <button type="submit" disabled={amount <= 0 || tooMuch} className={`${buttonPrimary} w-full`}>
          {mode === 'deposit' ? 'ยืนยันการฝากเงิน' : 'ยืนยันการถอนเงิน'}
        </button>
        <p className="text-center text-xs text-muted">บัญชีทดลอง ไม่มีการโอนเงินจริง</p>
      </form>
    </Sheet>
  )
}
