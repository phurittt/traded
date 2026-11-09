import { STOCK_BY_SYMBOL } from '../data/market'
import { fxOf } from '../lib/format'
import { useStore } from './context'

export function usePortfolio() {
  const { account, prices } = useStore()

  const positions = Object.entries(account.holdings)
    .map(([symbol, { qty, avg }]) => {
      const stock = STOCK_BY_SYMBOL[symbol]
      const fx = fxOf(stock)
      const price = prices[symbol]
      const value = qty * price * fx
      const cost = qty * avg * fx
      return {
        stock,
        qty,
        avg,
        price,
        value,
        cost,
        pl: value - cost,
        plPct: cost ? ((value - cost) / cost) * 100 : 0,
        dayChange: qty * (price - stock.prevClose) * fx,
      }
    })
    .sort((a, b) => b.value - a.value)

  const sum = (key, list = positions) => list.reduce((acc, p) => acc + p[key], 0)
  const invested = sum('value')
  const cost = sum('cost')
  const dayChange = sum('dayChange')
  const usValue = sum('value', positions.filter((p) => p.stock.market === 'US'))
  const prevInvested = invested - dayChange

  return {
    positions,
    invested,
    cash: account.cash,
    total: invested + account.cash,
    pl: invested - cost,
    plPct: cost ? ((invested - cost) / cost) * 100 : 0,
    dayChange,
    dayChangePct: prevInvested ? (dayChange / prevInvested) * 100 : 0,
    usValue,
    thValue: invested - usValue,
  }
}
