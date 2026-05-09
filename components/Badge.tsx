import type { CustomerStatus, Plan } from '@/lib/types'

interface BadgeProps {
  label: string
  color: string
  bg: string
}

export function Badge({ label, color, bg }: BadgeProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '3px 10px',
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
        color,
        background: bg,
      }}
    >
      {label}
    </span>
  )
}

export function StatusBadge({ status }: { status: CustomerStatus }) {
  if (status === 'Aktiv') return <Badge label="Aktiv" color="#16A34A" bg="#DCFCE7" />
  if (status === 'Gefährdet') return <Badge label="Gefährdet" color="#DC2626" bg="#FEE2E2" />
  return <Badge label={status} color="#6B6B6B" bg="#F2F2F2" />
}

export function PlanBadge({ plan }: { plan: Plan }) {
  const map: Record<Plan, [string, string]> = {
    Pro: ['#7C3AED', '#EDE9FE'],
    Business: ['#2563EB', '#DBEAFE'],
    Starter: ['#6B6B6B', '#F0F0F0'],
  }
  const [color, bg] = map[plan]
  return <Badge label={plan} color={color} bg={bg} />
}
