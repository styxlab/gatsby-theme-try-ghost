import React from 'react'
import PropTypes from 'prop-types'

export default class StickyNavContainer extends React.Component {
    constructor(props) {
        super(props)
        this.anchorRef = React.createRef()
        this.activeClass = this.props.activeClass,
        this.isPost = this.props.isPost || false,
        this.state = {
            ticking: false,
        }
    }

    componentDidMount() {
        window.addEventListener(`scroll`, this.onScroll, { passive: true })
    }

    componentWillUnmount() {
        window.removeEventListener(`scroll`, this.onScroll, { passive: true })
    }

    onScroll = () => {
        this.setState({ lastScrollY: window.scrollY })
        this.requestTick()
    }

    requestTick = () => {
        if (!this.state.ticking) {
            requestAnimationFrame(this.update)
        }
        this.setState({ ticking: false })
    }

    update = () => {
        var top = this.anchorRef.current.getBoundingClientRect().top
        var trigger = top + window.scrollY
        var triggerOffset = -20

        if (this.isPost){
            triggerOffset = this.anchorRef.current.offsetHeight + 35
        }

        if (this.state.lastScrollY >= trigger + triggerOffset) {
            this.setState({ currentClass: this.activeClass })
        } else {
            this.setState({ currentClass: `` })
        }

        this.setState({ ticking: false })
    }

    render() {
        return this.props.render(this)
    }
}

StickyNavContainer.propTypes = {
    render: PropTypes.func.isRequired,
    activeClass: PropTypes.string.isRequired,
    isPost: PropTypes.bool,
}
