import React from 'react'
import SunIcon from './icons/sun-icon'
import MoonIcon from './icons/moon-icon'
import styled from 'styled-components'

import ThemeContext from '../../context/ThemeContext'
import { useLang, get } from '../../utils/use-lang'

const Button = styled.button`
    background-color: transparent;
`
const SunIconWrapper = styled.div`
    &&& {
        & > svg {
            height: 1.9rem;
        }
    }
`
const MoonIconWrapper = styled.div`
    &&& {
        & > svg {
            height: 1.7rem;
            margin-left: 0.2rem;
        }
    }
`

const DarkModeToggle = () => {
    const text = get(useLang())

    return (
        <ThemeContext.Consumer>{theme => (
            <Button className="rss-button" onClick={theme.toggleDark} title={text(`DARK_MODE`)}>
                { theme.dark === null ? (
                    <MoonIconWrapper><svg viewBox="0 0 512 512"></svg></MoonIconWrapper>
                ) : theme.dark ? (
                    <SunIconWrapper><SunIcon /></SunIconWrapper>
                ) : (
                    <MoonIconWrapper><MoonIcon /></MoonIconWrapper>
                )}
            </Button>
        )}
        </ThemeContext.Consumer>
    )
}

export default DarkModeToggle
