import { useState, useEffect, useCallback } from 'react'

export function useHashRouter(defaultHash = '#dashboard') {
  const [hash, setHash] = useState(() => window.location.hash || defaultHash)

  useEffect(() => {
    const onHashChange = () => {
      setHash(window.location.hash || defaultHash)
    }

    // Set initial if empty
    if (!window.location.hash) {
      window.location.hash = defaultHash
    }

    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [defaultHash])

  const navigate = useCallback((newHash: string) => {
    window.location.hash = newHash
  }, [])

  return { hash, navigate }
}
