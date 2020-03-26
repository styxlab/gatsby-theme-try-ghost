import React from 'react'
import SunIcon from './icons/sun-icon'
import MoonIcon from './icons/moon-icon'
import styled from 'styled-components'
import useDarkMode from 'use-dark-mode'

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

const DarkModeToggle = () => {
    const darkMode = useDarkMode(false, { classNameDark: `dark`, classNameLight: `light` })

    return (
        <Button className="rss-button" onClick={darkMode.toggle}>
            { darkMode.value ? (
                <SunIconWrapper><SunIcon /></SunIconWrapper>
            ) : (
                <MoonIconWrapper><MoonIcon /></MoonIconWrapper>
            )}
        </Button>
    )
}

export default DarkModeToggle
