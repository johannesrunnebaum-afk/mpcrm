export function daysUntil(dateStr: string): number {
  const d = new Date(dateStr)
  const now = new Date('2026-05-08')
  return Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export function formatDate(str: string): string {
  const d = new Date(str)
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function healthColor(h: number): string {
  if (h >= 70) return '#16A34A'
  if (h >= 40) return '#EA580C'
  return '#DC2626'
}

export function healthBg(h: number): string {
  if (h >= 70) return '#DCFCE7'
  if (h >= 40) return '#FFF0E5'
  return '#FEE2E2'
}

export function healthLabel(h: number): string {
  if (h >= 70) return 'Gesund'
  if (h >= 40) return 'Neutral'
  return 'Gefährdet'
}
