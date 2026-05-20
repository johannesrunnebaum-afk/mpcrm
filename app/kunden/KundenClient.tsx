'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Customer } from '@/lib/types'
import { daysUntil, formatDate } from '@/lib/helpers'
import { Card } from '@/components/Card'
import Avatar from '@/components/Avatar'
import { StatusBadge, PlanBadge } from '@/components/Badge'
import HealthBar from '@/components/HealthBar'
import { SearchIcon, PlusIcon, ChevronRightIcon, EditIcon, TrashIcon } from '@/components/Icons'
import Modal, { Field, Input, Select, FormActions, ColorPicker } from '@/components/Modal'
import { actionCreateCustomer, actionUpdateCustomer, actionDeleteCustomer } from '@/lib/actions'

type ModalState = { mode: 'create' } | { mode: 'edit'; customer: Customer } | { mode: 'delete'; customer: Customer } | null

function toInitials(name: string) {
  return name.split(' ').filter(Boolean).map((w) => w[0].toUpperCase()).join('').slice(0, 2)
}

const emptyForm = {
  name: '', industry: '', plan: 'Starter' as Customer['plan'],
  mrr: '', status: 'Aktiv' as Customer['status'],
  renewal: '', users: '1', campaigns: '0', projects: '0', nps: '8', color: '#7C3AED',
}

function calcHealth(nps: number, plan: Customer['plan'], status: Customer['status']): number {
  const npsScore = Math.round((nps / 10) * 50)
  const planScore: Record<Customer['plan'], number> = { Free: 0, Starter: 10, Pro: 20, Business: 30 }
  const statusScore = status === 'Aktiv' ? 20 : 0
  return Math.min(100, npsScore + (planScore[plan] ?? 10) + statusScore)
}

