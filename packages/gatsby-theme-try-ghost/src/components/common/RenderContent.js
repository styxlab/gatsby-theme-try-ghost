import React from 'react'
import PropTypes from 'prop-types'
import rehypeReact from 'rehype-react'

import { ImgSharpInline } from '.'

const renderAst = new rehypeReact({
    Fragment: React.Fragment,
    createElement: React.createElement,
    components: { "img-sharp-inline": ImgSharpInline },
}).Compiler

const RenderContent = ({ htmlAst, html }) => (
    <React.Fragment>
        { htmlAst ? (
            <div className="post-content load-external-scripts">
                { renderAst(htmlAst) }
            </div>
        ) : (
            <div className="post-content load-external-scripts"
                dangerouslySetInnerHTML={{ __html: html }}/>
        )}
    </React.Fragment>
)

RenderContent.propTypes = {
    htmlAst: PropTypes.object,
    html: PropTypes.string.isRequired,
}

export default RenderContent
