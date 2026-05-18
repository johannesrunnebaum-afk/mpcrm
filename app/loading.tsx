export default function Loading() {
  return (
    <div style={{ padding: 28, flex: 1 }}>
      {[1, 2, 3].map((i) => (
        <div key={i} style={{ height: 60, background: '#E8E8E8', borderRadius: 10, marginBottom: 12, animation: 'pulse 1.2s ease-in-out infinite' }} />
      ))}
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }`}</style>
    </div>
  )
}
