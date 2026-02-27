export default function ProgressBar({ pct = 73 }) {
  const left = 100 - pct
  return (
    <div>
      <div className="progress-wrap">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <p style={{ textAlign: 'center', fontSize: '.8rem', color: 'var(--red)', fontWeight: 700, marginTop: 8 }}>
        ⚠️ Only {left} copies remaining at this price!
      </p>
    </div>
  )
}
