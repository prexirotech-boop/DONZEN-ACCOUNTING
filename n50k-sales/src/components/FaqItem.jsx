import { useState } from 'react'

export default function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`faq-item${open ? ' open' : ''}`}>
      <button className="faq-q" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <span>{q}</span>
        <span className="faq-icon">+</span>
      </button>
      <div className="faq-a" aria-hidden={!open}>
        <div className="faq-a-inner">{a}</div>
      </div>
    </div>
  )
}
