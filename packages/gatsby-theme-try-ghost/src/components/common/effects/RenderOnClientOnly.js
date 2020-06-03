import React from 'react'
import { useEffect, useState } from "react"

/**
 * RenderOnClientOnly
 *
 * Further info 👉🏼 https://joshwcomeau.com/react/the-perils-of-rehydration/
 */

const RenderOnClientOnly = ({ children, ...delegated }) => {
    const [hasMounted, setHasMounted] = useState(false)

    useEffect(() => {
        setHasMounted(true)
    }, [])

    if (!hasMounted) {
        return null
    }

    return (
        <div {...delegated}>
            { children }
        </div>

    )
}

export default RenderOnClientOnly
