import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

/**
*
* Credits to 👉🏼 https://nehalist.io/adding-commento-to-react-apps-like-gatsby/#commento-login-box-container
*
*/

// Helper to add scripts to our page
const insertScript = (src, id, parentElement) => {
    const script = window.document.createElement(`script`)
    script.async = true
    script.src = src
    script.id = id
    parentElement.appendChild(script)

    return script
}

// Helper to remove scripts from our page
const removeScript = (id, parentElement) => {
    const script = window.document.getElementById(id)
    if (script) {
        parentElement.removeChild(script)
    }
}

// The actual component
const Commento = ({ id, url }) => {
    useEffect(() => {
        // If there's no window there's nothing to do for us
        if (!window || !url) {
            return
        }
        const document = window.document
        // In case our #commento container exists we can add our commento script
        if (document.getElementById(`commento`)) {
            //url: <your comment url>
            insertScript(`${url}/js/commento.js`, `commento-script`, document.body)
        }

        // Cleanup remove the script from the page
        /* eslint-disable consistent-return */
        return () => removeScript(`commento-script`, document.body)
    }, [id, url])

    return <div id={`commento`} />
}

Commento.propTypes = {
    id: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
}

export default Commento
