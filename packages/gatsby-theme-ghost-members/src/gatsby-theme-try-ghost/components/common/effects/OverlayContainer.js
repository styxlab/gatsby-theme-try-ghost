import React from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'

class OverlayContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isOpen: false,
            value: ``,
            message: ``,
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleOpen = this.handleOpen.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.escFunction = this.escFunction.bind(this)
    }

    componentDidMount() {
        window.addEventListener(`keydown`, this.escFunction, false)
    }

    componentWillUnmount() {
        window.removeEventListener(`keydown`, this.escFunction, false)
    }

    escFunction = (event) => {
        if (event.key === `Escape`) {
            this.handleClose()
        }
    }

    handleChange(event) {
        this.setState({ value: event.target.value })
    }

    handleSubmit(event) {
        event.preventDefault()
        const settings = this.props.data.allGhostSettings.edges[0].node

        const cmsUrl = settings.url
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

    handleOpen(event){
        event.preventDefault()
        this.setState({ isOpen: true })
    }

    handleClose(){
        this.setState({ isOpen: false, message: ``, value: `` })
    }

    render() {
        return this.props.render(this)
    }
}

OverlayContainer.propTypes = {
    render: PropTypes.func.isRequired,
    data: PropTypes.shape({
        allGhostSettings: PropTypes.object.isRequired,
    }).isRequired,
}

const OverlayContainerQuery = props => (
    <StaticQuery
        query={graphql`
            query GhostSettingsForOverlayContainer {
                allGhostSettings {
                    edges {
                        node {
                            url
                        }
                    }
                }
            }
        `}
        render={data => <OverlayContainer data={data} {...props} />}
    />
)

export default OverlayContainerQuery
