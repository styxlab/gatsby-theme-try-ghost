import React from 'react'
import PropTypes from 'prop-types'

import { Subscribe } from '../../../components/common'

// The actual component
const SubscribeWrapper = ({ url }) => (
    <section className="subscribe-form">
        <Subscribe url={url} />
    </section>
)

SubscribeWrapper.propTypes = {
    url: PropTypes.string.isRequired,
}

export default SubscribeWrapper
