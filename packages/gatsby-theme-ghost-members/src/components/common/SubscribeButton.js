import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { useLang, get } from '../../utils/use-lang'

const StyledButton = styled.a`
    &:hover {
        text-decoration: none;
        opacity: 1;
        cursor: pointer;
    }
`

const SubscribeButton = ({ overlay }) => {
    const text = get(useLang())

    return (
        <React.Fragment>
            { overlay &&
                <StyledButton className="subscribe-button" onClick={overlay.handleOpen}>{text(`SUBSCRIBE`)}</StyledButton>
            }
        </React.Fragment>
    )
}

SubscribeButton.propTypes = {
    data: PropTypes.shape({
        ghostConfig: PropTypes.object.isRequired,
    }).isRequired,
    overlay: PropTypes.object,
}

export default SubscribeButton
