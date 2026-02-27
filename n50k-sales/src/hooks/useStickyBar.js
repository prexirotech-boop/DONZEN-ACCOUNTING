import { useEffect } from 'react'

export function useStickyBar() {
  useEffect(() => {
    const bar = document.querySelector('.sticky-bar')
    const handler = () => {
      if (!bar) return
      if (window.scrollY > 700) bar.classList.add('show')
      else bar.classList.remove('show')
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
}
