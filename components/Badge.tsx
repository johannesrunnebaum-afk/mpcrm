import type { CustomerStatus, Plan } from '@/lib/types'

interface BadgeProps {
  label: string
  color: string
  bg: string
  glow?: string
}

export function Badge({ label, color, bg, glow }: BadgeProps) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
      color, background: bg,
      boxShadow: glow ? `0 2px 8px ${glow}` : 'none',
      letterSpacing: '0.1px',
    }}>
      {label}
    </span>
  )
}

export function StatusBadge({ status }: { status: CustomerStatus }) {
  if (status === 'Aktiv') return <Badge label="● Aktiv" color="#16A34A" bg="rgba(22,163,74,0.1)" glow="rgba(22,163,74,0.15)" />
  if (status === 'Gefährdet') return <Badge label="● Gefährdet" color="#EF4444" bg="rgba(239,68,68,0.1)" glow="rgba(239,68,68,0.15)" />
  return <Badge label={status} color="#6B7280" bg="rgba(107,114,128,0.1)" />
}

export function PlanBadge({ plan }: { plan: Plan }) {
  const map: Record<Plan, [string, string, string]> = {
    Free:     ['#A0A8B8', 'rgba(160,168,184,0.12)', ''],
    Starter:  ['#6B7280', 'rgba(107,114,128,0.1)',  ''],
    Pro:      ['#6366F1', 'rgba(99,102,241,0.1)',   'rgba(99,102,241,0.2)'],
    Business: ['#0EA5E9', 'rgba(14,165,233,0.1)',   'rgba(14,165,233,0.2)'],
  }
  const [color, bg, glow] = map[plan] ?? map['Starter']
  return <Badge label={plan} color={color} bg={bg} glow={glow} />
}
