import React from 'react'
import PropTypes from 'prop-types'

/**
 *
 * Further info 👉🏼 https://www.gatsbyjs.org/blog/2019-01-31-using-react-context-api-with-gatsby/
 *
 */

const ThemeContext = React.createContext({ dark: null })

// Getting dark mode information from OS!
// You need macOS Mojave + Safari Technology Preview Release 68 to test this currently.
const supportsDarkMode = () => window.matchMedia(`(prefers-color-scheme: dark)`).matches === true

const supportsLightMode = () => window.matchMedia(`(prefers-color-scheme: light)`).matches === true

const getLocalStoragelsDark = () => JSON.parse(localStorage.getItem(`dark`))

export const getDefault = (defaultMode, overrideOS) => {
    const lsDark = getLocalStoragelsDark()
    if (lsDark !== null) {
        return lsDark
    } else if (overrideOS) {
        return defaultMode
    } else if (supportsDarkMode()) {
        return true
    } else if (supportsLightMode()) {
        return false
    } else {
        return defaultMode
    }
}

class ThemeProvider extends React.Component {
    state = {
        dark: getDefault(this.props.defaultMode, this.props.overrideOS),
    }

    toggleDark = () => {
        if (this.state.dark === null) {
            return
        }
        const dark = !this.state.dark
        localStorage.setItem(`dark`, JSON.stringify(dark))
        this.setState({ dark })
    }

    render() {
        const { children } = this.props
        const { dark } = this.state
        return <ThemeContext.Provider value={{ dark, toggleDark: this.toggleDark }}>{children}</ThemeContext.Provider>
    }
}

ThemeProvider.propTypes = {
    defaultMode: PropTypes.bool.isRequired,
    overrideOS: PropTypes.bool.isRequired,
}

export default ThemeContext

export { ThemeProvider }
