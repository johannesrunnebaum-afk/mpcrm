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
      <div style={{ width, height: 6, borderRadius: 3, background: '#E8E8E8', overflow: 'hidden' }}>
        <div
          style={{
            width: `${score}%`,
            height: '100%',
            background: col,
            borderRadius: 3,
            transition: 'width .3s',
          }}
        />
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color: col, minWidth: 24 }}>{score}</span>
      {showLabel && <span style={{ fontSize: 11, color: col }}>{healthLabel(score)}</span>}
    </div>
  )
}
