import { useState } from 'react'
import CashSheet from '../component/CashSheet'
import { ChevronIcon, UserIcon } from '../component/Icons'
import Sheet from '../component/Sheet'
import { buttonDark, buttonGhost, Card, Masked } from '../component/ui'
import { fmtTHB } from '../lib/format'
import { useStore } from '../store/context'

export default function Account() {
  const { account, dispatch } = useStore()
  const [cashOpen, setCashOpen] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)
  const rowClass = 'flex w-full items-center justify-between gap-3 py-3.5 text-left font-medium'

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <h1 className="text-2xl font-bold">บัญชี</h1>

      <section className="flex items-center gap-4 rounded-3xl bg-brand-400 p-5">
        <span className="grid size-14 place-items-center rounded-full bg-ink text-brand-400">
          <UserIcon className="size-7" />
        </span>
        <div>
          <p className="text-lg font-semibold">นักลงทุนทดลอง</p>
          <p className="text-sm tabular-nums">
            เงินสด <Masked>{fmtTHB(account.cash)}</Masked>
          </p>
        </div>
      </section>

      <Card className="py-1!">
        <ul className="divide-y divide-line">
          <li>
            <button type="button" className={rowClass} onClick={() => setCashOpen(true)}>
              ฝาก/ถอนเงิน
              <ChevronIcon className="size-5 text-muted" />
            </button>
          </li>
          <li>
            <button
              type="button"
              role="switch"
              aria-checked={account.hidden}
              className={rowClass}
              onClick={() => dispatch({ type: 'toggleHidden' })}
            >
              ซ่อนยอดเงิน
              <span className={`relative h-7 w-12 rounded-full transition-colors ${account.hidden ? 'bg-brand-400' : 'bg-line'}`}>
                <span
                  className={`absolute top-1 size-5 rounded-full bg-ink transition-[left] ${account.hidden ? 'left-6' : 'left-1'}`}
                />
              </span>
            </button>
          </li>
          <li>
            <button type="button" className={`${rowClass} text-down`} onClick={() => setResetOpen(true)}>
              รีเซ็ตบัญชีทดลอง
              <ChevronIcon className="size-5 text-muted" />
            </button>
          </li>
        </ul>
      </Card>

      <p className="px-1 text-sm leading-relaxed text-muted">
        Kamin เป็นแอปสาธิตฝั่งหน้าบ้าน ราคา กราฟ และบัญชีทั้งหมดเป็นข้อมูลจำลองที่เก็บไว้ในเบราว์เซอร์นี้
        ไม่มีการซื้อขายจริงและไม่ใช่คำแนะนำการลงทุน
      </p>

      {cashOpen && <CashSheet onClose={() => setCashOpen(false)} />}
      {resetOpen && (
        <Sheet title="รีเซ็ตบัญชีทดลอง?" onClose={() => setResetOpen(false)}>
          <p className="text-muted">เงินสด หุ้นในพอร์ต รายการโปรด และประวัติทั้งหมดจะกลับเป็นค่าเริ่มต้น</p>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <button type="button" className={buttonGhost} onClick={() => setResetOpen(false)}>
              ยกเลิก
            </button>
            <button
              type="button"
              className={buttonDark}
              onClick={() => {
                dispatch({ type: 'reset' })
                setResetOpen(false)
              }}
            >
              รีเซ็ต
            </button>
          </div>
        </Sheet>
      )}
    </div>
  )
}
