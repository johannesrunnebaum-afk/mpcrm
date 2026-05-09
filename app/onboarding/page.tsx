import Link from 'next/link'
import { CUSTOMERS, ONBOARDING_DATA, ONBOARDING_PHASES } from '@/lib/data'
import { Card } from '@/components/Card'
import Avatar from '@/components/Avatar'
import { PlanBadge } from '@/components/Badge'

export default function OnboardingPage() {
  return (
    <div style={{ padding: 28, overflow: 'auto', flex: 1 }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.3px' }}>Onboarding Pipeline</h2>
        <p style={{ color: '#6B6B6B', fontSize: 13, marginTop: 2 }}>Begleite jeden Kunden durch den Onboarding-Prozess</p>
      </div>

      <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 12 }}>
        {ONBOARDING_PHASES.map((phase) => {
          const cards = ONBOARDING_DATA.filter((o) => o.phase === phase)
          const isLast = phase === 'Abgeschlossen'
          return (
            <div key={phase} style={{ minWidth: 200, flex: '0 0 200px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontWeight: 700, fontSize: 13 }}>{phase}</span>
                <span
                  style={{
                    background: isLast ? '#DCFCE7' : '#F2F2F2',
                    color: isLast ? '#16A34A' : '#6B6B6B',
                    borderRadius: 20,
                    padding: '1px 8px',
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {cards.length}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {cards.map((o) => {
                  const cust = CUSTOMERS.find((c) => c.id === o.customerId)
                  if (!cust) return null
                  const done = o.steps.filter((s) => s.done).length
                  const total = o.steps.length
                  return (
                    <Link
                      key={o.id}
                      href={`/kunden/${cust.id}`}
                      style={{
                        background: '#FFFFFF',
                        border: '1px solid #E8E8E8',
                        borderRadius: 10,
                        padding: 14,
                        cursor: 'pointer',
                        display: 'block',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                        <Avatar initials={cust.initials} color={cust.color} size={28} />
                        <span style={{ fontWeight: 600, fontSize: 12, flex: 1, lineHeight: 1.3 }}>{cust.name}</span>
                      </div>
                      <div style={{ fontSize: 11, color: '#6B6B6B', marginBottom: 6 }}>{done}/{total} Schritte</div>
                      <div style={{ width: '100%', height: 4, background: '#F2F2F2', borderRadius: 2, overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${(done / total) * 100}%`,
                            height: '100%',
                            background: isLast ? '#16A34A' : '#7C3AED',
                            borderRadius: 2,
                          }}
                        />
                      </div>
                      <div style={{ marginTop: 8 }}>
                        <PlanBadge plan={cust.plan} />
                      </div>
                    </Link>
                  )
                })}
                {cards.length === 0 && (
                  <div
                    style={{
                      border: '2px dashed #E8E8E8',
                      borderRadius: 10,
                      padding: 20,
                      textAlign: 'center',
                      fontSize: 12,
                      color: '#ABABAB',
                    }}
                  >
                    Keine Kunden
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
