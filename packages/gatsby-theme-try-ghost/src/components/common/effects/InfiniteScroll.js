import React from 'react'
import PropTypes from 'prop-types'

const throttle = require(`lodash.throttle`)

class InfiniteScroll extends React.Component {
    constructor(props) {
        super(props)
        this.scrollHandler = this.scrollHandler.bind(this)
        this.resizeHandler = this.resizeHandler.bind(this)
    }

    scrollHandler = () => {}

    resizeHandler = () => {}

    componentDidMount() {
        this.scrollHandler = throttle(this.checkWindowScroll, this.props.throttle)
        this.resizeHandler = throttle(this.checkWindowScroll, this.props.throttle)

        window.addEventListener(`scroll`, this.scrollHandler, { passive: true })
        window.addEventListener(`resize`, this.resizeHandler, { passive: true })
    }

    componentWillUnmount() {
        window.removeEventListener(`scroll`, this.scrollHandler)
        window.removeEventListener(`resize`, this.resizeHandler)
    }

    componentDidUpdate() {
        this.scrollHandler()
    }

    checkWindowScroll = () => {
        //console.log("Window height " + window.innerHeight + " Sentinel boundingRectTop " + this.sentinel.getBoundingClientRect().top)
        if (this.props.isLoading) {
            return
        }
        if (this.props.hasMore && this.props.threshold && this.sentinel &&
            this.sentinel.getBoundingClientRect().top - window.innerHeight < this.props.threshold
        ) {
            this.props.onLoadMore()
        }
    }

    render() {
        const sentinel = <div ref={i => this.sentinel = i} />

        if (this.props.render) {
            return this.props.render({
                sentinel,
                children: this.props.children,
            })
        }

        if (this.props.component) {
            const Container = this.props.component
            return (
                <Container sentinel={sentinel}>
                    {this.props.children}
                </Container>
            )
        }

        return (
            <React.Fragment>
                {this.props.children}
                {sentinel}
            </React.Fragment>
        )
    }
}

InfiniteScroll.propTypes = {
    hasMore: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    onLoadMore: PropTypes.func.isRequired,
    threshold: PropTypes.number,
    throttle: PropTypes.number,
    children: PropTypes.object,
    render: PropTypes.object,
    component: PropTypes.object,
}

export default InfiniteScroll
