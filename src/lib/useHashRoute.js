import { useMemo, useSyncExternalStore } from 'react'

const subscribe = (cb) => {
  window.addEventListener('hashchange', cb)
  return () => window.removeEventListener('hashchange', cb)
}

export function useHashRoute() {
  const hash = useSyncExternalStore(subscribe, () => window.location.hash)
  return useMemo(() => {
    const [path, search] = (hash.replace(/^#/, '') || '/').split('?')
    return { path, parts: path.split('/').filter(Boolean), query: new URLSearchParams(search) }
  }, [hash])
}
