export default function ProgressBar({ pct = 73 }) {
  const left = 100 - pct
  return (
    <div>
      <div className="progress-wrap">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <p style={{ textAlign: 'center', fontSize: '.8rem', color: 'var(--red)', fontWeight: 700, marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <span>Only {left} copies remaining at this price!</span>
      </p>
    </div>
  )
}
