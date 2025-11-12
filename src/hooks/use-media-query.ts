import { useState, useEffect } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)

    // Set initial value
    if (media.matches !== matches) {
      setMatches(media.matches)
    }

    // Define listener to track changes
    const listener = () => setMatches(media.matches)

    // Listen for viewport changes
    media.addEventListener('change', listener)

    // Cleanup listener on unmount
    return () => media.removeEventListener('change', listener)
  }, [matches, query])

  return matches
}
