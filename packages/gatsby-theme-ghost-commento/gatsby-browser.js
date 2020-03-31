import React from "react"
import PropTypes from 'prop-types'
import { ThemeProvider } from "./src/context/ThemeContext"

export const wrapPageElement = ({ element }, themeOptions) => {
    const {
        url = ``,
    } = themeOptions

    return (
        <ThemeProvider url={url}>{element}</ThemeProvider>
    )
}

wrapPageElement.propTypes = {
    element: PropTypes.object.isRequired,
    themeOptions: PropTypes.object.isRequired,
}
