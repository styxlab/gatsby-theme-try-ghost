import React from 'react'
import PropTypes from 'prop-types'

const TagHeader = ({title}) => {

    return (
        <div className="inner">
            <article className={`post-full`}>
                <header className="post-full-header">
                    <h1 className="post-full-title">{title}</h1>
                </header>
            </article>
        </div>
    )
}

TagHeader.propTypes = {
    title: PropTypes.string.isRequired,
}

export default TagHeader