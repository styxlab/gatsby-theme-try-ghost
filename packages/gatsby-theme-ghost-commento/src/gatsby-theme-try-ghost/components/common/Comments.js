import React from 'react'
import PropTypes from 'prop-types'

import { Commento } from '../../../components/common'
import ThemeContext from '../../../context/ThemeContext'

// The actual component
const Comments = ({ id }) => (
    <ThemeContext.Consumer>{theme => (
        <section className="post-full-content">
            <Commento id={id} url={theme.url} />
        </section>
    )}
    </ThemeContext.Consumer>
)

Comments.propTypes = {
    id: PropTypes.string.isRequired,
}

export default Comments
