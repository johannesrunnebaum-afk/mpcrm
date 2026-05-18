interface AvatarProps {
  initials: string
  color: string
  size?: number
}

export default function Avatar({ initials, color, size = 32 }: AvatarProps) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: color, color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.33, fontWeight: 700, flexShrink: 0,
      boxShadow: `0 2px 8px ${color}55, inset 0 1px 0 rgba(255,255,255,0.2)`,
    }}>
      {initials.slice(0, 2)}
    </div>
  )
}
