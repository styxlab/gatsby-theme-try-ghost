import React from 'react'
import PropTypes from 'prop-types'

import { Subscribe } from '../../../components/common'

// The actual component
const SubscribeSection = ({ url }) => (
    <section className="subscribe-form">
        <Subscribe url={url} />
    </section>
)

SubscribeSection.propTypes = {
    url: PropTypes.string.isRequired,
}

export default SubscribeSection
