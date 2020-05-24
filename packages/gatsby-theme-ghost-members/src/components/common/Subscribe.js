import React from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'

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

        const cmsUrl = this.props.url.replace(/\/$/, ``)
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
        return (
            <form className={this.state.message} data-members-form="subscribe" onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <input type="email" value={this.state.value} onChange={this.handleChange} className="subscribe-email" data-members-email placeholder="youremail@example.com" autoComplete="false" />
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

// The actual component
const Subscribe = ({ data, url }) => {
    const site = data.allGhostSettings.edges[0].node

    return (
        <React.Fragment>
            <h3 className="subscribe-form-title">Subscribe to {site.title}</h3>
            <p className="subscribe-form-description">Get the latest posts delivered right to your inbox</p>
            <SubscribeForm url={url} />
        </React.Fragment>
    )
}

Subscribe.propTypes = {
    data: PropTypes.shape({
        allGhostSettings: PropTypes.object.isRequired,
    }).isRequired,
    url: PropTypes.string.isRequired,
}

const SubscribeQuery = props => (
    <StaticQuery
        query={graphql`
            query GhostSettingsForSubscribe {
                allGhostSettings {
                    edges {
                        node {
                            ...GhostSettingsFields
                        }
                    }
                }
            }
        `}
        render={data => <Subscribe data={data} {...props} />}
    />
)

export default SubscribeQuery
