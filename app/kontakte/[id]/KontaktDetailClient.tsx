'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Contact, Customer, Activity } from '@/lib/types'
import { formatDate } from '@/lib/helpers'
import { Card } from '@/components/Card'
import Avatar from '@/components/Avatar'
import { PlanBadge, StatusBadge } from '@/components/Badge'
import Modal, { Field, Input, FormActions, ColorPicker } from '@/components/Modal'
import { EmailIcon, PhoneIcon, NoteIcon, TrendsIcon } from '@/components/Icons'
import { actionUpdateContact } from '@/lib/actions'

interface Props {
  contact: Contact
  customer: Customer | null
  activities: Activity[]
}

const typeColor: Record<string, string> = { email: '#6366F1', call: '#10B981', note: '#F59E0B', system: '#94A3B8' }
const typeIcon: Record<string, React.ReactNode> = { email: <EmailIcon />, call: <PhoneIcon />, note: <NoteIcon />, system: <TrendsIcon /> }
const typeLabel: Record<string, string> = { email: 'E-Mail', call: 'Anruf', note: 'Notiz', system: 'System' }

function toInitials(name: string) {
  return name.split(' ').filter(Boolean).map((w) => w[0].toUpperCase()).join('').slice(0, 2)
}

export default function KontaktDetailClient({ contact: ct, customer, activities }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [editOpen, setEditOpen] = useState(false)
  const [form, setForm] = useState({
    name: ct.name, role: ct.role || '', email: ct.email || '',
    phone: ct.phone || '', lastContact: ct.lastContact || '', color: ct.color,
  })

  function f(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setForm((p) => ({ ...p, [key]: e.target.value }))
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      await actionUpdateContact(ct.id, { ...form, initials: toInitials(form.name) })
      router.refresh()
      setEditOpen(false)
    })
  }

  return (
    <div style={{ padding: 28, overflow: 'auto', flex: 1 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <Avatar initials={ct.initials} color={ct.color} size={52} />
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px', color: '#0F0F1A', marginBottom: 4 }}>{ct.name}</h2>
          <div style={{ fontSize: 13, color: '#6B7280' }}>
            {ct.role && <span>{ct.role}</span>}
            {ct.role && customer && <span> · </span>}
            {customer && (
              <Link href={`/kunden/${customer.id}`} style={{ color: '#6366F1', fontWeight: 600 }}>
                {customer.name}
              </Link>
            )}
          </div>
        </div>
        <button onClick={() => setEditOpen(true)} style={{ padding: '8px 18px', background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', color: '#fff', borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: 'pointer', border: 'none', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>
          Bearbeiten
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Kontaktdaten */}
        <Card>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#0F0F1A', marginBottom: 14 }}>Kontaktdaten</div>
          {[
            ['E-Mail', ct.email, '#6366F1'],
            ['Telefon', ct.phone, '#0F0F1A'],
            ['Rolle', ct.role, '#0F0F1A'],
            ['Letzter Kontakt', formatDate(ct.lastContact), '#0F0F1A'],
          ].map(([label, value, color]) => (
            <div key={String(label)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid rgba(0,0,0,0.05)', fontSize: 13 }}>
              <span style={{ color: '#6B7280', fontWeight: 500 }}>{label}</span>
              <span style={{ fontWeight: 500, color: String(color) }}>{value || '—'}</span>
            </div>
          ))}
        </Card>

        {/* Zugehöriger Kunde */}
        {customer && (
          <Card>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#0F0F1A', marginBottom: 14 }}>Zugehöriger Kunde</div>
            <Link href={`/kunden/${customer.id}`} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <Avatar initials={customer.initials} color={customer.color} size={40} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#0F0F1A' }}>{customer.name}</div>
                <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{customer.industry}</div>
              </div>
            </Link>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <StatusBadge status={customer.status} />
              <PlanBadge plan={customer.plan} />
            </div>
            {[
              ['MRR', `${customer.mrr.toLocaleString('de-DE')} €`],
              ['Health Score', String(customer.health)],
              ['Nutzer', String(customer.users)],
            ].map(([k, v]) => (
              <div key={String(k)} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.05)', fontSize: 13, marginTop: 2 }}>
                <span style={{ color: '#6B7280' }}>{k}</span>
                <span style={{ fontWeight: 600, color: '#0F0F1A' }}>{v}</span>
              </div>
            ))}
          </Card>
        )}
      </div>

      {/* Aktivitäten des Kunden */}
      <Card>
        <div style={{ fontWeight: 700, fontSize: 14, color: '#0F0F1A', marginBottom: 14 }}>
          Aktivitäten bei {customer?.name ?? 'diesem Kunden'}
          <span style={{ marginLeft: 8, fontSize: 12, color: '#A0A8B8', fontWeight: 400 }}>({activities.length})</span>
        </div>
        {activities.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#A0A8B8', padding: 32, fontSize: 13 }}>Noch keine Aktivitäten</div>
        ) : activities.map((a) => {
          const col = typeColor[a.type]
          return (
            <div key={a.id} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
              <Avatar initials={a.initials} color={a.color} size={32} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 13, color: '#0F0F1A', marginBottom: 4 }}>{a.text}</div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11, color: col, background: col + '18', padding: '1px 8px', borderRadius: 20, fontWeight: 600 }}>
                    {typeIcon[a.type]}{typeLabel[a.type]}
                  </span>
                  <span style={{ fontSize: 11, color: '#6B7280', fontWeight: 500 }}>{a.user}</span>
                  <span style={{ fontSize: 11, color: '#A0A8B8' }}>{a.date.split('-').reverse().join('.')} · {a.time} Uhr</span>
                </div>
              </div>
            </div>
          )
        })}
      </Card>

      {editOpen && (
        <Modal title="Kontakt bearbeiten" onClose={() => setEditOpen(false)} width={480}>
          <form onSubmit={handleEdit}>
            <Field label="Name *">
              <Input required value={form.name} onChange={f('name')} />
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
              <Field label="Rolle">
                <Input value={form.role} onChange={f('role')} placeholder="z.B. CEO" />
              </Field>
              <Field label="Letzter Kontakt">
                <Input type="date" value={form.lastContact} onChange={f('lastContact')} />
              </Field>
              <Field label="E-Mail">
                <Input type="email" value={form.email} onChange={f('email')} />
              </Field>
              <Field label="Telefon">
                <Input value={form.phone} onChange={f('phone')} />
              </Field>
            </div>
            <Field label="Avatar-Farbe">
              <ColorPicker value={form.color} onChange={(c) => setForm((p) => ({ ...p, color: c }))} />
            </Field>
            <FormActions onCancel={() => setEditOpen(false)} submitLabel={isPending ? 'Speichern...' : 'Speichern'} />
          </form>
        </Modal>
      )}
    </div>
  )
}
