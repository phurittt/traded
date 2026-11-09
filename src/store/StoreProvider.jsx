import { useEffect, useMemo, useReducer, useState } from 'react'
import { initialAccount } from '../data/market'
import { initialPrices, nextPrices } from '../lib/market'
import { StoreContext } from './context'
import { reducer } from './reducer'

const STORAGE_KEY = 'kamin-demo-v1'

function loadAccount() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return { ...initialAccount, ...JSON.parse(saved) }
  } catch {
    // เปิดแบบไม่มี storage ได้ ใช้ข้อมูลเริ่มต้นแทน
  }
  return initialAccount
}

export default function StoreProvider({ children }) {
  const [account, dispatch] = useReducer(reducer, undefined, loadAccount)
  const [prices, setPrices] = useState(initialPrices)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(account))
    } catch {
      // storage เต็มหรือถูกปิด ข้อมูลจะอยู่แค่ใน session นี้
    }
  }, [account])

  useEffect(() => {
    const id = setInterval(() => {
      if (document.hidden) return
      setNow(Date.now())
      setPrices(nextPrices)
    }, 2500)
    return () => clearInterval(id)
  }, [])

  const value = useMemo(() => ({ account, prices, now, dispatch }), [account, prices, now])
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
