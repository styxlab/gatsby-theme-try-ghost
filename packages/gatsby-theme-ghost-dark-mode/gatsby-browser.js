import React from "react"
import PropTypes from 'prop-types'
import { ThemeProvider } from "./src/context/ThemeContext"

export const wrapRootElement = ({ element }, themeOptions) => {
    const { defaultModeDark } = themeOptions
    return (
        <ThemeProvider defaultMode={defaultModeDark}>{element}</ThemeProvider>
    )
}

wrapRootElement.propTypes = {
    element: PropTypes.object.isRequired,
    themeOptions: PropTypes.object.isRequired,
}
