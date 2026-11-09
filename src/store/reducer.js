import { initialAccount } from '../data/market'

const DUST = 1e-6
const CENT = 0.005

function applyTrade(state, order) {
  const { kind, symbol, qty, price, fx, fee } = order
  const gross = qty * price * fx
  const held = state.holdings[symbol]

  if (qty <= 0) return state

  if (kind === 'buy') {
    const cost = gross + fee
    if (cost > state.cash + CENT) return state
    const oldQty = held?.qty ?? 0
    const newQty = oldQty + qty
    const avg = (oldQty * (held?.avg ?? 0) + qty * price) / newQty
    return {
      ...state,
      cash: Math.max(0, state.cash - cost),
      holdings: { ...state.holdings, [symbol]: { qty: newQty, avg } },
      orders: [order, ...state.orders],
    }
  }

  if (!held || qty > held.qty + DUST) return state
  const holdings = { ...state.holdings }
  const left = held.qty - qty
  if (left < DUST) delete holdings[symbol]
  else holdings[symbol] = { ...held, qty: left }
  return {
    ...state,
    cash: state.cash + gross - fee,
    holdings,
    orders: [order, ...state.orders],
  }
}

export function reducer(state, action) {
  switch (action.type) {
    case 'trade':
      return applyTrade(state, action.order)
    case 'cash': {
      const { order } = action
      const sign = order.kind === 'deposit' ? 1 : -1
      if (order.amount <= 0 || (sign < 0 && order.amount > state.cash + CENT)) return state
      return {
        ...state,
        cash: Math.max(0, state.cash + sign * order.amount),
        orders: [order, ...state.orders],
      }
    }
    case 'toggleWatch': {
      const on = state.watchlist.includes(action.symbol)
      return {
        ...state,
        watchlist: on
          ? state.watchlist.filter((s) => s !== action.symbol)
          : [...state.watchlist, action.symbol],
      }
    }
    case 'toggleHidden':
      return { ...state, hidden: !state.hidden }
    case 'reset':
      return initialAccount
    default:
      return state
  }
}
