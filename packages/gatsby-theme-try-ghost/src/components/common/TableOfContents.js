import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'
import styled from "styled-components"
import { useActiveHash } from "./effects/use-active-hash"

/*
 * styles passed into styled(Component) don't overwrite base styles #1816
 * https://github.com/styled-components/styled-components/issues/1816
*/
const TocContainer = styled.aside`
    order: 1;
`
const TocDiv = styled.div`
    && {
        position: sticky;
        top: 120px;
        min-width: 260px;
        font-family: -apple-system, Liberation Sans, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
            Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif;
        font-size: 1.4rem;
        line-height: 1.5em;
        padding: 0 0.8em;
    }
`
const TocTitle = styled.h2`
    && {
        color: #78757a;
        font-size: 1.2rem;
        letter-spacing: 0.075em;
        margin-top: 0rem;
        margin-bottom: 2rem;
        text-transform: uppercase;
        font-weight: 700;
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
        padding-top: 0.6rem;
        padding-left: 0.9rem;
    }
`
const TocListSub = styled.ul`
    && {
        margin-top: 0.5rem;
        padding-left: 1.6rem;
    }
`
const TocItem = styled.li`
    && {
        list-style: none;
        margin-bottom: calc(1.5rem / 2);
    }
`
const TocLink = styled(Link)`
    && {
        height: 100%;
        box-shadow: none;
        color: #78757a;
        text-decoration: none;

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
        &:focus{
            &::before {
                background-color:#54BC4B;
            }
        }
    }
`
const getHeadingIds = (toc, traverseFullDepth = true, maxDepth, recursionDepth = 1) => {
    const idList = []
    const hashToId = str => str.slice(1)

    if (toc) {
        for (const item of toc) {
            item.url && idList.push(hashToId(item.url))

            // Only traverse sub-items if specified (they are not displayed in ToC)
            // recursion depth should only go up to 6 headings deep and may come in as
            // undefined if not set in the tableOfContentsDepth frontmatter field
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

const createItems = (toc, url, depth, maxDepth, activeHash) => (
    toc.map((head, index) => {
        const isActive = head.id === `${activeHash}`

        return (
            <TocItem key={location.pathname + (head.id || depth + `-` + index)}>
                {head.id &&
                    <TocLink
                        getProps={({ href, location }) => (location && location.href && location.href.includes(href) ? {
                            style: { color: `#3eb0ef`,
                                borderBottom: `1px solid #3eb0ef`},
                        } : null)}
                        to={`${url}#${head.id}`}>{head.heading}</TocLink>
                }
                {head.items && isUnderDepthLimit(depth, maxDepth) &&
                    <TocListSub>
                        {createItems(head.items, url, depth + 1, maxDepth)}
                    </TocListSub>
                }
            </TocItem>
        )
    })
)

const TableOfContents = ({ toc, url, maxDepth = 3 }) => {
    const activeHash = useActiveHash(getHeadingIds(toc, true, maxDepth))

    return (
        <TocContainer>
            <TocDiv>
                <nav>
                    <TocTitle>
                        Table of Contents
                    </TocTitle>
                    <TocList>
                        {createItems(toc, url, 1, maxDepth, activeHash)}
                    </TocList>
                </nav>
            </TocDiv>
        </TocContainer>
    )
}

TableOfContents.propTypes = {
    toc: PropTypes.arrayOf(
        PropTypes.object,
    ).isRequired,
    url: PropTypes.string.isRequired,
    depth: PropTypes.number,
}

export default TableOfContents
