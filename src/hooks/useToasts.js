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
const TIMES = ['just now', '1 min ago', '2 mins ago', '5 mins ago', '8 mins ago', '12 mins ago', '15 mins ago', '22 mins ago', '34 mins ago', '45 mins ago', '1 hour ago']

function fire(buyer) {
  const root = document.getElementById('toast-root')
  if (!root) return

  // Prevent overlapping toasts
  const existing = document.querySelector('.toast');
  if (existing) {
    existing.classList.add('out');
    setTimeout(() => { if (existing.parentNode) existing.parentNode.removeChild(existing); }, 360);
  }

  const div = document.createElement('div')
  div.className = 'toast'
  const timeStr = TIMES[Math.floor(Math.random() * TIMES.length)]
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
    <div class="toast-time">${timeStr}</div>
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
    let timeoutId;
    
    const triggerNext = () => {
      fire(BUYERS[idx++ % BUYERS.length]);
      // random delay between 45s and 90s to significantly slow it down
      const nextDelay = Math.random() * 45000 + 45000;
      timeoutId = setTimeout(triggerNext, nextDelay);
    };

    // start the first one after 15 seconds
    timeoutId = setTimeout(triggerNext, 15000);

    return () => clearTimeout(timeoutId);
  }, [])
}
