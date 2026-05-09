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
        background: '#FFFFFF',
        borderRadius: 12,
        border: '1px solid #E8E8E8',
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
        <span style={{ fontSize: 12, color: '#6B6B6B', fontWeight: 500 }}>{label}</span>
        {icon && (
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: accent || '#F2F2F2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6B6B6B',
            }}
          >
            {icon}
          </div>
        )}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-1px', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: '#6B6B6B', marginTop: 6 }}>{sub}</div>}
    </Card>
  )
}
