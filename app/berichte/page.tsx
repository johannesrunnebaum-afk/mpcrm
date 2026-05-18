import { getCustomers } from '@/lib/db'
import { Card, KpiCard } from '@/components/Card'
import Avatar from '@/components/Avatar'

export default async function BerichtePage() {
  const customers = await getCustomers()

  const totalMrr = customers.reduce((s, c) => s + c.mrr, 0)
  const avgHealth = Math.round(customers.reduce((s, c) => s + c.health, 0) / customers.length)
  const churnRisk = customers.filter((c) => c.status === 'Gefährdet').length
  const churnRate = Math.round((churnRisk / customers.length) * 100)

  const planDist = { Pro: 0, Business: 0, Starter: 0 } as Record<string, number>
  const mrrByPlan = { Pro: 0, Business: 0, Starter: 0 } as Record<string, number>
  customers.forEach((c) => { planDist[c.plan]++; mrrByPlan[c.plan] += c.mrr })

  const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai']
  const mrrData = [2200, 2499, 2599, 2794, 2893]
  const maxMrr = Math.max(...mrrData)

  const healthDist = [
    { label: 'Gesund (70–100)', count: customers.filter((c) => c.health >= 70).length, color: '#10B981' },
    { label: 'Neutral (40–69)', count: customers.filter((c) => c.health >= 40 && c.health < 70).length, color: '#F59E0B' },
    { label: 'Gefährdet (0–39)', count: customers.filter((c) => c.health < 40).length, color: '#EF4444' },
  ]

  const planColors: Record<string, string> = { Pro: '#6366F1', Business: '#0EA5E9', Starter: '#94A3B8' }
  const planBg: Record<string, string> = { Pro: 'rgba(99,102,241,0.1)', Business: 'rgba(14,165,233,0.1)', Starter: 'rgba(148,163,184,0.1)' }

  return (
    <div style={{ padding: 28, overflow: 'auto', flex: 1 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontWeight: 700, fontSize: 20, letterSpacing: '-0.5px', color: '#0F0F1A' }}>Berichte & Analytics</h2>
        <p style={{ color: '#6B7280', fontSize: 13, marginTop: 2 }}>Übersicht über dein Customer-Portfolio</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
        <KpiCard label="Gesamt MRR" value={`${totalMrr.toLocaleString('de-DE')} €`} sub="+3.6% zum Vormonat" icon={null} accent="linear-gradient(135deg,#6366F1,#8B5CF6)" />
        <KpiCard label="ARR (Jahresumsatz)" value={`${(totalMrr * 12).toLocaleString('de-DE')} €`} sub="Hochgerechnet" icon={null} accent="#0EA5E9" />
        <KpiCard label="Ø Health Score" value={avgHealth} sub={`${customers.length} Kunden`} icon={null} accent={avgHealth >= 70 ? '#10B981' : '#F59E0B'} />
        <KpiCard label="Churn-Risiko" value={`${churnRate}%`} sub={`${churnRisk} von ${customers.length} Kunden`} icon={null} accent="#EF4444" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <Card>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, color: '#0F0F1A' }}>MRR Entwicklung</div>
          <svg width="100%" height="160" viewBox="0 0 400 160">
            {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
              <line key={i} x1="40" y1={140 - t * 120} x2="400" y2={140 - t * 120} stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
            ))}
            <defs>
              <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366F1" stopOpacity=".25" />
                <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={`M${mrrData.map((v, i) => `${40 + i * 80},${140 - (v / maxMrr) * 120}`).join(' L')} L${40 + (mrrData.length - 1) * 80},140 L40,140 Z`} fill="url(#mrrGrad)" />
            <polyline points={mrrData.map((v, i) => `${40 + i * 80},${140 - (v / maxMrr) * 120}`).join(' ')} fill="none" stroke="#6366F1" strokeWidth="2.5" strokeLinejoin="round" />
            {mrrData.map((v, i) => <circle key={i} cx={40 + i * 80} cy={140 - (v / maxMrr) * 120} r="4" fill="#6366F1" />)}
            {months.map((m, i) => <text key={i} x={40 + i * 80} y="158" textAnchor="middle" fontSize="11" fill="#A0A8B8">{m}</text>)}
            {mrrData.map((v, i) => <text key={i} x={40 + i * 80} y={130 - (v / maxMrr) * 120} textAnchor="middle" fontSize="10" fill="#6366F1" fontWeight="600">{v}€</text>)}
          </svg>
        </Card>

        <Card>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, color: '#0F0F1A' }}>Health Score Verteilung</div>
          {healthDist.map((h) => (
            <div key={h.label} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 12 }}>
                <span style={{ color: '#6B7280' }}>{h.label}</span>
                <span style={{ fontWeight: 700, color: h.color }}>{h.count} Kunden</span>
              </div>
              <div style={{ width: '100%', height: 8, background: 'rgba(0,0,0,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${(h.count / customers.length) * 100}%`, height: '100%', background: h.color, borderRadius: 4, boxShadow: `0 0 6px ${h.color}66` }} />
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            {healthDist.map((h) => (
              <div key={h.label} style={{ flex: 1, textAlign: 'center', background: h.color + '12', borderRadius: 12, padding: '12px 8px' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: h.color }}>{h.count}</div>
                <div style={{ fontSize: 10, color: h.color, fontWeight: 700, marginTop: 2, letterSpacing: '0.3px' }}>{h.label.split(' ')[0].toUpperCase()}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, color: '#0F0F1A' }}>Plan-Verteilung & MRR</div>
          {Object.entries(planDist).map(([plan, count]) => (
            <div key={plan} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: planBg[plan], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: planColors[plan] }}>{plan[0]}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: '#0F0F1A' }}>{plan}</div>
                <div style={{ fontSize: 11, color: '#6B7280' }}>{count} Kunden · {mrrByPlan[plan].toLocaleString('de-DE')} €/mo</div>
              </div>
              <div style={{ width: 80, height: 6, background: 'rgba(0,0,0,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${(count / customers.length) * 100}%`, height: '100%', background: planColors[plan], borderRadius: 3, boxShadow: `0 0 6px ${planColors[plan]}66` }} />
              </div>
              <span style={{ fontWeight: 700, fontSize: 13, minWidth: 32, textAlign: 'right', color: '#0F0F1A' }}>{count}</span>
            </div>
          ))}
        </Card>

        <Card>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, color: '#0F0F1A' }}>Top & Risiko Kunden</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#10B981', marginBottom: 8, letterSpacing: '0.5px' }}>TOP PERFORMER</div>
          {[...customers].sort((a, b) => b.health - a.health).slice(0, 3).map((c) => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0' }}>
              <Avatar initials={c.initials} color={c.color} size={28} />
              <span style={{ flex: 1, fontSize: 12, fontWeight: 500, color: '#0F0F1A' }}>{c.name}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#10B981' }}>{c.health}</span>
            </div>
          ))}
          <div style={{ height: 1, background: 'rgba(0,0,0,0.06)', margin: '12px 0' }} />
          <div style={{ fontSize: 11, fontWeight: 700, color: '#EF4444', marginBottom: 8, letterSpacing: '0.5px' }}>CHURN RISIKO</div>
          {[...customers].sort((a, b) => a.health - b.health).slice(0, 3).map((c) => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0' }}>
              <Avatar initials={c.initials} color={c.color} size={28} />
              <span style={{ flex: 1, fontSize: 12, fontWeight: 500, color: '#0F0F1A' }}>{c.name}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#EF4444' }}>{c.health}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}
