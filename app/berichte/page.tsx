import { CUSTOMERS } from '@/lib/data'
import { Card, KpiCard } from '@/components/Card'
import Avatar from '@/components/Avatar'

export default function BerichtePage() {
  const totalMrr = CUSTOMERS.reduce((s, c) => s + c.mrr, 0)
  const avgHealth = Math.round(CUSTOMERS.reduce((s, c) => s + c.health, 0) / CUSTOMERS.length)
  const churnRisk = CUSTOMERS.filter((c) => c.status === 'Gefährdet').length
  const churnRate = Math.round((churnRisk / CUSTOMERS.length) * 100)

  const planDist = { Pro: 0, Business: 0, Starter: 0 } as Record<string, number>
  const mrrByPlan = { Pro: 0, Business: 0, Starter: 0 } as Record<string, number>
  CUSTOMERS.forEach((c) => {
    planDist[c.plan]++
    mrrByPlan[c.plan] += c.mrr
  })

  const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai']
  const mrrData = [2200, 2499, 2599, 2794, 2893]
  const maxMrr = Math.max(...mrrData)

  const healthDist = [
    { label: 'Gesund (70–100)', count: CUSTOMERS.filter((c) => c.health >= 70).length, color: '#16A34A' },
    { label: 'Neutral (40–69)', count: CUSTOMERS.filter((c) => c.health >= 40 && c.health < 70).length, color: '#EA580C' },
    { label: 'Gefährdet (0–39)', count: CUSTOMERS.filter((c) => c.health < 40).length, color: '#DC2626' },
  ]

  const planColors: Record<string, string> = { Pro: '#7C3AED', Business: '#2563EB', Starter: '#6B6B6B' }
  const planBg: Record<string, string> = { Pro: '#EDE9FE', Business: '#DBEAFE', Starter: '#F0F0F0' }

  return (
    <div style={{ padding: 28, overflow: 'auto', flex: 1 }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.3px' }}>Berichte & Analytics</h2>
        <p style={{ color: '#6B6B6B', fontSize: 13, marginTop: 2 }}>Übersicht über dein Customer-Portfolio</p>
      </div>

      {/* Top KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
        <KpiCard label="Gesamt MRR" value={`${totalMrr.toLocaleString('de-DE')} €`} sub="+3.6% zum Vormonat" />
        <KpiCard label="ARR (Jahresumsatz)" value={`${(totalMrr * 12).toLocaleString('de-DE')} €`} sub="Hochgerechnet" />
        <KpiCard label="Ø Health Score" value={avgHealth} sub={`${CUSTOMERS.length} Kunden`} />
        <KpiCard label="Churn-Risiko" value={`${churnRate}%`} sub={`${churnRisk} von ${CUSTOMERS.length} Kunden`} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* MRR Chart */}
        <Card>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>MRR Entwicklung</div>
          <svg width="100%" height="160" viewBox="0 0 400 160">
            {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
              <line key={i} x1="40" y1={140 - t * 120} x2="400" y2={140 - t * 120} stroke="#E8E8E8" strokeWidth="1" />
            ))}
            <defs>
              <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C8FF00" stopOpacity=".4" />
                <stop offset="100%" stopColor="#C8FF00" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d={`M${mrrData.map((v, i) => `${40 + i * 80},${140 - (v / maxMrr) * 120}`).join(' L')} L${40 + (mrrData.length - 1) * 80},140 L40,140 Z`}
              fill="url(#mrrGrad)"
            />
            <polyline
              points={mrrData.map((v, i) => `${40 + i * 80},${140 - (v / maxMrr) * 120}`).join(' ')}
              fill="none"
              stroke="#1A1A1A"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {mrrData.map((v, i) => (
              <circle key={i} cx={40 + i * 80} cy={140 - (v / maxMrr) * 120} r="4" fill="#1A1A1A" />
            ))}
            {months.map((m, i) => (
              <text key={i} x={40 + i * 80} y="158" textAnchor="middle" fontSize="11" fill="#6B6B6B">{m}</text>
            ))}
            {mrrData.map((v, i) => (
              <text key={i} x={40 + i * 80} y={130 - (v / maxMrr) * 120} textAnchor="middle" fontSize="10" fill="#1A1A1A" fontWeight="600">
                {v}€
              </text>
            ))}
          </svg>
        </Card>

        {/* Health Distribution */}
        <Card>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Health Score Verteilung</div>
          {healthDist.map((h) => (
            <div key={h.label} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 12 }}>
                <span style={{ color: '#6B6B6B' }}>{h.label}</span>
                <span style={{ fontWeight: 700, color: h.color }}>{h.count} Kunden</span>
              </div>
              <div style={{ width: '100%', height: 8, background: '#F2F2F2', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${(h.count / CUSTOMERS.length) * 100}%`, height: '100%', background: h.color, borderRadius: 4 }} />
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            {healthDist.map((h) => (
              <div key={h.label} style={{ flex: 1, textAlign: 'center', background: h.color + '18', borderRadius: 10, padding: '12px 8px' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: h.color }}>{h.count}</div>
                <div style={{ fontSize: 10, color: h.color, fontWeight: 600, marginTop: 2 }}>{h.label.split(' ')[0]}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Plan Distribution */}
        <Card>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Plan-Verteilung & MRR</div>
          {Object.entries(planDist).map(([plan, count]) => (
            <div key={plan} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #E8E8E8' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: planBg[plan], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: planColors[plan] }}>{plan[0]}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{plan}</div>
                <div style={{ fontSize: 11, color: '#6B6B6B' }}>{count} Kunden · {mrrByPlan[plan]} €/mo</div>
              </div>
              <div style={{ width: 80, height: 6, background: '#F2F2F2', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${(count / CUSTOMERS.length) * 100}%`, height: '100%', background: planColors[plan], borderRadius: 3 }} />
              </div>
              <span style={{ fontWeight: 700, fontSize: 13, minWidth: 32, textAlign: 'right' }}>{count}</span>
            </div>
          ))}
        </Card>

        {/* Top & Bottom Performers */}
        <Card>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Top & Risiko Kunden</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#16A34A', marginBottom: 8, letterSpacing: '0.5px' }}>TOP PERFORMER</div>
          {[...CUSTOMERS].sort((a, b) => b.health - a.health).slice(0, 3).map((c) => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0' }}>
              <Avatar initials={c.initials} color={c.color} size={28} />
              <span style={{ flex: 1, fontSize: 12, fontWeight: 500 }}>{c.name}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#16A34A' }}>{c.health}</span>
            </div>
          ))}
          <div style={{ height: 1, background: '#E8E8E8', margin: '10px 0' }} />
          <div style={{ fontSize: 11, fontWeight: 700, color: '#DC2626', marginBottom: 8, letterSpacing: '0.5px' }}>CHURN RISIKO</div>
          {[...CUSTOMERS].sort((a, b) => a.health - b.health).slice(0, 3).map((c) => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0' }}>
              <Avatar initials={c.initials} color={c.color} size={28} />
              <span style={{ flex: 1, fontSize: 12, fontWeight: 500 }}>{c.name}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#DC2626' }}>{c.health}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}
