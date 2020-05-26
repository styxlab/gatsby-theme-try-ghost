import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const StyledButton = styled.a`
    &:hover {
        text-decoration: none;
        opacity: 1;
        cursor: pointer;
    }
`

const SubscribeButton = ({ overlay }) => (
    <React.Fragment>
        { overlay &&
            <StyledButton className="subscribe-button" onClick={overlay.handleOpen}>Subscribe</StyledButton>
        }
    </React.Fragment>
)

SubscribeButton.propTypes = {
    overlay: PropTypes.object,
}

export default SubscribeButton
