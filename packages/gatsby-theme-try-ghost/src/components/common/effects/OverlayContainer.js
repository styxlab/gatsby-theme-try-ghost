import React from 'react'
import PropTypes from 'prop-types'

/**
*
* Placeholder for OverlayContainer
*
*/

class OverlayContainer extends React.Component {
    render() {
        return this.props.render(this)
    }
}

OverlayContainer.propTypes = {
    render: PropTypes.func.isRequired,
}

export default OverlayContainer
