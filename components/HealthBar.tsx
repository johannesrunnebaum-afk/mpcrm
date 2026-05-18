import { healthColor, healthLabel } from '@/lib/helpers'

interface HealthBarProps {
  score: number
  showLabel?: boolean
  width?: number
}

export default function HealthBar({ score, showLabel = false, width = 100 }: HealthBarProps) {
  const col = healthColor(score)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width, height: 6, borderRadius: 3, background: 'rgba(0,0,0,0.07)', overflow: 'hidden', flexShrink: 0 }}>
        <div style={{ width: `${score}%`, height: '100%', background: col, borderRadius: 3, transition: 'width .3s', boxShadow: `0 0 6px ${col}66` }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color: col, minWidth: 24 }}>{score}</span>
      {showLabel && <span style={{ fontSize: 11, color: col, fontWeight: 500 }}>{healthLabel(score)}</span>}
    </div>
  )
}
