'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Contact, Customer } from '@/lib/types'
import { formatDate } from '@/lib/helpers'
import { Card } from '@/components/Card'
import Avatar from '@/components/Avatar'
import { SearchIcon, PlusIcon, EditIcon, TrashIcon } from '@/components/Icons'
import Modal, { Field, Input, Select, FormActions, ColorPicker } from '@/components/Modal'
import { actionCreateContact, actionUpdateContact, actionDeleteContact } from '@/lib/actions'

type ModalState = { mode: 'create' } | { mode: 'edit'; contact: Contact } | { mode: 'delete'; contact: Contact } | null

function toInitials(name: string) {
  return name.split(' ').filter(Boolean).map((w) => w[0].toUpperCase()).join('').slice(0, 2)
}

const emptyForm = { name: '', role: '', email: '', phone: '', customerId: '', lastContact: '', color: '#7C3AED' }

interface Props { contacts: Contact[]; customers: Customer[] }

export default function KontakteClient({ contacts, customers }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState<ModalState>(null)
  const [form, setForm] = useState(emptyForm)

  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase()) ||
      (c.email || '').toLowerCase().includes(search.toLowerCase()),
  )

  function openCreate() { setForm(emptyForm); setModal({ mode: 'create' }) }
  function openEdit(ct: Contact) {
    setForm({ name: ct.name, role: ct.role || '', email: ct.email || '', phone: ct.phone || '', customerId: String(ct.customerId), lastContact: ct.lastContact || '', color: ct.color })
    setModal({ mode: 'edit', contact: ct })
  }
  function closeModal() { setModal(null) }

  function f(key: keyof typeof emptyForm) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm((p) => ({ ...p, [key]: e.target.value }))
  }

  function buildContact(customerId: number): Omit<Contact, 'id'> {
    return { customerId, name: form.name, initials: toInitials(form.name), color: form.color, role: form.role, email: form.email, phone: form.phone, lastContact: form.lastContact || new Date().toISOString().split('T')[0] }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => { await actionCreateContact(buildContact(Number(form.customerId))); router.refresh(); closeModal() })
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault()
    if (modal?.mode !== 'edit') return
    startTransition(async () => {
      await actionUpdateContact(modal.contact.id, { name: form.name, role: form.role, email: form.email, phone: form.phone, lastContact: form.lastContact, initials: toInitials(form.name), color: form.color })
      router.refresh(); closeModal()
    })
  }

  async function handleDelete() {
    if (modal?.mode !== 'delete') return
    startTransition(async () => { await actionDeleteContact(modal.contact.id); router.refresh(); closeModal() })
  }

  return (
    <div style={{ padding: 28, overflow: 'auto', flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontWeight: 700, fontSize: 20, letterSpacing: '-0.5px', color: '#0F0F1A' }}>Kontakte</h2>
          <p style={{ color: '#6B7280', fontSize: 13, marginTop: 2 }}>{contacts.length} Kontakte insgesamt</p>
        </div>
        <button onClick={openCreate} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', color: '#fff', borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: 'pointer', border: 'none', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>
          <PlusIcon />Kontakt hinzufügen
        </button>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.12)', borderRadius: 10, padding: '8px 14px', flex: 1, maxWidth: 300 }}>
          <SearchIcon />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Kontakte suchen..." style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 13, width: '100%', color: '#0F0F1A' }} />
        </div>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', background: 'rgba(99,102,241,0.03)' }}>
              {['Name', 'Unternehmen', 'Rolle', 'E-Mail', 'Telefon', 'Letzter Kontakt', ''].map((h) => (
                <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#A0A8B8', letterSpacing: '0.4px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((ct) => {
              const cust = customers.find((c) => c.id === ct.customerId)
              return (
                <tr key={ct.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', transition: 'background 0.15s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(99,102,241,0.04)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar initials={ct.initials} color={ct.color} size={32} />
                      <span style={{ fontWeight: 600, fontSize: 13, color: '#0F0F1A' }}>{ct.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <Link href={`/kunden/${ct.customerId}`} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6B7280' }}>
                      <Avatar initials={cust?.initials || '?'} color={cust?.color || '#6B6B6B'} size={20} />
                      <span>{cust?.name}</span>
                    </Link>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#6B7280' }}>{ct.role}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#6366F1', fontWeight: 500 }}>{ct.email}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#6B7280' }}>{ct.phone}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#6B7280' }}>{formatDate(ct.lastContact)}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => openEdit(ct)} style={{ padding: '5px 8px', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 8, background: 'rgba(99,102,241,0.04)', cursor: 'pointer', color: '#6B7280' }}><EditIcon /></button>
                      <button onClick={() => setModal({ mode: 'delete', contact: ct })} style={{ padding: '5px 8px', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, background: 'rgba(239,68,68,0.06)', cursor: 'pointer', color: '#EF4444' }}><TrashIcon /></button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: '#A0A8B8', fontSize: 13 }}>Keine Kontakte gefunden</td></tr>
            )}
          </tbody>
        </table>
      </Card>

      {(modal?.mode === 'create' || modal?.mode === 'edit') && (
        <Modal title={modal.mode === 'create' ? 'Neuen Kontakt anlegen' : 'Kontakt bearbeiten'} onClose={closeModal} width={480}>
          <form onSubmit={modal.mode === 'create' ? handleCreate : handleEdit}>
            <Field label="Name *">
              <Input required value={form.name} onChange={f('name')} placeholder="Vorname Nachname" />
            </Field>
            {modal.mode === 'create' && (
              <Field label="Kunde *">
                <Select required value={form.customerId} onChange={f('customerId')}>
                  <option value="">Bitte wählen...</option>
                  {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </Select>
              </Field>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
              <Field label="Rolle">
                <Input value={form.role} onChange={f('role')} placeholder="z.B. CEO" />
              </Field>
              <Field label="Letzter Kontakt">
                <Input type="date" value={form.lastContact} onChange={f('lastContact')} />
              </Field>
              <Field label="E-Mail">
                <Input type="email" value={form.email} onChange={f('email')} placeholder="name@firma.de" />
              </Field>
              <Field label="Telefon">
                <Input value={form.phone} onChange={f('phone')} placeholder="+49 151 ..." />
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
        <Modal title="Kontakt löschen?" onClose={closeModal} width={420}>
          <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 20, lineHeight: 1.6 }}>
            Möchtest du <strong style={{ color: '#0F0F1A' }}>{modal.contact.name}</strong> wirklich löschen?
          </p>
          <FormActions onCancel={closeModal} submitLabel={isPending ? 'Löschen...' : 'Löschen'} danger />
        </Modal>
      )}
    </div>
  )
}
