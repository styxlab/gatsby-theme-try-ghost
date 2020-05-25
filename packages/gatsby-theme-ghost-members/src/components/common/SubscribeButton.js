import React from 'react'
import PropTypes from 'prop-types'

const SubscribeButton = ({ overlay }) => (
    <React.Fragment>
        { overlay &&
            <a className="subscribe-button" onClick={overlay.handleOpen} >Subscribe</a>
        }
    </React.Fragment>
)

SubscribeButton.propTypes = {
    overlay: PropTypes.object,
}

export default SubscribeButton
