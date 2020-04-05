import styled from 'styled-components'
import { css } from 'styled-components'

const themeStyle = css`
    font-family: avenir next,avenir,helvetica neue,helvetica,ubuntu,roboto,noto,segoe ui,arial,sans-serif;
    display: block;
    margin: 0 0 2rem 0;
    padding: 1rem 0;
    width: 100% !important;
    align-items: flex-start;
    box-sizing: border-box;
`
const elementStyle = css`
    color: darkslategray;
    background-color: white;
    background-clip: padding-box;
    line-height: 1.5;
    border-radius: .5rem;
    padding: 1rem 4rem;
    border: 1px solid #ced4da;
    transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
`
const focusStyle = css`
    border-color: #3eb0ef;
    box-shadow: none;
    -webkit-box-shadow: none;
`
export const Form = styled.form`
    ${themeStyle}
`
export const Input = styled.input`
    ${themeStyle}
    ${elementStyle}
    &:focus {
        ${focusStyle}
    }
    &:placeholder {
        color: silver;
    }
}
`
export const Robot = styled(Input)`
    display:none !important;
`
export const Select = styled.select`
    ${themeStyle}
    ${elementStyle}
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    &:required:invalid {
        color: silver;
    }
    &:focus {
        ${focusStyle}
    }
`
export const Textarea = styled.textarea`
    ${themeStyle}
    ${elementStyle}
    &:focus {
        ${focusStyle}
    }
`
export const Button = styled.button`
    ${themeStyle}
    margin-bottom: 1rem;
    color: white;
    background-color: #3eb0ef;
    border-color: #3eb0ef;
    user-select: none;
    line-height: 1.5;
    border-radius: .5rem;
    border: 1px solid transparent;
    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    &:hover {
        filter: brightness(80%);
    }
`
export const Span = styled.span`
    ${themeStyle}
    margin-bottom: 0;
    padding-bottom: 0;
    color: #ed3c3c;
    font-size: smaller;
    font-style: oblique;
    height: 4rem;
`
export const Response = styled.span`
    ${themeStyle}
    margin-bottom: 0;
    padding-bottom: 0;
    color: silver;
    font-size: smaller;
    font-style: oblique;
    height: 4rem;
`
