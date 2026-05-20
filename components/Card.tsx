import type { ReactNode, CSSProperties, MouseEventHandler } from 'react'

export const liquidGlass: CSSProperties = {
  background: 'rgba(255,255,255,0.18)',
  backdropFilter: 'blur(48px) saturate(180%)',
  WebkitBackdropFilter: 'blur(48px) saturate(180%)',
  borderRadius: 22,
  border: '1px solid rgba(255,255,255,0.45)',
  boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.65), inset 0 -1px 0 rgba(0,0,0,0.04), 0 8px 40px rgba(99,102,241,0.1), 0 2px 8px rgba(0,0,0,0.06)',
}

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
        ...liquidGlass,
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
      ...liquidGlass,
      padding: 20,
      minWidth: 0,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Accent glow blob */}
      <div style={{
        position: 'absolute', top: -20, right: -20, width: 80, height: 80,
        background: isGradient ? 'rgba(99,102,241,0.15)' : `${accent}22`,
        borderRadius: '50%',
        filter: 'blur(20px)',
        pointerEvents: 'none',
      }} />
      {/* Specular top line */}
      <div style={{
        position: 'absolute', top: 0, left: 16, right: 16, height: 1,
        background: isGradient ? accent : (accent || 'rgba(99,102,241,0.5)'),
        opacity: 0.5,
        borderRadius: '0 0 2px 2px',
      }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <span style={{ fontSize: 11, color: '#5A5F7A', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px' }}>{label}</span>
        {icon && (
          <div style={{
            width: 36, height: 36, borderRadius: 11,
            background: isGradient ? accent : (accent ? `${accent}20` : 'rgba(99,102,241,0.1)'),
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: isGradient ? '#fff' : (accent || '#6366F1'),
            boxShadow: accent ? `0 4px 14px ${isGradient ? 'rgba(99,102,241,0.35)' : accent + '44'}` : 'none',
            flexShrink: 0,
            backdropFilter: 'blur(8px)',
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
