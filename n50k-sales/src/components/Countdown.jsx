import { useCountdown } from '../hooks/useCountdown'

export default function Countdown() {
  const { h, m, s } = useCountdown()
  return (
    <div className="countdown">
      <div className="countdown-unit">
        <span className="countdown-num">{h}</span>
        <span className="countdown-label">Hours</span>
      </div>
      <span className="countdown-sep">:</span>
      <div className="countdown-unit">
        <span className="countdown-num">{m}</span>
        <span className="countdown-label">Mins</span>
      </div>
      <span className="countdown-sep">:</span>
      <div className="countdown-unit">
        <span className="countdown-num">{s}</span>
        <span className="countdown-label">Secs</span>
      </div>
    </div>
  )
}
