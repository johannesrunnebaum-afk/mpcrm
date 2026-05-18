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

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '8px 12px',
    border: '1px solid rgba(99,102,241,0.15)', borderRadius: 10,
    fontSize: 13, outline: 'none', background: 'rgba(99,102,241,0.04)',
    boxSizing: 'border-box', color: '#0F0F1A',
  }

  return (
    <div style={{ padding: 28, flex: 1, overflow: 'auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontWeight: 700, fontSize: 20, letterSpacing: '-0.5px', color: '#0F0F1A' }}>Einstellungen</h2>
        <p style={{ color: '#6B7280', fontSize: 13, marginTop: 2 }}>Verwalte dein Profil und deine Präferenzen</p>
      </div>

      <div style={{ display: 'flex', gap: 24 }}>
        <div style={{ width: 180, flexShrink: 0 }}>
          <Card style={{ padding: '6px 0' }}>
            {sections.map((s) => (
              <button key={s} onClick={() => setSection(s)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left', padding: '10px 16px',
                  fontWeight: section === s ? 600 : 400, fontSize: 13,
                  color: section === s ? '#6366F1' : '#6B7280',
                  background: section === s ? 'rgba(99,102,241,0.08)' : 'transparent',
                  borderLeft: `3px solid ${section === s ? '#6366F1' : 'transparent'}`,
                  cursor: 'pointer', border: 'none',
                  borderLeftWidth: 3, borderLeftStyle: 'solid',
                  borderLeftColor: section === s ? '#6366F1' : 'transparent',
                  transition: 'all 0.15s',
                }}>
                {s}
              </button>
            ))}
          </Card>
        </div>

        <div style={{ flex: 1 }}>
          {section === 'Profil' && (
            <Card>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20, color: '#0F0F1A' }}>Profil bearbeiten</div>
              <form onSubmit={handleSave}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #F59E0B, #EF4444)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 22, boxShadow: '0 4px 16px rgba(245,158,11,0.4)' }}>JR</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: '#0F0F1A' }}>Johannes Runnebaum</div>
                    <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>johannes.runnebaum@gmail.com</div>
                  </div>
                </div>
                {[['Vorname', 'Johannes'], ['Nachname', 'Runnebaum'], ['E-Mail', 'johannes.runnebaum@gmail.com'], ['Rolle', 'Admin']].map(([label, def]) => (
                  <div key={label} style={{ marginBottom: 14 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 5 }}>{label}</label>
                    <input defaultValue={def} style={inputStyle} />
                  </div>
                ))}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20 }}>
                  <button type="submit" style={{ padding: '8px 20px', background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', color: '#fff', borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: 'pointer', border: 'none', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>Speichern</button>
                  {saved && <span style={{ fontSize: 13, color: '#10B981', fontWeight: 600 }}>✓ Gespeichert</span>}
                </div>
              </form>
            </Card>
          )}

          {section === 'Team' && (
            <Card>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20, color: '#0F0F1A' }}>Team-Mitglieder</div>
              {[
                { name: 'Johannes Runnebaum', email: 'johannes.runnebaum@gmail.com', role: 'Admin', color: '#F59E0B' },
                { name: 'Lisa Müller', email: 'l.mueller@mpilot.de', role: 'CSM', color: '#7C3AED' },
                { name: 'Tom Kraft', email: 't.kraft@mpilot.de', role: 'CSM', color: '#2563EB' },
              ].map((m) => (
                <div key={m.email} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: m.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, boxShadow: `0 2px 8px ${m.color}55` }}>
                    {m.name.split(' ').map((w) => w[0]).join('')}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: '#0F0F1A' }}>{m.name}</div>
                    <div style={{ fontSize: 12, color: '#6B7280' }}>{m.email}</div>
                  </div>
                  <span style={{ padding: '3px 10px', borderRadius: 20, background: m.role === 'Admin' ? 'rgba(99,102,241,0.1)' : 'rgba(0,0,0,0.05)', color: m.role === 'Admin' ? '#6366F1' : '#6B7280', fontWeight: 600, fontSize: 11 }}>{m.role}</span>
                </div>
              ))}
              <button style={{ marginTop: 16, padding: '8px 16px', border: '1px dashed rgba(99,102,241,0.3)', borderRadius: 10, fontSize: 13, color: '#6366F1', cursor: 'pointer', background: 'rgba(99,102,241,0.04)' }}>
                + Mitglied einladen
              </button>
            </Card>
          )}

          {section === 'Benachrichtigungen' && (
            <Card>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20, color: '#0F0F1A' }}>Benachrichtigungen</div>
              {[
                ['Renewal-Erinnerungen', 'Benachrichtigung 30 Tage vor dem Renewal', true],
                ['Health Score Alarm', 'Wenn ein Health Score unter 40 fällt', true],
                ['Neue Aktivitäten', 'Bei jeder neuen Aktivität im Team', false],
                ['Wöchentlicher Report', 'Jeden Montag eine Zusammenfassung', true],
              ].map(([label, desc, def]) => (
                <div key={String(label)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: '#0F0F1A' }}>{label}</div>
                    <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{desc}</div>
                  </div>
                  <ToggleSwitch defaultChecked={Boolean(def)} />
                </div>
              ))}
            </Card>
          )}

          {section === 'Integrationen' && (
            <Card>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20, color: '#0F0F1A' }}>Integrationen</div>
              {[
                { name: 'Supabase', desc: 'Datenbank verbunden', status: true },
                { name: 'Slack', desc: 'Noch nicht verbunden', status: false },
                { name: 'HubSpot', desc: 'Noch nicht verbunden', status: false },
                { name: 'Zapier', desc: 'Noch nicht verbunden', status: false },
              ].map((int) => (
                <div key={int.name} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: int.status ? 'rgba(16,185,129,0.1)' : 'rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: int.status ? '#10B981' : '#6B7280' }}>
                    {int.name[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: '#0F0F1A' }}>{int.name}</div>
                    <div style={{ fontSize: 12, color: int.status ? '#10B981' : '#6B7280', marginTop: 2 }}>{int.desc}</div>
                  </div>
                  <button style={{
                    padding: '7px 16px',
                    border: int.status ? '1px solid rgba(0,0,0,0.08)' : 'none',
                    borderRadius: 9, fontWeight: 600, fontSize: 12, cursor: 'pointer',
                    background: int.status ? 'rgba(0,0,0,0.04)' : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                    color: int.status ? '#6B7280' : '#fff',
                    boxShadow: int.status ? 'none' : '0 4px 10px rgba(99,102,241,0.3)',
                  }}>
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
    <button onClick={() => setOn(!on)} style={{ width: 44, height: 24, borderRadius: 12, background: on ? 'linear-gradient(135deg, #6366F1, #8B5CF6)' : 'rgba(0,0,0,0.1)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0, boxShadow: on ? '0 2px 8px rgba(99,102,241,0.4)' : 'none' }}>
      <div style={{ position: 'absolute', top: 3, left: on ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
    </button>
  )
}
