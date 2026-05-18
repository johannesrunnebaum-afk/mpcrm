'use client'

import { useState } from 'react'
import { Card } from '@/components/Card'

const sections = ['Profil', 'Team', 'Benachrichtigungen', 'Integrationen']

export default function EinstellungenPage() {
  const [section, setSection] = useState('Profil')
  const [saved, setSaved] = useState(false)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ padding: 28, flex: 1, overflow: 'auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.3px' }}>Einstellungen</h2>
        <p style={{ color: '#6B6B6B', fontSize: 13, marginTop: 2 }}>Verwalte dein Profil und deine Präferenzen</p>
      </div>

      <div style={{ display: 'flex', gap: 24 }}>
        <div style={{ width: 180, flexShrink: 0 }}>
          <Card style={{ padding: '8px 0' }}>
            {sections.map((s) => (
              <button key={s} onClick={() => setSection(s)}
                style={{ display: 'block', width: '100%', textAlign: 'left', padding: '9px 16px', fontWeight: section === s ? 600 : 400, fontSize: 13, color: section === s ? '#1A1A1A' : '#6B6B6B', background: section === s ? '#F5F0FF' : 'transparent', borderLeft: section === s ? '3px solid #7C3AED' : '3px solid transparent', cursor: 'pointer', border: 'none', borderLeftWidth: 3, borderLeftStyle: 'solid', borderLeftColor: section === s ? '#7C3AED' : 'transparent' }}>
                {s}
              </button>
            ))}
          </Card>
        </div>

        <div style={{ flex: 1 }}>
          {section === 'Profil' && (
            <Card>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20 }}>Profil bearbeiten</div>
              <form onSubmit={handleSave}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#F59E0B', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 22 }}>JR</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>Johannes Runnebaum</div>
                    <div style={{ fontSize: 12, color: '#6B6B6B', marginTop: 2 }}>johannes.runnebaum@gmail.com</div>
                  </div>
                </div>
                {[['Vorname', 'Johannes'], ['Nachname', 'Runnebaum'], ['E-Mail', 'johannes.runnebaum@gmail.com'], ['Rolle', 'Admin']].map(([label, def]) => (
                  <div key={label} style={{ marginBottom: 14 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6B6B6B', marginBottom: 5 }}>{label}</label>
                    <input defaultValue={def} style={{ width: '100%', padding: '8px 12px', border: '1px solid #E8E8E8', borderRadius: 8, fontSize: 13, outline: 'none', background: '#FAFAFA', boxSizing: 'border-box' }} />
                  </div>
                ))}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20 }}>
                  <button type="submit" style={{ padding: '8px 20px', background: '#1A1A1A', color: '#fff', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer', border: 'none' }}>Speichern</button>
                  {saved && <span style={{ fontSize: 13, color: '#16A34A', fontWeight: 500 }}>✓ Gespeichert</span>}
                </div>
              </form>
            </Card>
          )}

          {section === 'Team' && (
            <Card>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20 }}>Team-Mitglieder</div>
              {[
                { name: 'Johannes Runnebaum', email: 'johannes.runnebaum@gmail.com', role: 'Admin', color: '#F59E0B' },
                { name: 'Lisa Müller', email: 'l.mueller@mpilot.de', role: 'CSM', color: '#7C3AED' },
                { name: 'Tom Kraft', email: 't.kraft@mpilot.de', role: 'CSM', color: '#2563EB' },
              ].map((m) => (
                <div key={m.email} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: '1px solid #E8E8E8' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: m.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>
                    {m.name.split(' ').map((w) => w[0]).join('')}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{m.name}</div>
                    <div style={{ fontSize: 12, color: '#6B6B6B' }}>{m.email}</div>
                  </div>
                  <span style={{ padding: '3px 10px', borderRadius: 20, background: m.role === 'Admin' ? '#F5F0FF' : '#F2F2F2', color: m.role === 'Admin' ? '#7C3AED' : '#6B6B6B', fontWeight: 600, fontSize: 11 }}>{m.role}</span>
                </div>
              ))}
              <button style={{ marginTop: 16, padding: '8px 16px', border: '1px dashed #E8E8E8', borderRadius: 8, fontSize: 13, color: '#6B6B6B', cursor: 'pointer', background: 'transparent' }}>+ Mitglied einladen</button>
            </Card>
          )}

          {section === 'Benachrichtigungen' && (
            <Card>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20 }}>Benachrichtigungen</div>
              {[
                ['Renewal-Erinnerungen', 'Benachrichtigung 30 Tage vor dem Renewal', true],
                ['Health Score Alarm', 'Wenn ein Health Score unter 40 fällt', true],
                ['Neue Aktivitäten', 'Bei jeder neuen Aktivität im Team', false],
                ['Wöchentlicher Report', 'Jeden Montag eine Zusammenfassung', true],
              ].map(([label, desc, def]) => (
                <div key={String(label)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #E8E8E8' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{label}</div>
                    <div style={{ fontSize: 12, color: '#6B6B6B', marginTop: 2 }}>{desc}</div>
                  </div>
                  <ToggleSwitch defaultChecked={Boolean(def)} />
                </div>
              ))}
            </Card>
          )}

          {section === 'Integrationen' && (
            <Card>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20 }}>Integrationen</div>
              {[
                { name: 'Supabase', desc: 'Datenbank verbunden', status: true },
                { name: 'Slack', desc: 'Noch nicht verbunden', status: false },
                { name: 'HubSpot', desc: 'Noch nicht verbunden', status: false },
                { name: 'Zapier', desc: 'Noch nicht verbunden', status: false },
              ].map((int) => (
                <div key={int.name} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid #E8E8E8' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: '#F2F2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: '#1A1A1A' }}>
                    {int.name[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{int.name}</div>
                    <div style={{ fontSize: 12, color: int.status ? '#16A34A' : '#6B6B6B', marginTop: 2 }}>{int.desc}</div>
                  </div>
                  <button style={{ padding: '6px 14px', border: `1px solid ${int.status ? '#E8E8E8' : '#1A1A1A'}`, borderRadius: 7, fontWeight: 600, fontSize: 12, background: int.status ? '#F2F2F2' : '#1A1A1A', color: int.status ? '#6B6B6B' : '#fff', cursor: 'pointer' }}>
                    {int.status ? 'Verwalten' : 'Verbinden'}
                  </button>
                </div>
              ))}
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function ToggleSwitch({ defaultChecked }: { defaultChecked: boolean }) {
  const [on, setOn] = useState(defaultChecked)
  return (
    <button onClick={() => setOn(!on)} style={{ width: 44, height: 24, borderRadius: 12, background: on ? '#7C3AED' : '#E8E8E8', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 3, left: on ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
    </button>
  )
}
