import React from "react"
import PropTypes from 'prop-types'

/**
*
* Further info 👉🏼 https://www.gatsbyjs.org/blog/2019-01-31-using-react-context-api-with-gatsby/
*
*/

const defaultState = {
    url: ``,
}

const ThemeContext = React.createContext(defaultState)

class ThemeProvider extends React.Component {
    state = {
        url: ``,
    }

    componentDidMount() {
        this.setState({ url: this.props.url })
    }

    render() {
        const { children } = this.props
        const { url } = this.state
        return (
            <ThemeContext.Provider value={{ url }}>
                {children}
            </ThemeContext.Provider>
        )
    }
}

ThemeProvider.propTypes = {
    url: PropTypes.string.isRequired,
}

export default ThemeContext

export { ThemeProvider }
