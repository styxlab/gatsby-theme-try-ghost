import React from "react"
import PropTypes from 'prop-types'
import { GlobalStateProvider } from "./src/context/GlobalState"

/**
 * Infinite Scroll
 *
 * Further info 👉🏼 https://github.com/baobabKoodaa/blog
 */

export const wrapRootElement = ({ element }) => (
    <GlobalStateProvider>
        {element}
    </GlobalStateProvider>
)

wrapRootElement.propTypes = {
    element: PropTypes.object.isRequired,
}

/**
 * Trust All Scripts
 *
 * This is a dirty little script for iterating over script tags
 * of your Ghost posts and adding them to the document head.
 *
 * This works for any script that then injects content into the page
 * via ids/classnames etc.
 *
 */

const trustAllScripts = () => {
    const scriptNodes = document.querySelectorAll(`.load-external-scripts script`)

    for (var i = 0; i < scriptNodes.length; i += 1) {
        var node = scriptNodes[i]
        var s = document.createElement(`script`)
        s.type = node.type || `text/javascript`

        if (node.attributes.src) {
            s.src = node.attributes.src.value
        } else {
            s.innerHTML = node.innerHTML
        }

        document.getElementsByTagName(`head`)[0].appendChild(s)
    }
}

export const onRouteUpdate = () => trustAllScripts()
