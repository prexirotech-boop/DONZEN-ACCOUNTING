import { useEffect } from 'react'

const BUYERS = [
  { name: 'Chioma A.', city: 'Lagos', i: 'C' },
  { name: 'Emeka O.', city: 'Onitsha', i: 'E' },
  { name: 'Fatima I.', city: 'Abuja', i: 'F' },
  { name: 'Kelechi N.', city: 'Port Harcourt', i: 'K' },
  { name: 'Aisha M.', city: 'Kano', i: 'A' },
  { name: 'Bello T.', city: 'Kaduna', i: 'B' },
  { name: 'Ngozi C.', city: 'Enugu', i: 'N' },
  { name: 'Tunde B.', city: 'Ibadan', i: 'T' },
  { name: 'Amaka U.', city: 'Aba', i: 'A' },
  { name: 'Ibrahim S.', city: 'Abuja', i: 'I' },
  { name: 'Blessing O.', city: 'Benin City', i: 'B' },
  { name: 'Chukwudi E.', city: 'Lagos', i: 'C' },
  { name: 'Halima D.', city: 'Sokoto', i: 'H' },
  { name: 'Rotimi A.', city: 'Akure', i: 'R' },
  { name: 'Nneka F.', city: 'Asaba', i: 'N' },
  { name: 'Yusuf M.', city: 'Jos', i: 'Y' },
  { name: 'Adaeze P.', city: 'Warri', i: 'A' },
  { name: 'Chidi O.', city: 'Owerri', i: 'C' },
]
const TIMES = ['just now', '1 min ago', '2 min ago', '3 min ago']

function fire(buyer) {
  const root = document.getElementById('toast-root')
  if (!root) return

  const div = document.createElement('div')
  div.className = 'toast'

  // Custom ClickFunnels style notification UI
  div.style.cssText = `
    background: #fff; border-radius: 12px; padding: 14px 18px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04);
    display: flex; align-items: center; gap: 14px; margin-bottom: 12px;
    border-left: 4px solid var(--g600);
    position: relative; overflow: hidden;
  `

  div.innerHTML = `
    <div style="width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, var(--g100), var(--g50)); display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1.5px solid var(--g200);">
      <span style="font-size: 1.25rem;">🇳🇬</span>
    </div>
    <div style="flex: 1; min-width: 0;">
      <div style="font-size: .86rem; color: var(--n800); font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
        ${buyer.name} <span style="font-weight: 500; color: var(--n500);">from ${buyer.city}</span>
      </div>
      <div style="font-size: .8rem; color: var(--g800); font-weight: 600; margin-top: 2px;">
        Purchased The N50K Blueprint
      </div>
      <div style="display: flex; align-items: center; gap: 6px; font-size: .72rem; color: var(--n400); font-weight: 600; margin-top: 4px;">
        <span>${TIMES[Math.floor(Math.random() * 3)]}</span>
        <span style="display: inline-flex; align-items: center; gap: 4px; color: var(--g600);">
          <span style="width: 6px; height: 6px; border-radius: 50%; background: var(--g500); display: inline-block; box-shadow: 0 0 0 2px rgba(46,139,87,.2);"></span>
          Verified Customer
        </span>
      </div>
    </div>
    <div style="position: absolute; top: -10px; right: -10px; font-size: 3rem; opacity: 0.04; pointer-events: none;">📗</div>
  `
  root.insertBefore(div, root.firstChild)

  setTimeout(() => {
    div.classList.add('out')
    setTimeout(() => { if (div.parentNode) div.parentNode.removeChild(div) }, 360)
  }, 6000)
}

let idx = 0
export function useToasts() {
  useEffect(() => {
    const delays = [7000, 14000, 22000, 33000, 45000]
    const timers = delays.map(d => setTimeout(() => fire(BUYERS[idx++ % BUYERS.length]), d))
    const recurring = setInterval(() => fire(BUYERS[idx++ % BUYERS.length]), 32000)
    return () => { timers.forEach(clearTimeout); clearInterval(recurring) }
  }, [])
}
