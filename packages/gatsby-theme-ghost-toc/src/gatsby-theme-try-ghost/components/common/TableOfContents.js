import React from 'react'
import PropTypes from 'prop-types'
import { useEffect, useState } from "react"

import ThemeContext from '../../../context/ThemeContext'
import { useActiveHash } from '../../../components/common/effects/use-active-hash'

import {
    TocAside,
    TocTitle,
    TocList,
    TocListSub,
    TocItem,
    TocLink,
} from '../../../components/common/TableOfContentStyles'

const getHeadingIds = (toc, traverseFullDepth = true, maxDepth, recursionDepth = 1) => {
    const idList = []

    if (toc) {
        for (const item of toc) {
            item.id && idList.push(item.id)

            if (item.items && traverseFullDepth && recursionDepth < (maxDepth || 6)) {
                idList.push(
                    ...getHeadingIds(item.items, true, maxDepth, recursionDepth + 1)
                )
            }
        }
    }
    return idList
}

const isUnderDepthLimit = (depth, maxDepth) => (maxDepth === null ? true : depth < maxDepth)

const createItems = (toc, url, depth, maxDepth, activeHash, isDesktop) => (
    toc.map((head, index) => {
        const isActive = isDesktop && head.id === `${activeHash}`
        return (
            <TocItem key={location.pathname + (head.id || depth + `-` + index)}>
                {head.id &&
                    <TocLink state = {{ isActive }} to={`${url}#${head.id}`}>
                        {head.heading}
                    </TocLink>
                }
                {head.items && isUnderDepthLimit(depth, maxDepth) &&
                    <TocListSub>
                        {createItems(head.items, url, depth + 1, maxDepth, activeHash, isDesktop)}
                    </TocListSub>
                }
            </TocItem>
        )
    })
)

const TableOfContents = ({ toc, url, maxDepth = 2 }) => {
    const [isDesktop, setIsDesktop] = useState(false)
    const activeHash = useActiveHash(getHeadingIds(toc, true, maxDepth))

    useEffect(() => {
        const isDesktopQuery = window.matchMedia(`(min-width: 1170px)`)
        setIsDesktop(isDesktopQuery.matches)

        const updateIsDesktop = e => setIsDesktop(e.matches)
        isDesktopQuery.addListener(updateIsDesktop)
        return () => isDesktopQuery.removeListener(updateIsDesktop)
    }, [])

    return (
        <ThemeContext.Consumer>{theme => (
            <TocAside>
                <nav>
                    <TocTitle>
                        Table of Contents
                    </TocTitle>
                    <TocList>
                        {createItems(toc, url, 1, theme.maxDepth || maxDepth, activeHash, isDesktop)}
                    </TocList>
                </nav>
            </TocAside>
        )}
        </ThemeContext.Consumer>
    )
}

TableOfContents.propTypes = {
    toc: PropTypes.arrayOf(
        PropTypes.object,
    ).isRequired,
    url: PropTypes.string.isRequired,
    maxDepth: PropTypes.number,
}

export default TableOfContents
