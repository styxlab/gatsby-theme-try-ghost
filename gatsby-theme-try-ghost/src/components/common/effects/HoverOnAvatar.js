import React from 'react'
import PropTypes from 'prop-types'

export default class HoverOnAvatar extends React.Component {
    constructor(props) {
        super(props)
        this.anchorRef = React.createRef()
        this.activeClass = this.props.activeClass,
        this.hoverTimeout = null,
        this.state = {}
    }

    componentDidMount() {
        this.anchorRef.current.addEventListener(`mouseout`, this.onHoverOut, { passive: true })
        this.anchorRef.current.addEventListener(`mouseover`, this.onHoverIn, { passive: true })
    }

    componentWillUnmount() {
        clearTimeout(this.hoverTimeout)
        this.anchorRef.current.removeEventListener(`mouseover`, this.onHoverIn, { passive: true })
        this.anchorRef.current.removeEventListener(`mouseout`, this.onHoverOut, { passive: true })
    }

    onHoverIn = () => {
        clearTimeout(this.hoverTimeout)
        this.setState({ currentClass: this.activeClass })
    }

    onHoverOut = () => {
        let self = this
        this.hoverTimeout = setTimeout(function () {
            self.setState({ currentClass: `` })
        },800)
    }

    render() {
        return this.props.render(this)
    }
}

HoverOnAvatar.propTypes = {
    render: PropTypes.func.isRequired,
    activeClass: PropTypes.string.isRequired,
}
