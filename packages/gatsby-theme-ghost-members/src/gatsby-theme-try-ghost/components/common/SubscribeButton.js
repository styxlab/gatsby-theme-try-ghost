import React from 'react'
import PropTypes from 'prop-types'

import { SubscribeButton } from '../../../components/common'

const SubscribeButtonWrapper = ({ overlay }) => (
    <SubscribeButton overlay={overlay}/>
)

SubscribeButtonWrapper.propTypes = {
    overlay: PropTypes.object.isRequired,
}

export default SubscribeButtonWrapper
