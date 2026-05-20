'use client'

import { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { Profile } from '@/lib/types'
import { Card } from '@/components/Card'
import { ProfileAvatar } from '@/components/TopBar'
import { actionUpdateProfile } from '@/lib/actions'
import { createClient } from '@/lib/supabase/client'
import { PRESET_COLORS } from '@/components/Modal'

const sections = ['Profil', 'Team', 'Benachrichtigungen', 'Integrationen']

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px',
  border: '1px solid rgba(99,102,241,0.15)', borderRadius: 10,
  fontSize: 13, outline: 'none', background: 'rgba(99,102,241,0.04)',
  boxSizing: 'border-box', color: '#0F0F1A',
}

export default function EinstellungenClient({ profile: initial }: { profile: Profile }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [section, setSection] = useState('Profil')
  const [saved, setSaved] = useState(false)
  const [profile, setProfile] = useState(initial)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleChange(key: keyof Profile) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setProfile((p) => {
        const updated = { ...p, [key]: value }
        if (key === 'firstName' || key === 'lastName') {
          const first = key === 'firstName' ? value : p.firstName
          const last = key === 'lastName' ? value : p.lastName
          updated.initials = `${first[0] ?? ''}${last[0] ?? ''}`.toUpperCase()
        }
        return updated
      })
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      await actionUpdateProfile({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        role: profile.role,
        initials: profile.initials,
        avatarColor: profile.avatarColor,
        avatarUrl: profile.avatarUrl,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
      router.refresh()
    })
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { setUploadError('Max. 2 MB'); return }
    setUploadError('')
    setUploading(true)
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop()
      const path = `profile-${Date.now()}.${ext}`
      const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
      if (error) throw error
      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      const url = data.publicUrl
      setProfile((p) => ({ ...p, avatarUrl: url }))
      await actionUpdateProfile({ avatarUrl: url })
      router.refresh()
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Upload fehlgeschlagen')
    } finally {
      setUploading(false)
    }
  }

  async function handleRemoveAvatar() {
    setProfile((p) => ({ ...p, avatarUrl: null }))
    await actionUpdateProfile({ avatarUrl: null })
    router.refresh()
  }

  return (
    <div style={{ padding: 28, flex: 1, overflow: 'auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontWeight: 700, fontSize: 20, letterSpacing: '-0.5px', color: '#0F0F1A' }}>Einstellungen</h2>
        <p style={{ color: '#6B7280', fontSize: 13, marginTop: 2 }}>Verwalte dein Profil und deine Präferenzen</p>
      </div>

      <div style={{ display: 'flex', gap: 24 }}>
        {/* Sidebar nav */}
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
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 24, color: '#0F0F1A' }}>Profil bearbeiten</div>

              {/* Avatar */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ position: 'relative' }}>
                  <ProfileAvatar profile={profile} size={72} />
                  {uploading && (
                    <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                    </div>
                  )}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#0F0F1A', marginBottom: 4 }}>Profilbild</div>
                  <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 12 }}>JPG oder PNG, max. 2 MB</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} />
                    <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
                      style={{ padding: '7px 16px', background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', color: '#fff', borderRadius: 9, fontWeight: 600, fontSize: 12, cursor: 'pointer', border: 'none', boxShadow: '0 4px 10px rgba(99,102,241,0.3)' }}>
                      {uploading ? 'Hochladen...' : 'Bild hochladen'}
                    </button>
                    {profile.avatarUrl && (
                      <button onClick={handleRemoveAvatar}
                        style={{ padding: '7px 14px', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 9, fontWeight: 600, fontSize: 12, cursor: 'pointer', background: 'rgba(239,68,68,0.06)', color: '#EF4444' }}>
                        Entfernen
                      </button>
                    )}
                  </div>
                  {uploadError && <div style={{ fontSize: 12, color: '#EF4444', marginTop: 8 }}>{uploadError}</div>}
                </div>
              </div>

              {/* Avatar-Farbe (wenn kein Bild) */}
              {!profile.avatarUrl && (
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 8 }}>Avatar-Farbe</label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {PRESET_COLORS.map((c) => (
                      <button key={c} type="button" onClick={() => setProfile((p) => ({ ...p, avatarColor: c }))}
                        style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: profile.avatarColor === c ? '3px solid #1A1A1A' : '2px solid transparent', cursor: 'pointer', transition: 'border 0.1s' }} />
                    ))}
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSave}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                  {([
                    ['Vorname', 'firstName'],
                    ['Nachname', 'lastName'],
                    ['E-Mail', 'email'],
                    ['Rolle', 'role'],
                  ] as [string, keyof Profile][]).map(([label, key]) => (
                    <div key={label} style={{ marginBottom: 14 }}>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 5 }}>{label}</label>
                      <input
                        value={String(profile[key] ?? '')}
                        onChange={handleChange(key)}
                        style={inputStyle}
                        type={key === 'email' ? 'email' : 'text'}
                      />
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 5 }}>Initialen</label>
                  <input value={profile.initials} onChange={handleChange('initials')} maxLength={2} style={{ ...inputStyle, width: 64 }} />
                  <div style={{ fontSize: 11, color: '#A0A8B8', marginTop: 4 }}>Werden automatisch aus Vor- und Nachname berechnet</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <button type="submit" disabled={isPending}
                    style={{ padding: '9px 22px', background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', color: '#fff', borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: isPending ? 'default' : 'pointer', border: 'none', boxShadow: '0 4px 12px rgba(99,102,241,0.3)', opacity: isPending ? 0.7 : 1 }}>
                    {isPending ? 'Speichern...' : 'Änderungen speichern'}
                  </button>
                  {saved && (
                    <span style={{ fontSize: 13, color: '#10B981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                      Gespeichert
                    </span>
                  )}
                </div>
              </form>
            </Card>
          )}

          {section === 'Team' && (
            <Card>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20, color: '#0F0F1A' }}>Team-Mitglieder</div>
              {[
                { name: `${profile.firstName} ${profile.lastName}`, email: profile.email, role: profile.role, color: profile.avatarColor, initials: profile.initials, avatarUrl: profile.avatarUrl },
                { name: 'Lisa Müller', email: 'l.mueller@mpilot.de', role: 'CSM', color: '#7C3AED', initials: 'LM', avatarUrl: null },
                { name: 'Tom Kraft', email: 't.kraft@mpilot.de', role: 'CSM', color: '#2563EB', initials: 'TK', avatarUrl: null },
              ].map((m) => (
                <div key={m.email} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  {m.avatarUrl
                    ? <img src={m.avatarUrl} alt={m.initials} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                    : <div style={{ width: 36, height: 36, borderRadius: '50%', background: m.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, boxShadow: `0 2px 8px ${m.color}55` }}>{m.initials}</div>
                  }
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
                  <button style={{ padding: '7px 16px', border: int.status ? '1px solid rgba(0,0,0,0.08)' : 'none', borderRadius: 9, fontWeight: 600, fontSize: 12, cursor: 'pointer', background: int.status ? 'rgba(0,0,0,0.04)' : 'linear-gradient(135deg, #6366F1, #8B5CF6)', color: int.status ? '#6B7280' : '#fff', boxShadow: int.status ? 'none' : '0 4px 10px rgba(99,102,241,0.3)' }}>
                    {int.status ? 'Verwalten' : 'Verbinden'}
                  </button>
                </div>
              ))}
            </Card>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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
