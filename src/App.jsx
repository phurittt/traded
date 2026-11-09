import { useEffect } from 'react'
import Layout from './component/Layout'
import { EmptyState } from './component/ui'
import { useHashRoute } from './lib/useHashRoute'
import Account from './pages/Account'
import Activity from './pages/Activity'
import Home from './pages/Home'
import Market from './pages/Market'
import Portfolio from './pages/Portfolio'
import StockDetail from './pages/StockDetail'
import StoreProvider from './store/StoreProvider'

function Page({ route }) {
  const [root, param] = route.parts
  switch (root) {
    case undefined:
      return <Home />
    case 'market':
      return <Market theme={route.query.get('theme')} />
    case 'stock':
      return <StockDetail key={param} symbol={param} />
    case 'portfolio':
      return <Portfolio />
    case 'activity':
      return <Activity />
    case 'account':
      return <Account />
    default:
      return <EmptyState title="ไม่พบหน้านี้" />
  }
}

export default function App() {
  const route = useHashRoute()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [route.path])

  return (
    <StoreProvider>
      <Layout route={route}>
        <Page route={route} />
      </Layout>
    </StoreProvider>
  )
}
