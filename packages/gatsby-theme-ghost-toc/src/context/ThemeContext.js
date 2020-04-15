import React from "react"
import PropTypes from 'prop-types'

/**
*
* Further info 👉🏼 https://www.gatsbyjs.org/blog/2019-01-31-using-react-context-api-with-gatsby/
*
*/

const defaultState = {
    maxDepth: 2,
}

const ThemeContext = React.createContext(defaultState)

class ThemeProvider extends React.Component {
    state = {
        maxDepth: 2,
    }

    componentDidMount() {
        this.setState({
            maxDepth: this.props.maxDepth,
        })
    }

    render() {
        const { children } = this.props
        const { maxDepth } = this.state
        return (
            <ThemeContext.Provider value={{ maxDepth }}>
                {children}
            </ThemeContext.Provider>
        )
    }
}

ThemeProvider.propTypes = {
    maxDepth: PropTypes.number.isRequired,
}

export default ThemeContext

export { ThemeProvider }
