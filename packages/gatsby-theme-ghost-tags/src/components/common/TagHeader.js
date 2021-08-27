import React from 'react'
import { useLang, get } from '../../utils/use-lang'

const TagHeader = () => {
    const text = get(useLang()) 

    return (
        <div className="inner">
            <article className={`post-full`}>
                <header className="post-full-header">
                    <h1 className="post-full-title">{text(`TAGS`)}</h1>
                </header>
            </article>
        </div>
    )
}

export default TagHeader