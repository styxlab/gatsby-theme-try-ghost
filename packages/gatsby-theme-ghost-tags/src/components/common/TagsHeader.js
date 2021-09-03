import React from 'react'
import PropTypes from 'prop-types'

const TagsHeader = ({title}) => {

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

TagsHeader.propTypes = {
    title: PropTypes.string.isRequired,
}

export default TagsHeader