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
        background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFBFF 100%)',
        borderRadius: 16,
        border: '1px solid rgba(255,255,255,0.9)',
        boxShadow: '0 1px 2px rgba(0,0,0,0.03), 0 4px 20px rgba(99,102,241,0.06)',
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
  return (
    <Card style={{ minWidth: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <span style={{ fontSize: 11, color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{label}</span>
        {icon && (
          <div style={{ width: 34, height: 34, borderRadius: 10, background: accent || 'rgba(99,102,241,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent ? '#fff' : '#6366F1', boxShadow: accent ? `0 4px 10px ${accent}55` : 'none' }}>
            {icon}
          </div>
        )}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-1px', lineHeight: 1, color: '#0F0F1A' }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: '#6B7280', marginTop: 6 }}>{sub}</div>}
    </Card>
  )
}
