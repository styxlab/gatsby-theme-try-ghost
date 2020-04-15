import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'
import styled from "styled-components"
import { useEffect, useState } from "react"
import { useActiveHash } from "./effects/use-active-hash"

/*
 * styles passed into styled(Component) don't overwrite base styles #1816
 * https://github.com/styled-components/styled-components/issues/1816
*/
const TocAside = styled.aside`
    order: 1;
    font-family: -apple-system, Liberation Sans, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
        Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif;
    line-height: 1.5em;
    font-size: 1.6rem;

    @media (min-width: 1170px) {
        position: sticky;
        top: 120px;
        min-width: 260px;
        font-size: 1.4rem;
        padding: 0 0.8em;
    }
`

const TocTitle = styled.h2`
    && {
        color: #78757a;
        font-size: 1.4rem;
        letter-spacing: 0.075em;
        margin-top: 0rem;
        margin-bottom: 2rem;
        text-transform: uppercase;
        font-weight: 700;

        @media (min-width: 1170px) {
            font-size: 1.2rem;
        }
`
const TocList = styled.ul`
    && {
        overflow:hidden;
        position:relative;
        list-style: none;
        margin:0;
        padding:0;
        margin-top: -1.6rem;
        margin-bottom: 2.0rem;
        padding-top: 0.6rem;
        padding-left: 0.9rem;
    }
`
const TocListSub = styled.ul`
    && {
        margin-top: 0.5rem;
        padding-left: 1.6rem;
        margin-bottom: 0.1rem;
    }
`
const TocItem = styled.li`
    && {
        list-style: none;
        margin-bottom: calc(1.5rem / 2);
    }
`

/*
 * Unsolved issue with dark mode: Global dark mode overwrites the color attribute.
 * Need to inject the DarkMode Provider to handle this?
*/
const TocLink = styled(Link)`
    && {
        height: 100%;
        box-shadow: none;
        color: ${props => (props.state.isActive ? `#54BC4B` : `#78757A`)};
        border-bottom: ${props => (props.state.isActive ? `1px solid #54BC4B` : `none`)};
        text-decoration: none;

        &:hover {
            color: #54BC4B;
            border-bottom: 1px solid #54BC4B;
            text-decoration: none;
            box-shadow: none;
        }

        &::before {
            background-color: #EEE;
            content:' ';
            display: inline-block;
            height: inherit;
            left: 0;
            position:absolute;
            width: 2px;
            margin-left: 1px;
        }

        &::before {
            background-color: ${props => (props.state.isActive ? `#54BC4B` : `#EEE`)};
        }
    }
`
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

const TableOfContents = ({ toc, url, maxDepth = 3 }) => {
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
        <TocAside>
            <nav>
                <TocTitle>
                    Table of Contents
                </TocTitle>
                <TocList>
                    {createItems(toc, url, 1, maxDepth, activeHash, isDesktop)}
                </TocList>
            </nav>
        </TocAside>
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
