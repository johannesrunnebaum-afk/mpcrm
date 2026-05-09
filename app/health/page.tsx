import Link from 'next/link'
import { getCustomers } from '@/lib/db'
import { formatDate, healthColor, healthBg, healthLabel } from '@/lib/helpers'
import { Card } from '@/components/Card'
import Avatar from '@/components/Avatar'
import HealthBar from '@/components/HealthBar'

export default async function HealthPage() {
  const customers = await getCustomers()
  const sorted = [...customers].sort((a, b) => a.health - b.health)
  const gesund = customers.filter((c) => c.health >= 70).length
  const neutral = customers.filter((c) => c.health >= 40 && c.health < 70).length
  const gefaehrdet = customers.filter((c) => c.health < 40).length

  return (
    <div style={{ padding: 28, overflow: 'auto', flex: 1 }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.3px' }}>Health Scores</h2>
        <p style={{ color: '#6B6B6B', fontSize: 13, marginTop: 2 }}>Überwache die Gesundheit deiner Kunden in Echtzeit</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
        <Card style={{ borderLeft: '4px solid #16A34A', padding: '16px 20px' }}>
          <div style={{ fontSize: 11, color: '#16A34A', fontWeight: 700, marginBottom: 4 }}>GESUND (≥70)</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#16A34A' }}>{gesund}</div>
          <div style={{ fontSize: 12, color: '#6B6B6B', marginTop: 4 }}>Health Score über 70</div>
        </Card>
        <Card style={{ borderLeft: '4px solid #EA580C', padding: '16px 20px' }}>
          <div style={{ fontSize: 11, color: '#EA580C', fontWeight: 700, marginBottom: 4 }}>NEUTRAL (40–69)</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#EA580C' }}>{neutral}</div>
          <div style={{ fontSize: 12, color: '#6B6B6B', marginTop: 4 }}>Beobachten & unterstützen</div>
        </Card>
        <Card style={{ borderLeft: '4px solid #DC2626', padding: '16px 20px' }}>
          <div style={{ fontSize: 11, color: '#DC2626', fontWeight: 700, marginBottom: 4 }}>GEFÄHRDET (&lt;40)</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#DC2626' }}>{gefaehrdet}</div>
          <div style={{ fontSize: 12, color: '#6B6B6B', marginTop: 4 }}>Sofort Maßnahmen ergreifen!</div>
        </Card>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #E8E8E8', fontWeight: 700, fontSize: 14 }}>
          Alle Kunden nach Health Score
        </div>
        {sorted.map((c) => {
          const col = healthColor(c.health)
          const bg = healthBg(c.health)
          return (
            <Link key={c.id} href={`/kunden/${c.id}`} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', borderBottom: '1px solid #E8E8E8', cursor: 'pointer' }}>
              <Avatar initials={c.initials} color={c.color} size={38} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{c.name}</div>
                <HealthBar score={c.health} width={200} showLabel />
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 11, color: '#6B6B6B' }}>{c.plan} · {c.mrr} €/mo</div>
                <div style={{ fontSize: 11, color: '#6B6B6B', marginTop: 2 }}>Login: {formatDate(c.lastLogin)}</div>
              </div>
              <div style={{ padding: '4px 12px', borderRadius: 20, background: bg, color: col, fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
                {healthLabel(c.health)}
              </div>
              {c.health < 40 && (
                <button style={{ padding: '6px 12px', background: '#DC2626', color: '#fff', borderRadius: 7, fontWeight: 600, fontSize: 12, flexShrink: 0 }}>
                  Kontaktieren
                </button>
              )}
            </Link>
          )
        })}
      </Card>
    </div>
  )
}
