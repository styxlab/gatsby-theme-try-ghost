import React from 'react'
import PropTypes from 'prop-types'
import { useFormik } from 'formik'

import { Form, Input, Robot, Select, Textarea, Button, Span, Response } from './ContactFormStyles'
import { validate } from './ContactFormValidation'

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

const ContactForm = ({ topics, serviceConfig }) => {
    const encodeFormData = (data) => {
        if (serviceConfig.contentType === `application/json`) {
            return JSON.stringify(data)
        }
        if (serviceConfig.contentType === `application/x-www-form-urlencoded`) {
            return Object.keys(data)
                .map(key => encodeURIComponent(key) + `=` + encodeURIComponent(data[key]))
                .join(`&`)
        }
        return data
    }
    const formik = useFormik({
        initialValues: {
            name: ``,
            email: ``,
            subject: topics.length > 0 ? `topic` : ``,
            message: ``,
            'form-name': ``,
        },
        validate,
        onSubmit: async (values, actions) => {
            actions.setSubmitting(false)

            values.source_url = window.location.href
            values.subject = topics[values.subject]
            if (typeof values[`form-name`] === `string` && values[`form-name`].length === 0) {
                values[`form-name`] = `gatsby-theme-ghost-contact`
            } else { //early return if robot
                actions.resetForm()
                actions.setStatus({ success: `Thank you, your message has been sent!` })
                return
            }

            const postURL = (serviceConfig.url || `/`)
            fetch(postURL, {
                method: `POST`,
                headers: { 'Content-Type': serviceConfig.contentType },
                body: encodeFormData(values),
            }).then(() => {
                actions.resetForm()
                actions.setStatus({ success: `Thank you, your message has been sent!` })
                //remove message after 10 seconds
                window.setTimeout(() => actions.setStatus({ success: `` }), 10000)
            }).catch((error) => {
                actions.resetForm()
                actions.setStatus({ success: `Oops :-( sending failed. Error: ${error}.` })
                //remove message after 10 seconds
                window.setTimeout(() => actions.setStatus({ success: `` }), 10000)
            })
        },
    })

    return (
        <>
            <Span id="response">
                <div>{printError(formik.touched, formik.errors)}</div>
            </Span>
            <Form
                name="gatsby-theme-ghost-contact"
                method="post"
                action=""
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
                { topics.length > 0 &&
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
