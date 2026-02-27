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
  div.innerHTML = `
    <div class="toast-av">${buyer.i}</div>
    <div class="toast-body">
      <div class="toast-name">${buyer.name} from ${buyer.city}</div>
      <div class="toast-msg">📗 Just purchased The N50K Blueprint</div>
      <div style="display: flex; align-items: center; gap: 4px; color: var(--g600); font-size: 0.72rem; font-weight: 600; margin-top: 2px;">
        <span style="width: 6px; height: 6px; border-radius: 50%; background: var(--g500); display: inline-block;"></span>
        Verified Customer
      </div>
    </div>
    <div class="toast-time">${TIMES[Math.floor(Math.random() * 3)]}</div>
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
