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
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(10,8,20,0.65)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'rgba(240,238,252,0.88)',
          backdropFilter: 'blur(60px) saturate(180%)',
          WebkitBackdropFilter: 'blur(60px) saturate(180%)',
          borderRadius: 26,
          padding: 28,
          width: '100%', maxWidth: width, maxHeight: '90vh', overflow: 'auto',
          boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.9), 0 24px 60px rgba(0,0,0,0.22), 0 4px 16px rgba(99,102,241,0.14)',
          border: '1px solid rgba(255,255,255,0.7)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Specular shimmer at top */}
        <div style={{
          position: 'absolute', top: 0, left: 40, right: 40, height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
          borderRadius: '0 0 4px 4px',
          pointerEvents: 'none',
        }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <h3 style={{ fontWeight: 700, fontSize: 16, margin: 0, color: '#0F0F1A' }}>{title}</h3>
          <button
            onClick={onClose}
            style={{
              width: 30, height: 30, borderRadius: 10,
              border: '1px solid rgba(0,0,0,0.1)',
              background: 'rgba(255,255,255,0.7)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, color: '#6B7280',
            }}
          >×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#0F0F1A', marginBottom: 5, opacity: 0.75 }}>{label}</label>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 13px',
  border: '1px solid rgba(99,102,241,0.18)',
  borderRadius: 11,
  fontSize: 13, outline: 'none',
  background: 'rgba(255,255,255,0.75)',
  boxSizing: 'border-box',
  color: '#0F0F1A',
  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)',
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
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.3)' }}>
      <button
        type="button" onClick={onCancel}
        style={{
          padding: '9px 18px',
          border: '1px solid rgba(0,0,0,0.1)',
          borderRadius: 12, fontWeight: 500, fontSize: 13,
          background: 'rgba(255,255,255,0.7)',
          cursor: 'pointer', color: '#4B5563',
        }}>
        Abbrechen
      </button>
      <button
        type="submit"
        style={{
          padding: '9px 20px',
          background: danger ? 'linear-gradient(135deg, #EF4444, #DC2626)' : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
          color: '#fff', borderRadius: 12, fontWeight: 600, fontSize: 13, cursor: 'pointer',
          boxShadow: danger ? '0 4px 16px rgba(239,68,68,0.4), inset 0 1px 0 rgba(255,255,255,0.2)' : '0 4px 16px rgba(99,102,241,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
          border: 'none',
        }}>
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
          style={{
            width: 28, height: 28, borderRadius: '50%', background: c,
            border: value === c ? '3px solid rgba(255,255,255,0.9)' : '2px solid transparent',
            cursor: 'pointer', transition: 'all 0.15s',
            boxShadow: value === c ? `0 0 0 2px ${c}, 0 4px 12px ${c}66` : `0 2px 6px ${c}44`,
          }}
        />
      ))}
    </div>
  )
}