export default function KundenClient({ customers: initial }: { customers: Customer[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Alle')
  const [modal, setModal] = useState<ModalState>(null)
  const [form, setForm] = useState(emptyForm)

  const filtered = initial.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.industry || '').toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'Alle' || c.status === filter
    return matchSearch && matchFilter
  })

  const totalMrr = initial.reduce((s, c) => s + c.mrr, 0)

  function openCreate() { setForm(emptyForm); setModal({ mode: 'create' }) }

  function openEdit(c: Customer) {
    setForm({
      name: c.name, industry: c.industry || '', plan: c.plan,
      mrr: String(c.mrr), status: c.status,
      renewal: c.renewal, users: String(c.users), campaigns: String(c.campaigns),
      projects: String(c.projects), nps: String(c.nps), color: c.color,
    })
    setModal({ mode: 'edit', customer: c })
  }

  function closeModal() { setModal(null) }

  function f(key: keyof typeof emptyForm) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }))
  }

  function buildCustomer(): Omit<Customer, 'id'> {
    const nps = Number(form.nps)
    return {
      name: form.name, initials: toInitials(form.name), color: form.color,
      plan: form.plan, mrr: Number(form.mrr),
      health: calcHealth(nps, form.plan, form.status),
      status: form.status, renewal: form.renewal, industry: form.industry,
      users: Number(form.users), lastLogin: new Date().toISOString().split('T')[0],
      campaigns: Number(form.campaigns), projects: Number(form.projects), nps,
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => { await actionCreateCustomer(buildCustomer()); router.refresh(); closeModal() })
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault()
    if (modal?.mode !== 'edit') return
    startTransition(async () => { await actionUpdateCustomer(modal.customer.id, buildCustomer()); router.refresh(); closeModal() })
  }

  async function handleDelete() {
    if (modal?.mode !== 'delete') return
    startTransition(async () => { await actionDeleteCustomer(modal.customer.id); router.refresh(); closeModal() })
  }

  const btnPrimary: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px',
    background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', color: '#fff',
    borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: 'pointer', border: 'none',
    boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
  }

  return (
    <div style={{ padding: 28, overflow: 'auto', flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontWeight: 700, fontSize: 20, letterSpacing: '-0.5px', color: '#0F0F1A' }}>Kunden</h2>
          <p style={{ color: '#6B7280', fontSize: 13, marginTop: 2 }}>
            {initial.length} Kunden insgesamt · {totalMrr.toLocaleString('de-DE')} € MRR
          </p>
        </div>
        <button onClick={openCreate} style={btnPrimary}>
          <PlusIcon />Kunde hinzufügen
        </button>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.12)', borderRadius: 10, padding: '8px 14px', flex: 1, maxWidth: 300 }}>
          <SearchIcon />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Kunden durchsuchen..." style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 13, width: '100%', color: '#0F0F1A' }} />
        </div>
        {['Alle', 'Aktiv', 'Gefährdet'].map((fi) => (
          <button key={fi} onClick={() => setFilter(fi)} style={{
            padding: '8px 16px', borderRadius: 10, border: 'none',
            background: filter === fi ? 'linear-gradient(135deg, #6366F1, #8B5CF6)' : 'rgba(99,102,241,0.06)',
            color: filter === fi ? '#fff' : '#6B7280',
            fontWeight: filter === fi ? 600 : 500, fontSize: 13, cursor: 'pointer',
            boxShadow: filter === fi ? '0 4px 12px rgba(99,102,241,0.25)' : 'none',
          }}>
            {fi}
          </button>
        ))}
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', background: 'rgba(99,102,241,0.03)' }}>
              {['Kunde', 'Plan', 'MRR', 'Health Score', 'Status', 'Letzter Login', 'Renewal', ''].map((h) => (
                <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#A0A8B8', letterSpacing: '0.4px', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => {
              const days = daysUntil(c.renewal)
              return (
                <tr key={c.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', transition: 'background 0.15s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(99,102,241,0.04)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                  <td style={{ padding: '12px 16px' }}>
                    <Link href={`/kunden/${c.id}`} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar initials={c.initials} color={c.color} size={32} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13, color: '#0F0F1A' }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: '#6B7280' }}>{c.industry} · {c.users} Nutzer</div>
                      </div>
                    </Link>
                  </td>
                  <td style={{ padding: '12px 16px' }}><PlanBadge plan={c.plan} /></td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, fontSize: 13, color: '#0F0F1A' }}>{c.mrr.toLocaleString('de-DE')} €</td>
                  <td style={{ padding: '12px 16px' }}><HealthBar score={c.health} width={80} /></td>
                  <td style={{ padding: '12px 16px' }}><StatusBadge status={c.status} /></td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#6B7280' }}>{formatDate(c.lastLogin)}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontSize: 12 }}>
                      <div style={{ fontWeight: 500, color: '#0F0F1A' }}>{formatDate(c.renewal)}</div>
                      <div style={{ color: days <= 60 ? '#EF4444' : days <= 90 ? '#F59E0B' : '#6B7280', fontSize: 11, marginTop: 1 }}>{days} Tage</div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <button onClick={(e) => { e.preventDefault(); openEdit(c) }} style={{ padding: '5px 8px', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 8, background: 'rgba(99,102,241,0.04)', cursor: 'pointer', color: '#6B7280' }}><EditIcon /></button>
                      <button onClick={(e) => { e.preventDefault(); setModal({ mode: 'delete', customer: c }) }} style={{ padding: '5px 8px', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, background: 'rgba(239,68,68,0.06)', cursor: 'pointer', color: '#EF4444' }}><TrashIcon /></button>
                      <Link href={`/kunden/${c.id}`} style={{ color: '#A0A8B8' }}><ChevronRightIcon /></Link>
                    </div>
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={8} style={{ padding: 40, textAlign: 'center', color: '#A0A8B8', fontSize: 13 }}>Keine Kunden gefunden</td></tr>
            )}
          </tbody>
        </table>
      </Card>

      {(modal?.mode === 'create' || modal?.mode === 'edit') && (
        <Modal title={modal.mode === 'create' ? 'Neuen Kunden anlegen' : 'Kunde bearbeiten'} onClose={closeModal} width={560}>
          <form onSubmit={modal.mode === 'create' ? handleCreate : handleEdit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
              <Field label="Kundenname *">
                <Input required value={form.name} onChange={f('name')} placeholder="z.B. Acme GmbH" />
              </Field>
              <Field label="Branche">
                <Input value={form.industry} onChange={f('industry')} placeholder="z.B. Software" />
              </Field>
              <Field label="Plan *">
                <Select required value={form.plan} onChange={f('plan')}>
                  <option>Free</option><option>Starter</option><option>Pro</option><option>Business</option>
                </Select>
              </Field>
              <Field label="Status *">
                <Select required value={form.status} onChange={f('status')}>
                  <option>Aktiv</option><option>Gefährdet</option>
                </Select>
              </Field>
              <Field label="MRR (€) *">
                <Input required type="number" min="0" value={form.mrr} onChange={f('mrr')} placeholder="0" />
              </Field>
              <Field label="Health Score">
                <div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.12)', fontSize: 13, color: '#0F0F1A', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, height: 5, background: 'rgba(0,0,0,0.07)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${calcHealth(Number(form.nps), form.plan, form.status)}%`, height: '100%', background: 'linear-gradient(90deg,#6366F1,#8B5CF6)', borderRadius: 3, transition: 'width 0.3s' }} />
                  </div>
                  <span style={{ fontWeight: 700, fontSize: 12, color: '#6366F1', minWidth: 30, textAlign: 'right' }}>{calcHealth(Number(form.nps), form.plan, form.status)}</span>
                </div>
                <p style={{ fontSize: 11, color: '#A0A8B8', marginTop: 4 }}>Automatisch aus NPS, Plan & Status berechnet</p>
              </Field>
              <Field label="Renewal-Datum *">
                <Input required type="date" value={form.renewal} onChange={f('renewal')} />
              </Field>
              <Field label="Anzahl Nutzer">
                <Input type="number" min="0" value={form.users} onChange={f('users')} />
              </Field>
              <Field label="NPS (0–10)">
                <Input type="number" min="0" max="10" value={form.nps} onChange={f('nps')} />
              </Field>
              <Field label="Kampagnen">
                <Input type="number" min="0" value={form.campaigns} onChange={f('campaigns')} />
              </Field>
            </div>
            <Field label="Avatar-Farbe">
              <ColorPicker value={form.color} onChange={(c) => setForm((p) => ({ ...p, color: c }))} />
            </Field>
            <FormActions onCancel={closeModal} submitLabel={isPending ? 'Speichern...' : modal.mode === 'create' ? 'Anlegen' : 'Speichern'} />
          </form>
        </Modal>
      )}

      {modal?.mode === 'delete' && (
        <Modal title="Kunde löschen?" onClose={closeModal} width={420}>
          <form onSubmit={(e) => { e.preventDefault(); handleDelete() }}>
            <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 20, lineHeight: 1.6 }}>
              Möchtest du <strong style={{ color: '#0F0F1A' }}>{modal.customer.name}</strong> wirklich löschen? Alle zugehörigen Kontakte, Aktivitäten und Onboarding-Daten werden ebenfalls gelöscht.
            </p>
            <FormActions onCancel={closeModal} submitLabel={isPending ? 'Löschen...' : 'Endgültig löschen'} danger />
          </form>
        </Modal>
      )}
    </div>
  )
}
