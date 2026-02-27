export default function BookCover() {
  return (
    <div className="book-3d">
      <div className="book-price">₦50K</div>
      <div className="book-title-text">BLUEPRINT</div>
      <div className="book-sub-text">Start · Build · Earn</div>
      <div className="book-line" />
      <div className="book-author">By Nnanta Precious</div>
      <div style={{
        position: 'absolute', top: 10, right: 10,
        background: 'var(--red)', color: '#fff',
        borderRadius: '50%', width: 46, height: 46,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        fontSize: '.56rem', fontWeight: 900, textAlign: 'center', lineHeight: 1.2,
        textTransform: 'uppercase', border: '2px solid rgba(255,255,255,.3)',
        animation: 'spin-slow 10s linear infinite',
      }}>
        NEW<br />2026
      </div>
      <style>{`@keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  )
}
