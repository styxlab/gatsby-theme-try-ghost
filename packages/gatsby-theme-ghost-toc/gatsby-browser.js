import React from "react"
import PropTypes from 'prop-types'
import { ThemeProvider } from "./src/context/ThemeContext"

export const wrapPageElement = ({ element }, themeOptions) => {
    const {
        maxDepth = 2,
    } = themeOptions

    return (
        <ThemeProvider maxDepth={maxDepth}>{element}</ThemeProvider>
    )
}

wrapPageElement.propTypes = {
    element: PropTypes.object.isRequired,
    themeOptions: PropTypes.object.isRequired,
}
