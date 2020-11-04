import React from "react"
import PropTypes from 'prop-types'
import { ThemeProvider, getDefault } from "./src/context/ThemeContext"

export const wrapRootElement = ({ element }, themeOptions) => {
    const {
        defaultModeDark = false,
        overrideOS = false,
    } = themeOptions

    return (
        <ThemeProvider defaultMode={getDefault(defaultModeDark, overrideOS)} overrideOS={overrideOS}>{element}</ThemeProvider>
    )
}

wrapRootElement.propTypes = {
    element: PropTypes.object.isRequired,
    themeOptions: PropTypes.object.isRequired,
}
