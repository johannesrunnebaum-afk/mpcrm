import type { ReactNode, CSSProperties, MouseEventHandler } from 'react'

interface CardProps {
  children: ReactNode
  style?: CSSProperties
  onClick?: MouseEventHandler<HTMLDivElement>
}

export function Card({ children, style = {}, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: 18,
        border: '1px solid rgba(255,255,255,0.85)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.04), 0 8px 32px rgba(99,102,241,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
        padding: 20,
        cursor: onClick ? 'pointer' : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

interface KpiCardProps {
  label: string
  value: string | number
  sub?: string
  icon?: ReactNode
  accent?: string
}

export function KpiCard({ label, value, sub, icon, accent }: KpiCardProps) {
  const isGradient = accent?.startsWith('linear-gradient')
  return (
    <div style={{
      background: 'rgba(255,255,255,0.72)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRadius: 18,
      border: '1px solid rgba(255,255,255,0.85)',
      boxShadow: '0 2px 4px rgba(0,0,0,0.04), 0 8px 32px rgba(99,102,241,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
      padding: 20,
      minWidth: 0,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* subtle top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 20, right: 20, height: 2, borderRadius: '0 0 2px 2px',
        background: isGradient ? accent : (accent || 'rgba(99,102,241,0.3)'),
        opacity: 0.7,
      }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <span style={{ fontSize: 11, color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
        {icon && (
          <div style={{
            width: 36, height: 36, borderRadius: 11,
            background: isGradient ? accent : (accent ? `${accent}18` : 'rgba(99,102,241,0.08)'),
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: isGradient ? '#fff' : (accent || '#6366F1'),
            boxShadow: accent ? `0 4px 12px ${isGradient ? 'rgba(99,102,241,0.3)' : accent + '44'}` : 'none',
            flexShrink: 0,
          }}>
            {icon}
          </div>
        )}
      </div>
      <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1, color: '#0F0F1A' }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: '#6B7280', marginTop: 7 }}>{sub}</div>}
    </div>
  )
}
