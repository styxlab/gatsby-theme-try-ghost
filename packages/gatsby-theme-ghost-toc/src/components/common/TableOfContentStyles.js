import { Link } from 'gatsby'
import styled from "styled-components"

/*
 * Due to global scoping with html.casper, global style have high specificity
 * https://styled-components.com/docs/faqs#how-can-i-override-styles-with-higher-specificity
*/
export const TocAside = styled.aside`
    && {
        order: 1;
        font-family: -apple-system, Liberation Sans, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
            Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif;
        line-height: 1.5em;
        font-size: 1.6rem;
        color: #78757A;
        background-color: rgba(255, 255, 255, 0.8);
        border-radius: 5px;

        @media (min-width: 1170px) {
            position: sticky;
            top: 120px;
            min-width: 260px;
            font-size: 1.4rem;
            padding: 0 2.4rem;
            margin-left: 0.2rem;
        }
    }
`
export const TocTitle = styled.h2`
    &&& {
        font-size: 1.4rem;
        letter-spacing: 0.075em;
        margin-top: 1.2rem;
        margin-bottom: 2rem;
        text-transform: uppercase;
        font-weight: 700;

        @media (min-width: 1170px) {
            font-size: 1.2rem;
        }
    }
`
export const TocList = styled.ul`
    &&& {
        overflow:hidden;
        position:relative;
        list-style: none;
        margin:0;
        padding:0;
        margin-top: -1.6rem;
        margin-bottom: 2.0rem;
        padding-top: 0.6rem;
        padding-left: 0.9rem;
    }
`
export const TocListSub = styled.ul`
    &&& {
        margin-top: 0.5rem;
        padding-left: 1.6rem;
        margin-bottom: 0.1rem;
    }
`
export const TocItem = styled.li`
    &&& {
        list-style: none;
        margin-bottom: calc(1.5rem / 2);
    }
`
export const TocLink = styled(Link)`
    &&& {
        height: 100%;
        box-shadow: none;
        color: ${props => (props.state.isActive ? `#54BC4B` : `inherit`)} !important;
        border-bottom: ${props => (props.state.isActive ? `1px solid #54BC4B` : `none`)};
        text-decoration: none;

        &:hover {
            color: #54BC4B  !important;
            border-bottom: 1px solid #54BC4B;
            text-decoration: none;
            box-shadow: none;
        }

        &::before {
            background-color: #EEE;
            content:' ';
            display: inline-block;
            height: inherit;
            left: 0;
            position:absolute;
            width: 2px;
            margin-left: 1px;
        }

        &::before {
            background-color: ${props => (props.state.isActive ? `#54BC4B` : `#EEE`)};
        }
    }
`
