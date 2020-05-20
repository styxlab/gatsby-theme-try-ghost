import { useEffect, useState } from 'react'

const useMediaQuery = (query) => {
    const isBrowser = typeof window !== `undefined`
    if (!isBrowser) {
        return false
    }

    const mediaMatch = window.matchMedia(query)
    const [matches, setMatches] = useState(mediaMatch.matches)

    useEffect(() => {
        const handler = e => setMatches(e.matches)
        mediaMatch.addListener(handler)
        return () => mediaMatch.removeListener(handler)
    })
    return matches
}

export default useMediaQuery
