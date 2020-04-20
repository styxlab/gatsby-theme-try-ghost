/**
*
* Further info 👉🏼 https://github.com/gatsbyjs/gatsby/blob/master/www/src/hooks/use-active-hash.js
*
*/

import { useEffect, useState } from "react"

export const useActiveHash = (itemIds, rootMargin = undefined) => {
    const [activeHash, setActiveHash] = useState(``)

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveHash(entry.target.id)
                }
            })
        },
        { rootMargin: rootMargin || `0% 0% -90% 0%` })

        itemIds
            .filter(id => id !== `error-missing-id`)
            .forEach(id => observer.observe(document.getElementById(id)))

        return () => itemIds
            .filter(id => id !== `error-missing-id`)
            .forEach(id => observer.unobserve(document.getElementById(id)))
    }, [])

    return activeHash
}
