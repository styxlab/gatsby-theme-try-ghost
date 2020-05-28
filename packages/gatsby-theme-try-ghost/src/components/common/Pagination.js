import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'

import { useLang, get } from '../../utils/use-lang'

const Pagination = ({ pageContext }) => {
    const text = get(useLang())
    const { previousPagePath, nextPagePath } = pageContext

    return (
        <nav className="pagination" role="navigation">
            <div>
                { previousPagePath &&
                    <Link to={previousPagePath} rel="prev">← {text(`PREVIOUS`)}</Link>
                }
            </div>
            <div>
                {nextPagePath &&
                    <Link to={nextPagePath} rel="next">{text(`NEXT`)} →</Link>
                }
            </div>
        </nav>
    )
}

Pagination.propTypes = {
    pageContext: PropTypes.object.isRequired,
}

export default Pagination
