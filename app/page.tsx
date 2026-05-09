import Link from 'next/link'
import { CUSTOMERS, ACTIVITIES } from '@/lib/data'
import { daysUntil, healthColor } from '@/lib/helpers'
import { Card, KpiCard } from '@/components/Card'
import Avatar from '@/components/Avatar'
import HealthBar from '@/components/HealthBar'
import { TrendsIcon, HealthIcon, RenewalsIcon, KundenIcon, WarningIcon, EmailIcon, PhoneIcon, NoteIcon } from '@/components/Icons'

export default function Dashboard() {
  const totalMrr = CUSTOMERS.reduce((s, c) => s + c.mrr, 0)
  const aktive = CUSTOMERS.filter((c) => c.status === 'Aktiv').length
  const gefaehrdet = CUSTOMERS.filter((c) => c.status === 'Gefährdet').length
  const avgHealth = Math.round(CUSTOMERS.reduce((s, c) => s + c.health, 0) / CUSTOMERS.length)
  const renewalSoon = CUSTOMERS.filter((c) => daysUntil(c.renewal) <= 60).length
  const avgNps = (CUSTOMERS.reduce((s, c) => s + c.nps, 0) / CUSTOMERS.length).toFixed(1)

  const today = new Date('2026-05-08')
  const dayName = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'][today.getDay()]
  const dayStr = today.toLocaleDateString('de-DE', { day: 'numeric', month: 'long' })

  const renewalsToday = CUSTOMERS.filter((c) => daysUntil(c.renewal) <= 0)

  const typeColor: Record<string, string> = { email: '#2563EB', call: '#16A34A', note: '#EA580C', system: '#6B6B6B' }
  const typeIcon: Record<string, React.ReactNode> = {
    email: <EmailIcon />, call: <PhoneIcon />, note: <NoteIcon />, system: <TrendsIcon />,
  }

  return (
    <div style={{ padding: 28, overflow: 'auto', flex: 1 }}>
      <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, letterSpacing: '-0.5px' }}>
        Guten Morgen! 👋
      </div>

      {/* Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
        <Card>
          <div style={{ fontSize: 12, color: '#7C3AED', fontWeight: 600, marginBottom: 4 }}>{dayName}</div>
          <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.5px' }}>{dayStr}</div>
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 11, color: '#6B6B6B', fontWeight: 500, marginBottom: 6 }}>HEUTE FÄLLIG</div>
            {renewalsToday.length === 0 ? (
              <div style={{ fontSize: 12, color: '#ABABAB', fontStyle: 'italic' }}>Keine Renewals heute</div>
            ) : renewalsToday.map((c) => (
              <div key={c.id} style={{ fontSize: 12, color: '#1A1A1A', fontWeight: 500, background: '#FEE2E2', padding: '4px 10px', borderRadius: 6, display: 'inline-block' }}>
                {c.name}
              </div>
            ))}
          </div>
        </Card>
        <KpiCard label="Gesamt MRR" value={`${totalMrr.toLocaleString('de-DE')} €`} sub={`${CUSTOMERS.length} aktive Verträge`} icon={<TrendsIcon />} accent="#FEF9C3" />
        <KpiCard label="Ø Health Score" value={avgHealth} sub={`${gefaehrdet} Kunden gefährdet`} icon={<HealthIcon />} accent={avgHealth >= 70 ? '#DCFCE7' : '#FFF0E5'} />
        <KpiCard label="Renewals (60 Tage)" value={renewalSoon} sub="Erfordern Aufmerksamkeit" icon={<RenewalsIcon />} accent={renewalSoon > 2 ? '#FEE2E2' : '#FFF0E5'} />
      </div>

      {/* Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
        <KpiCard label="Aktive Kunden" value={aktive} sub={`von ${CUSTOMERS.length} gesamt`} icon={<KundenIcon />} accent="#DCFCE7" />
        <KpiCard label="Gefährdete Kunden" value={gefaehrdet} sub="Health Score < 50" icon={<WarningIcon />} accent="#FEE2E2" />
        <KpiCard label="Ø NPS Score" value={avgNps} sub="Net Promoter Score" icon={<HealthIcon />} accent="#DBEAFE" />
      </div>

      {/* Row 3 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Health overview */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>Health Score Übersicht</span>
            <Link href="/health" style={{ fontSize: 12, color: '#7C3AED', fontWeight: 600, padding: '4px 10px', borderRadius: 6, background: '#EDE9FE' }}>
              Alle ansehen
            </Link>
          </div>
          {[...CUSTOMERS].sort((a, b) => a.health - b.health).map((c) => (
            <Link
              key={c.id}
              href={`/kunden/${c.id}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '8px 0',
                borderBottom: '1px solid #E8E8E8',
                cursor: 'pointer',
              }}
            >
              <Avatar initials={c.initials} color={c.color} size={28} />
              <span style={{ fontSize: 13, fontWeight: 500, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {c.name}
              </span>
              <HealthBar score={c.health} width={80} />
            </Link>
          ))}
        </Card>

        {/* Recent Activities */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>Letzte Aktivitäten</span>
            <Link href="/kommunikation" style={{ fontSize: 12, color: '#7C3AED', fontWeight: 600, padding: '4px 10px', borderRadius: 6, background: '#EDE9FE' }}>
              Alle ansehen
            </Link>
          </div>
          {ACTIVITIES.map((a) => {
            const cust = CUSTOMERS.find((c) => c.id === a.customerId)
            const col = typeColor[a.type]
            return (
              <div key={a.id} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid #E8E8E8' }}>
                <Avatar initials={a.initials} color={a.color} size={30} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.4, color: '#1A1A1A' }}>{a.text}</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: col, display: 'flex', alignItems: 'center', gap: 3 }}>
                      {typeIcon[a.type]}{a.type}
                    </span>
                    <span style={{ fontSize: 11, color: '#ABABAB' }}>·</span>
                    <span style={{ fontSize: 11, color: '#6B6B6B', fontWeight: 500 }}>{cust?.name}</span>
                    <span style={{ fontSize: 11, color: '#ABABAB' }}>· {a.date.split('-').reverse().join('.')}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </Card>
      </div>
    </div>
  )
}
