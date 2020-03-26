import React from 'react'
import PropTypes from 'prop-types'

export default class DarkThemeProvider extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            flavor: `light`,
            toggle: this.toggleTheme.bind(this),
        }
    }

    toggleTheme() {
        if (this.state.flavor === `light`) {
            this.setState({ flavor: `dark` })
            document.querySelector(`body`).classList.add(`dark`)
        } else {
            this.setState({ flavor: `light` })
            document.querySelector(`body`).classList.remove(`dark`)
        }
    }

    render() {
        return this.props.render(this)
    }
}

DarkThemeProvider.propTypes = {
    render: PropTypes.func.isRequired,
}
