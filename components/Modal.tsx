'use client'

import { useEffect } from 'react'

interface Props {
  title: string
  onClose: () => void
  children: React.ReactNode
  width?: number
}

export default function Modal({ title, onClose, children, width = 520 }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(15,15,26,0.5)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={onClose}
    >
      <div
        style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFBFF 100%)', borderRadius: 20, padding: 28, width: '100%', maxWidth: width, maxHeight: '90vh', overflow: 'auto', boxShadow: '0 8px 40px rgba(99,102,241,0.15), 0 1px 0 rgba(255,255,255,0.8) inset', border: '1px solid rgba(255,255,255,0.9)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <h3 style={{ fontWeight: 700, fontSize: 16, margin: 0 }}>{title}</h3>
          <button
            onClick={onClose}
            style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid #E8E8E8', background: '#F2F2F2', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: '#6B6B6B' }}
          >×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

// Reusable form field
export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6B6B6B', marginBottom: 5 }}>{label}</label>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 12px', border: '1px solid #E8E8E8', borderRadius: 8,
  fontSize: 13, outline: 'none', background: '#FAFAFA', boxSizing: 'border-box',
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} style={{ ...inputStyle, ...props.style }} />
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} style={{ ...inputStyle, cursor: 'pointer', ...props.style }}>
      {props.children}
    </select>
  )
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} style={{ ...inputStyle, resize: 'vertical', minHeight: 80, ...props.style }} />
}

export function FormActions({ onCancel, submitLabel = 'Speichern', danger }: { onCancel: () => void; submitLabel?: string; danger?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
      <button type="button" onClick={onCancel} style={{ padding: '8px 18px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 10, fontWeight: 500, fontSize: 13, background: '#fff', cursor: 'pointer', color: '#6B7280' }}>
        Abbrechen
      </button>
      <button type="submit" style={{ padding: '8px 20px', background: danger ? 'linear-gradient(135deg, #EF4444, #DC2626)' : 'linear-gradient(135deg, #6366F1, #8B5CF6)', color: '#fff', borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: 'pointer', boxShadow: danger ? '0 4px 12px rgba(239,68,68,0.3)' : '0 4px 12px rgba(99,102,241,0.35)' }}>
        {submitLabel}
      </button>
    </div>
  )
}

export const PRESET_COLORS = ['#7C3AED', '#2563EB', '#059669', '#DC2626', '#D97706', '#DB2777', '#0891B2', '#65A30D', '#9333EA', '#C026D3']

export function ColorPicker({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {PRESET_COLORS.map((c) => (
        <button
          key={c} type="button" onClick={() => onChange(c)}
          style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: value === c ? '3px solid #1A1A1A' : '2px solid transparent', cursor: 'pointer', transition: 'border 0.1s' }}
        />
      ))}
    </div>
  )
}
