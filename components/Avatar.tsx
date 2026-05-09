interface AvatarProps {
  initials: string
  color: string
  size?: number
}

export default function Avatar({ initials, color, size = 32 }: AvatarProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.33,
        fontWeight: 600,
        flexShrink: 0,
      }}
    >
      {initials.slice(0, 2)}
    </div>
  )
}
