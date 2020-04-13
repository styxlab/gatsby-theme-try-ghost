import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'
//import { jsx } from 'theme-ui'

const createItems = (toc, url, depth, maxDepth) => {
    return (
        toc.map((head, index) => (
            <li className="toc-item" key={location.pathname + (head.url || depth + `-` + index)}>
                {head.id &&
                    <Link className="toc-link" to={`${url}#${head.id}`}>{head.heading}</Link>
                }
                {head.items &&
                    <ul className="toc-list">
                        {createItems(head.items, url, depth + 1, maxDepth)}
                    </ul>
                }
            </li>
        ))
    )
}

const TableOfContents = ({ toc, url }) => (
    <aside className="toc-container">
        <div className="toc">
            <nav className="toc">
                <h2>Table of Contents</h2>
                <ul className="toc-list">
                    {createItems(toc, url, 1, 5)}
                </ul>
            </nav>
        </div>
    </aside>
)

//const isUnderDepthLimit = (depth, maxDepth) => {
//    if (maxDepth === null) {
//        // if no maxDepth is passed in, continue to render more items
//        return true
//    } else {
//        return depth < maxDepth
//    }
//}

//// depth and maxDepth are used to figure out how many bullets deep to render in the ToC sidebar, if no
//// max depth is set via the tableOfContentsDepth field in the frontmatter, all headings will be rendered
//const createItems = (toc, url, depth, maxDepth) => {
//    return (
//        toc.map((item, index) => (
//            <li key={location.pathname + (item.url || depth + `-` + index)}>
//                {item.id && (
//                    <Link sx={{ "&&": {
//                        color: `textMuted`,
//                        border: 0,
//                        transition: t => `all ${t.transition.speed.fast} ${t.transition.curve.default}`,
//                        ":hover": {
//                            color: `link.color`,
//                            borderBottom: t => `1px solid ${t.colors.link.hoverBorder}`,
//                        },
//                    }}}
//                    getProps={({ href, location }) => (location && location.href && location.href.includes(href) ? {
//                        style: { color: `#F00`,
//                            borderBottom: `1px solid #00F` },
//                    } : null)}
//                    to={`${url}#${item.id}`}>{item.heading}</Link>
//                )}
//                {item.items && isUnderDepthLimit(depth, maxDepth) && (
//                    <ul sx={{ color: `textMuted`, listStyle: `none`, ml: 5 }}>
//                        {createItems(item.items, url, depth + 1, maxDepth)}
//                    </ul>
//                )}
//            </li>
//        ))
//    )
//}
//
//const TableOfContents = ({ toc, url }) => {
//    return toc.length > 0 ? (
//        <nav sx={{
//            mb: [8, null, null, null, null, 0],
//            pb: [6, null, null, null, null, 0],
//            borderBottom: t => [
//                `1px solid #000`,
//                null,null,null,null,0],
//        }}>
//            <h2 sx={{ color: `textMuted`,
//                fontSize: 1, letterSpacing: `tracked`,
//                mt: 0, textTransform: `uppercase` }}>Table of Contents</h2>
//            <ul sx={{ listStyle: `none`, m: 0 }}>
//                {createItems(toc, url, 1, 5)}
//            </ul>
//        </nav>
//    ) : null
//}

TableOfContents.propTypes = {
    toc: PropTypes.arrayOf(
        PropTypes.object,
    ).isRequired,
    url: PropTypes.string.isRequired,
}

export default TableOfContents
