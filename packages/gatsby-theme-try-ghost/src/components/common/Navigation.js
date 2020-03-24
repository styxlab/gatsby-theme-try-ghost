import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'

/**
* Navigation component
*
* The Navigation component takes an array of your Ghost
* navigation property that is fetched from the settings.
* It differentiates between absolute (external) and relative link (internal).
* You can pass it a custom class for your own styles, but it will always fallback
* to a `site-nav-item` class.
*
*/
const Navigation = ({ data, navClass }) => {
    const items = []

    data.map((navItem, i) => {
        if (navItem.url.match(/^\s?http(s?)/gi)) {
            items.push(<li key={i} className={`nav-${navItem.label.toLowerCase()}`} role="menuitem"><a className={navClass} href={navItem.url} target="_blank" rel="noopener noreferrer">{navItem.label}</a></li>)
        } else {
            items.push(<li key={i} className={`nav-${navItem.label.toLowerCase()}`} role="menuitem"><Link className={navClass} to={navItem.url}>{navItem.label}</Link></li>)
        }
    })

    return (
        <ul className="nav" role="menu">
            {items}
        </ul>
    )
}

Navigation.defaultProps = {
    navClass: `nav-home nav-current`,
}

Navigation.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            url: PropTypes.string.isRequired,
        }).isRequired,
    ).isRequired,
    navClass: PropTypes.string,
}

export default Navigation
