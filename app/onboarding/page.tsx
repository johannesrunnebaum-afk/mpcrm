import Link from 'next/link'
import { getCustomers, getOnboardingData } from '@/lib/db'
import { ONBOARDING_PHASES } from '@/lib/data'
import { Card } from '@/components/Card'
import Avatar from '@/components/Avatar'
import { PlanBadge } from '@/components/Badge'

export default async function OnboardingPage() {
  const [customers, onboardingData] = await Promise.all([getCustomers(), getOnboardingData()])

  const phaseColors: Record<string, string> = {
    'Geplant': '#94A3B8',
    'In Bearbeitung': '#6366F1',
    'Review': '#F59E0B',
    'Abgeschlossen': '#10B981',
  }

  return (
    <div style={{ padding: 28, overflow: 'auto', flex: 1 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontWeight: 700, fontSize: 20, letterSpacing: '-0.5px', color: '#0F0F1A' }}>Onboarding Pipeline</h2>
        <p style={{ color: '#6B7280', fontSize: 13, marginTop: 2 }}>Begleite jeden Kunden durch den Onboarding-Prozess</p>
      </div>

      <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 12, alignItems: 'flex-start' }}>
        {ONBOARDING_PHASES.map((phase) => {
          const cards = onboardingData.filter((o) => o.phase === phase)
          const col = phaseColors[phase] ?? '#6366F1'
          const isDone = phase === 'Abgeschlossen'
          return (
            <div key={phase} style={{ minWidth: 220, flex: '0 0 220px' }}>
              {/* Column header */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12,
                padding: '10px 14px',
                background: 'rgba(255,255,255,0.55)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.8)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: col, boxShadow: `0 0 8px ${col}88`, flexShrink: 0 }} />
                <span style={{ fontWeight: 700, fontSize: 13, color: '#0F0F1A', flex: 1 }}>{phase}</span>
                <span style={{ background: `${col}20`, color: col, borderRadius: 20, padding: '1px 9px', fontSize: 11, fontWeight: 700 }}>{cards.length}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {cards.map((o) => {
                  const cust = customers.find((c) => c.id === o.customerId)
                  if (!cust) return null
                  const done = o.steps.filter((s) => s.done).length
                  const total = o.steps.length
                  const pct = total > 0 ? Math.round((done / total) * 100) : 0
                  return (
                    <Link key={o.id} href={`/kunden/${cust.id}`} style={{ display: 'block' }}>
                      <div style={{
                        background: 'rgba(255,255,255,0.7)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.9)',
                        borderRadius: 14,
                        padding: 14,
                        boxShadow: '0 2px 8px rgba(99,102,241,0.06)',
                        transition: 'transform 0.15s, box-shadow 0.15s',
                      }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(99,102,241,0.14)' }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(99,102,241,0.06)' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                          <Avatar initials={cust.initials} color={cust.color} size={28} />
                          <span style={{ fontWeight: 600, fontSize: 12, flex: 1, lineHeight: 1.3, color: '#0F0F1A' }}>{cust.name}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span style={{ fontSize: 11, color: '#6B7280' }}>{done}/{total} Schritte</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: col }}>{pct}%</span>
                        </div>
                        <div style={{ width: '100%', height: 5, background: 'rgba(0,0,0,0.07)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: isDone ? '#10B981' : col, borderRadius: 3, boxShadow: `0 0 6px ${col}66`, transition: 'width 0.3s' }} />
                        </div>
                        <div style={{ marginTop: 10 }}><PlanBadge plan={cust.plan} /></div>
                      </div>
                    </Link>
                  )
                })}
                {cards.length === 0 && (
                  <div style={{ border: '2px dashed rgba(99,102,241,0.15)', borderRadius: 14, padding: 20, textAlign: 'center', fontSize: 12, color: '#A0A8B8', background: 'rgba(99,102,241,0.02)' }}>
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
