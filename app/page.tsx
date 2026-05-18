import Link from 'next/link'
import { getCustomers, getActivities } from '@/lib/db'
import { daysUntil, formatDate } from '@/lib/helpers'
import { Card, KpiCard } from '@/components/Card'
import Avatar from '@/components/Avatar'
import HealthBar from '@/components/HealthBar'
import { TrendsIcon, HealthIcon, RenewalsIcon, KundenIcon, WarningIcon, EmailIcon, PhoneIcon, NoteIcon } from '@/components/Icons'

export default async function Dashboard() {
  const [customers, activities] = await Promise.all([getCustomers(), getActivities({ limit: 8 })])

  const totalMrr = customers.reduce((s, c) => s + c.mrr, 0)
  const aktive = customers.filter((c) => c.status === 'Aktiv').length
  const gefaehrdet = customers.filter((c) => c.status === 'Gefährdet').length
  const avgHealth = Math.round(customers.reduce((s, c) => s + c.health, 0) / customers.length)
  const renewalSoon = customers.filter((c) => daysUntil(c.renewal) <= 60).length
  const avgNps = (customers.reduce((s, c) => s + c.nps, 0) / customers.length).toFixed(1)

  const today = new Date()
  const dayName = ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'][today.getDay()]
  const dayStr = today.toLocaleDateString('de-DE', { day: 'numeric', month: 'long' })
  const renewalsToday = customers.filter((c) => daysUntil(c.renewal) <= 0)

  const typeColor: Record<string, string> = { email: '#6366F1', call: '#10B981', note: '#F59E0B', system: '#94A3B8' }
  const typeIcon: Record<string, React.ReactNode> = { email: <EmailIcon />, call: <PhoneIcon />, note: <NoteIcon />, system: <TrendsIcon /> }

  return (
    <div style={{ padding: 28, overflow: 'auto', flex: 1 }}>
      <div style={{ fontSize: 26, fontWeight: 700, marginBottom: 6, letterSpacing: '-0.5px', color: '#0F0F1A' }}>
        Guten Morgen! 👋
      </div>
      <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 28 }}>{dayName}, {dayStr}</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
        <KpiCard label="Gesamt MRR" value={`${totalMrr.toLocaleString('de-DE')} €`} sub={`${customers.length} aktive Verträge`} icon={<TrendsIcon />} accent="linear-gradient(135deg,#6366F1,#8B5CF6)" />
        <KpiCard label="Ø Health Score" value={avgHealth} sub={`${gefaehrdet} Kunden gefährdet`} icon={<HealthIcon />} accent={avgHealth >= 70 ? '#10B981' : '#F59E0B'} />
        <KpiCard label="Renewals bald fällig" value={renewalSoon} sub="In den nächsten 60 Tagen" icon={<RenewalsIcon />} accent={renewalSoon > 1 ? '#EF4444' : '#F59E0B'} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 24 }}>
        <KpiCard label="Aktive Kunden" value={aktive} sub={`von ${customers.length} gesamt`} icon={<KundenIcon />} accent="#10B981" />
        <KpiCard label="Gefährdete Kunden" value={gefaehrdet} sub="Health Score unter 50" icon={<WarningIcon />} accent="#EF4444" />
        <KpiCard label="Ø NPS Score" value={avgNps} sub="Net Promoter Score" icon={<HealthIcon />} accent="#6366F1" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: '#0F0F1A' }}>Health Score Übersicht</span>
            <Link href="/health" style={{ fontSize: 12, color: '#6366F1', fontWeight: 600, padding: '4px 12px', borderRadius: 8, background: 'rgba(99,102,241,0.08)' }}>
              Alle ansehen →
            </Link>
          </div>
          {[...customers].sort((a, b) => a.health - b.health).map((c) => (
            <Link key={c.id} href={`/kunden/${c.id}`} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
              <Avatar initials={c.initials} color={c.color} size={28} />
              <span style={{ fontSize: 13, fontWeight: 500, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#0F0F1A' }}>{c.name}</span>
              <HealthBar score={c.health} width={80} />
            </Link>
          ))}
        </Card>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: '#0F0F1A' }}>Letzte Aktivitäten</span>
            <Link href="/kommunikation" style={{ fontSize: 12, color: '#6366F1', fontWeight: 600, padding: '4px 12px', borderRadius: 8, background: 'rgba(99,102,241,0.08)' }}>
              Alle ansehen →
            </Link>
          </div>
          {activities.map((a) => {
            const cust = customers.find((c) => c.id === a.customerId)
            const col = typeColor[a.type]
            return (
              <div key={a.id} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <Avatar initials={a.initials} color={a.color} size={30} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.4, color: '#0F0F1A' }}>{a.text}</div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 4, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11, color: col, display: 'flex', alignItems: 'center', gap: 3, background: col + '18', padding: '1px 7px', borderRadius: 20, fontWeight: 600 }}>{typeIcon[a.type]}{a.type}</span>
                    <span style={{ fontSize: 11, color: '#6B7280', fontWeight: 500 }}>{cust?.name}</span>
                    <span style={{ fontSize: 11, color: '#A0A8B8' }}>{a.date.split('-').reverse().join('.')}</span>
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
