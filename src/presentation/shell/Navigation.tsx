

export interface NavigationProps {
  currentHash: string
  onNavigate: (hash: string) => void
}

export function Navigation({ currentHash, onNavigate }: NavigationProps) {
  const items = [
    { label: 'Dashboard', hash: '#dashboard' },
    { label: 'Academics', hash: '#academics' },
    { label: 'Planner', hash: '#planner' },
    { label: 'Goals', hash: '#goals' },
    { label: 'Backup/Restore', hash: '#backup' },
  ]

  return (
    <nav
      aria-label="Main navigation"
      style={{
        marginBottom: '24px',
        borderBottom: '1px solid #ccc',
        paddingBottom: '16px',
      }}
    >
      <ul
        style={{
          display: 'flex',
          listStyle: 'none',
          margin: 0,
          padding: 0,
          gap: '16px',
        }}
      >
        {items.map((item) => (
          <li key={item.hash}>
            <a
              href={item.hash}
              onClick={(e) => {
                e.preventDefault()
                onNavigate(item.hash)
              }}
              style={{
                textDecoration: currentHash.startsWith(item.hash)
                  ? 'underline'
                  : 'none',
                fontWeight: currentHash.startsWith(item.hash)
                  ? 'bold'
                  : 'normal',
                color: '#333',
              }}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
