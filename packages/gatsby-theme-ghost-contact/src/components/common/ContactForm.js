import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { css } from 'styled-components'
import { useFormik } from 'formik'

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

const Form = styled.form`
    ${themeStyle}
`
const Input = styled.input`
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
const Robot = styled(Input)`
    display:none !important;
`
const Select = styled.select`
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
const Textarea = styled.textarea`
    ${themeStyle}
    ${elementStyle}
    &:focus {
        ${focusStyle}
    }
`
const Button = styled.button`
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

const Span = styled.span`
    ${themeStyle}
    margin-bottom: 0;
    padding-bottom: 0;
    color: #ed3c3c;
    font-size: smaller;
    font-style: oblique;
    height: 4rem;
`
const Response = styled.span`
    ${themeStyle}
    margin-bottom: 0;
    padding-bottom: 0;
    color: silver;
    font-size: smaller;
    font-style: oblique;
    height: 4rem;
`
const printError = (touched, errors) => {
    if (touched.name && errors.name) {
        return errors.name
    }
    if (touched.email && errors.email) {
        return errors.email
    }
    if (touched.subject && errors.subject) {
        return errors.subject
    }
    if (touched.message && errors.message) {
        return errors.message
    }
    return null
}

// A custom validation function. This must return an object
// which keys are symmetrical to our values/initialValues
const validate = (values) => {
    const errors = {}
    if (!values.name) {
        errors.name = `Full Name is required.`
    } else if (values.name.length < 3) {
        errors.name = `Full Name must be at least 3 characters long.`
    } else if (values.name.length > 20) {
        errors.name = `Full Name Must be 20 characters or less.`
    }

    if (!values.email) {
        errors.email = `Email is required.`
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = `Invalid email address.`
    }

    if (!values.subject) {
        errors.subject = `Please select one subject.`
    }

    if (!values.message) {
        errors.message = `A message text is required.`
    } else if (values.message.length < 10) {
        errors.message = `Your message must be at least 10 characters long.`
    } else if (values.message.length > 4000) {
        errors.message = `Your message must be 4000 characters or less.`
    }

    return errors
}

const ContactForm = ({ topics, serviceConfig }) => {
    const formik = useFormik({
        initialValues: {
            name: ``,
            email: ``,
            subject: `topic`,
            message: ``,
            'form-name': ``,
        },
        validate,
        onSubmit: async (values, actions) => {
            actions.setSubmitting(false)
            const postURL = (serviceConfig.url || `http://localhost:7000/v1/contact`)
            const xhr = new XMLHttpRequest()
            xhr.open(`POST`, postURL, true)
            xhr.setRequestHeader(`Content-Type`, `application/json`)
            values.source_url = window.location.href
            values.subject = topics[values.subject]
            if (typeof values[`form-name`] === `string` && values[`form-name`].length === 0) {
                values[`form-name`] = `gatsby-theme-ghost-contact`
            }
            console.log(values)
            xhr.send(JSON.stringify(values))
            xhr.onload = () => {
                //remove message after 10 seconds
                window.setTimeout(() => {
                    actions.setStatus({ success: `` })
                }, 10000)
            }
            xhr.onreadystatechange = () => {
                actions.resetForm()
                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                    //console.log(xhr.responseText)
                    actions.setStatus({ success: `Thank you, your message has been sent!` })
                } else {
                    actions.setStatus({ success: `Oops :-( sending failed.` })
                }
            }
        },
    })

    return (
        <>
            <Span id="response">
                <div>{printError(formik.touched, formik.errors)}</div>
            </Span>
            <Form
                id="contact-form"
                name="gatsby-theme-ghost-contact"
                onSubmit={formik.handleSubmit}
                data-netlify="true"
                data-netlify-honeypot="bot-field">
                <Input
                    id="name"
                    name="name"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                    placeholder="Full Name"
                />
                <Input
                    id="email"
                    name="email"
                    type="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    placeholder="Email Address"
                />
                { topics.length >= 0 &&
                    <Select
                        id="subject"
                        name="subject"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.subject}>
                        <option value="topic" hidden>Please select...</option>
                        { topics.map((topic, i) => (
                            <option num={i} value={i} key={`option-${i}`} >{topic}</option>
                        ))}
                    </Select>
                }
                <Textarea
                    id="message"
                    name="message"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.message}
                    placeholder="Your message"
                    rows="5"
                />
                <Robot
                    type="hidden"
                    name="form-name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values[`form-name`]}
                />
                <Button id="submit" type="submit" value="Submit">Submit</Button>
                <Response id="responsemsg">{formik.status && formik.status.success}</Response>
            </Form>
        </>
    )
}

ContactForm.propTypes = {
    topics: PropTypes.arrayOf(
        PropTypes.string
    ).isRequired,
    serviceConfig: PropTypes.object.isRequired,
}

export default ContactForm
