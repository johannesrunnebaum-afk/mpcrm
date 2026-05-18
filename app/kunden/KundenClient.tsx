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
  mrr: '', health: '75', status: 'Aktiv' as Customer['status'],
  renewal: '', users: '1', campaigns: '0', projects: '0', nps: '8', color: '#7C3AED',
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

  function openCreate() {
    setForm(emptyForm)
    setModal({ mode: 'create' })
  }

  function openEdit(c: Customer) {
    setForm({
      name: c.name, industry: c.industry || '', plan: c.plan,
      mrr: String(c.mrr), health: String(c.health), status: c.status,
      renewal: c.renewal, users: String(c.users), campaigns: String(c.campaigns),
      projects: String(c.projects), nps: String(c.nps), color: c.color,
    })
    setModal({ mode: 'edit', customer: c })
  }

  function openDelete(c: Customer) {
    setModal({ mode: 'delete', customer: c })
  }

  function closeModal() { setModal(null) }

  function f(key: keyof typeof emptyForm) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }))
  }

  function buildCustomer(): Omit<Customer, 'id'> {
    return {
      name: form.name, initials: toInitials(form.name), color: form.color,
      plan: form.plan, mrr: Number(form.mrr), health: Number(form.health),
      status: form.status, renewal: form.renewal, industry: form.industry,
      users: Number(form.users), lastLogin: new Date().toISOString().split('T')[0],
      campaigns: Number(form.campaigns), projects: Number(form.projects), nps: Number(form.nps),
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      await actionCreateCustomer(buildCustomer())
      router.refresh()
      closeModal()
    })
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault()
    if (modal?.mode !== 'edit') return
    startTransition(async () => {
      await actionUpdateCustomer(modal.customer.id, buildCustomer())
      router.refresh()
      closeModal()
    })
  }

  async function handleDelete() {
    if (modal?.mode !== 'delete') return
    startTransition(async () => {
      await actionDeleteCustomer(modal.customer.id)
      router.refresh()
      closeModal()
    })
  }

  return (
    <div style={{ padding: 28, overflow: 'auto', flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.3px' }}>Kunden</h2>
          <p style={{ color: '#6B6B6B', fontSize: 13, marginTop: 2 }}>
            {initial.length} Kunden insgesamt · {totalMrr.toLocaleString('de-DE')} € MRR
          </p>
        </div>
        <button onClick={openCreate} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', background: '#1A1A1A', color: '#fff', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
          <PlusIcon />Kunde hinzufügen
        </button>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#FFFFFF', border: '1px solid #E8E8E8', borderRadius: 8, padding: '7px 12px', flex: 1, maxWidth: 280 }}>
          <SearchIcon />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Kunden durchsuchen..." style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 13, width: '100%' }} />
        </div>
        {['Alle', 'Aktiv', 'Gefährdet'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '7px 14px', borderRadius: 8, border: `1px solid ${filter === f ? '#1A1A1A' : '#E8E8E8'}`, background: filter === f ? '#1A1A1A' : '#FFFFFF', color: filter === f ? '#fff' : '#1A1A1A', fontWeight: filter === f ? 600 : 400, fontSize: 13, cursor: 'pointer' }}>
            {f}
          </button>
        ))}
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E8E8E8', background: '#FAFAFA' }}>
              {['Kunde', 'Plan', 'MRR', 'Health Score', 'Status', 'Letzter Login', 'Renewal', ''].map((h) => (
                <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#6B6B6B', letterSpacing: '0.3px', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => {
              const days = daysUntil(c.renewal)
              return (
                <tr key={c.id} style={{ borderBottom: '1px solid #E8E8E8' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#FAFAFA')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                  <td style={{ padding: '12px 16px' }}>
                    <Link href={`/kunden/${c.id}`} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar initials={c.initials} color={c.color} size={32} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: '#6B6B6B' }}>{c.industry} · {c.users} Nutzer</div>
                      </div>
                    </Link>
                  </td>
                  <td style={{ padding: '12px 16px' }}><PlanBadge plan={c.plan} /></td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, fontSize: 13 }}>{c.mrr} €</td>
                  <td style={{ padding: '12px 16px' }}><HealthBar score={c.health} width={80} /></td>
                  <td style={{ padding: '12px 16px' }}><StatusBadge status={c.status} /></td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#6B6B6B' }}>{formatDate(c.lastLogin)}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontSize: 12 }}>
                      <div style={{ fontWeight: 500 }}>{formatDate(c.renewal)}</div>
                      <div style={{ color: days <= 60 ? '#DC2626' : days <= 90 ? '#EA580C' : '#6B6B6B', fontSize: 11, marginTop: 1 }}>{days} Tage</div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <button onClick={(e) => { e.preventDefault(); openEdit(c) }} style={{ padding: '5px 8px', border: '1px solid #E8E8E8', borderRadius: 6, background: '#fff', cursor: 'pointer', color: '#6B6B6B' }}><EditIcon /></button>
                      <button onClick={(e) => { e.preventDefault(); openDelete(c) }} style={{ padding: '5px 8px', border: '1px solid #FEE2E2', borderRadius: 6, background: '#FEF2F2', cursor: 'pointer', color: '#DC2626' }}><TrashIcon /></button>
                      <Link href={`/kunden/${c.id}`}><ChevronRightIcon /></Link>
                    </div>
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={8} style={{ padding: 32, textAlign: 'center', color: '#ABABAB', fontSize: 13 }}>Keine Kunden gefunden</td></tr>
            )}
          </tbody>
        </table>
      </Card>

      {/* Create / Edit Modal */}
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
                  <option>Starter</option><option>Pro</option><option>Business</option>
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
              <Field label="Health Score (0–100)">
                <Input type="number" min="0" max="100" value={form.health} onChange={f('health')} />
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

      {/* Delete Confirm Modal */}
      {modal?.mode === 'delete' && (
        <Modal title="Kunde löschen?" onClose={closeModal} width={420}>
          <p style={{ fontSize: 14, color: '#6B6B6B', marginBottom: 20 }}>
            Möchtest du <strong>{modal.customer.name}</strong> wirklich löschen? Alle zugehörigen Kontakte, Aktivitäten und Onboarding-Daten werden ebenfalls gelöscht.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 16, borderTop: '1px solid #E8E8E8' }}>
            <button type="button" onClick={closeModal} style={{ padding: '8px 18px', border: '1px solid #E8E8E8', borderRadius: 8, fontWeight: 500, fontSize: 13, background: '#fff', cursor: 'pointer' }}>Abbrechen</button>
            <button type="button" onClick={handleDelete} disabled={isPending} style={{ padding: '8px 18px', background: '#DC2626', color: '#fff', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
              {isPending ? 'Löschen...' : 'Endgültig löschen'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
