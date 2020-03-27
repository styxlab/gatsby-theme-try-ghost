import React from "react"
import PropTypes from 'prop-types'

/**
*
* Further info 👉🏼 https://www.gatsbyjs.org/blog/2019-01-31-using-react-context-api-with-gatsby/
*
*/

const defaultState = {
    dark: false,
    toggleDark: () => {},
}

const ThemeContext = React.createContext(defaultState)

// Getting dark mode information from OS!
// You need macOS Mojave + Safari Technology Preview Release 68 to test this currently.
const supportsDarkMode = () => {
    window.matchMedia(`(prefers-color-scheme: dark)`).matches === true
}
const supportsLightMode = () => {
    window.matchMedia(`(prefers-color-scheme: light)`).matches === true
}

class ThemeProvider extends React.Component {
    state = {
        dark: false,
    }

    toggleDark = () => {
        let dark = !this.state.dark
        localStorage.setItem(`dark`, JSON.stringify(dark))
        this.setState({ dark })
    }

    componentDidMount() {
        // Getting dark mode value from localStorage!
        const lsDark = JSON.parse(localStorage.getItem(`dark`))
        if (lsDark) {
            this.setState({ dark: lsDark })
        } else if (this.props.overrideOS) {
            this.setState({ dark: this.props.defaultMode })
        } else if (supportsDarkMode()) {
            this.setState({ dark: true })
        } else if (supportsLightMode()) {
            this.setState({ dark: false })
        } else {
            this.setState({ dark: this.props.defaultMode })
        }
    }

    render() {
        const { children } = this.props
        const { dark } = this.state
        return (
            <ThemeContext.Provider value={{ dark, toggleDark: this.toggleDark }}>
                {children}
            </ThemeContext.Provider>
        )
    }
}

ThemeProvider.propTypes = {
    defaultMode: PropTypes.bool.isRequired,
    overrideOS: PropTypes.bool.isRequired,
}

export default ThemeContext

export { ThemeProvider }
