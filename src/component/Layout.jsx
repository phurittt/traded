import { ActivityIcon, HomeIcon, MarketIcon, PortfolioIcon, SearchIcon, UserIcon } from './Icons'

const NAV = [
  { href: '#/', root: '', label: 'หน้าหลัก', Icon: HomeIcon },
  { href: '#/market', root: 'market', label: 'ตลาด', Icon: MarketIcon },
  { href: '#/portfolio', root: 'portfolio', label: 'พอร์ต', Icon: PortfolioIcon },
  { href: '#/activity', root: 'activity', label: 'กิจกรรม', Icon: ActivityIcon },
  { href: '#/account', root: 'account', label: 'บัญชี', Icon: UserIcon },
]

function Logo() {
  return (
    <a href="#/" className="flex items-center gap-2 text-xl font-bold" aria-label="Kamin หน้าหลัก">
      <img src="/kamin.svg" alt="" className="size-8" />
      Kamin
    </a>
  )
}

function DemoBadge() {
  return <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-medium">บัญชีทดลอง</span>
}

export default function Layout({ route, children }) {
  const root = route.parts[0] === 'stock' ? 'market' : (route.parts[0] ?? '')
  const isStock = route.parts[0] === 'stock'

  return (
    <div className="min-h-dvh lg:pl-60">
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-line bg-white p-5 lg:flex">
        <Logo />
        <nav aria-label="เมนูหลัก" className="mt-8 flex flex-col gap-1">
          {NAV.map(({ href, root: r, label, Icon }) => (
            <a
              key={label}
              href={href}
              aria-current={root === r ? 'page' : undefined}
              className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 font-medium transition-colors ${
                root === r ? 'bg-brand-400 text-ink' : 'text-muted hover:bg-brand-50 hover:text-ink'
              }`}
            >
              <Icon className="size-5" />
              {label}
            </a>
          ))}
        </nav>
        <div className="mt-auto rounded-2xl bg-paper p-3 text-xs leading-relaxed text-muted">
          ราคาและบัญชีทั้งหมดเป็นข้อมูลจำลอง ไม่ใช่คำแนะนำการลงทุน
        </div>
      </aside>

      {!isStock && (
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-paper/90 px-4 py-2.5 backdrop-blur lg:hidden">
          <Logo />
          <div className="flex items-center gap-2">
            <DemoBadge />
            <a href="#/market" aria-label="ค้นหาหุ้น" className="rounded-full p-1.5 hover:bg-brand-100">
              <SearchIcon className="size-5" />
            </a>
          </div>
        </header>
      )}

      <main className="mx-auto max-w-6xl px-4 pt-4 pb-28 sm:px-6 lg:px-10 lg:pt-8 lg:pb-12">{children}</main>

      {!isStock && (
        <nav
          aria-label="เมนูหลัก"
          className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t border-line bg-white pb-[env(safe-area-inset-bottom)] lg:hidden"
        >
          {NAV.map(({ href, root: r, label, Icon }) => (
            <a
              key={label}
              href={href}
              aria-current={root === r ? 'page' : undefined}
              className={`flex flex-col items-center gap-0.5 py-2 text-xs font-medium ${
                root === r ? 'text-ink' : 'text-muted'
              }`}
            >
              <span className={`rounded-full px-4 py-0.5 ${root === r ? 'bg-brand-400' : ''}`}>
                <Icon className="size-5" />
              </span>
              {label}
            </a>
          ))}
        </nav>
      )}
    </div>
  )
}
