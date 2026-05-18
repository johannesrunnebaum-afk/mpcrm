import { Card } from '@/components/Card'

export default function HilfePage() {
  return (
    <div style={{ padding: 28, flex: 1, overflow: 'auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontWeight: 700, fontSize: 20, letterSpacing: '-0.5px', color: '#0F0F1A' }}>Hilfe & Support</h2>
        <p style={{ color: '#6B7280', fontSize: 13, marginTop: 2 }}>Anleitungen und Kontakt</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {[
          { title: 'Erste Schritte', desc: 'Lerne die wichtigsten Funktionen des CRM kennen.', icon: '🚀', color: '#6366F1' },
          { title: 'Kunden verwalten', desc: 'Wie du Kunden anlegst, bearbeitest und löschst.', icon: '👥', color: '#10B981' },
          { title: 'Health Scores', desc: 'Verstehe und optimiere den Gesundheitsstatus deiner Kunden.', icon: '📊', color: '#F59E0B' },
          { title: 'Renewals', desc: 'Behalte fällige Verlängerungen im Blick.', icon: '🔄', color: '#0EA5E9' },
        ].map((item) => (
          <Card key={item.title} style={{ cursor: 'pointer', transition: 'box-shadow 0.2s' }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: item.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                {item.icon}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#0F0F1A', marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}>{item.desc}</div>
                <div style={{ marginTop: 10, fontSize: 12, color: item.color, fontWeight: 600 }}>Mehr erfahren →</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card style={{ marginTop: 16 }}>
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>💬</div>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#0F0F1A', marginBottom: 6 }}>Brauchst du weitere Hilfe?</div>
          <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 16 }}>Unser Support-Team ist für dich da.</div>
          <button style={{ padding: '9px 22px', background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', color: '#fff', borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: 'pointer', border: 'none', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>
            Support kontaktieren
          </button>
        </div>
      </Card>
    </div>
  )
}
