import React from 'react'
import PropTypes from 'prop-types'

import { SubscribeOverlay } from '../../../components/common'

const SubscribeOverlayWrapper = ({ overlay }) => (
    <SubscribeOverlay overlay={overlay}/>
)

SubscribeOverlayWrapper.propTypes = {
    overlay: PropTypes.object.isRequired,
}

export default SubscribeOverlayWrapper
