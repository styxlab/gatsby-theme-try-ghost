import React from 'react'
import PropTypes from 'prop-types'

import LoaderIcon from './icons/loader-icon'

class SubscribeForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: ``,
            message: ``,
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(event) {
        this.setState({ value: event.target.value })
    }

    handleSubmit(event) {
        event.preventDefault()

        const cmsUrl = this.props.url
        const postURL = `${cmsUrl}/members/api/send-magic-link/`

        const values = {
            email: this.state.value,
            emailType: `subscribe`,
            labels: [],
        }

        fetch(postURL, {
            method: `POST`,
            mode: `cors`,
            headers: { 'Content-Type': `application/json` },
            body: JSON.stringify(values),
        }).then(() => {
            this.setState({ message: `success` })
        }).catch(() => {
            this.setState({ message: `error` })
        })
    }

    render() {
        const labelHidden = { position: `absolute`, height: `1px`, width: `1px`,
            clip: `rect(1px,1px,1px,1px)`, border: 0, overflow: `hidden` }

        return (
            <form className={this.state.message} data-members-form="subscribe" onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label for="email" style="label-hidden">Email</label>
                    <input id="email" name="email" type="email" value={this.state.value} onChange={this.handleChange} className="subscribe-email" data-members-email placeholder="youremail@example.com" autoComplete="false" />
                    <button className="button primary" type="submit" value="Submit">
                        <span className="button-content">Subscribe</span>
                        <span className="button-loader"><LoaderIcon /></span>
                    </button>
                </div>
                <div className="message-success">
                    <strong>Great!</strong> Check your inbox and click the link to confirm your subscription.
                </div>
                <div className="message-error">
                    Please enter a valid email address!
                </div>
            </form>
        )
    }
}

SubscribeForm.propTypes = {
    url: PropTypes.string.isRequired,
}

export default SubscribeForm
