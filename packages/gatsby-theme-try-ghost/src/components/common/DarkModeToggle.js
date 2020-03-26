import React from 'react'
import PropTypes from 'prop-types'
import SunIcon from './icons/sun-icon'
import MoonIcon from './icons/moon-icon'
import styled from 'styled-components'

const Button = styled.button`
    background-color: transparent;
`
const SunIconWrapper = styled.div`
    & > svg {
        height: 1.9rem;
    }
`
const MoonIconWrapper = styled.div`
    & > svg {
        height: 1.7rem;
        margin-left: 0.2rem;
    }
`

const DarkModeToggle = ({ theme }) => (
    <Button className="rss-button" onClick={theme.toggle}>
        { theme.flavor === `dark` ? (
            <SunIconWrapper><SunIcon /></SunIconWrapper>
        ) : (
            <MoonIconWrapper><MoonIcon /></MoonIconWrapper>
        )}
    </Button>
)

DarkModeToggle.propTypes = {
    theme: PropTypes.shape({
        flavor: PropTypes.string.isRequired,
        toggle: PropTypes.func.isRequired,
    }).isRequired,
}

export default DarkModeToggle
