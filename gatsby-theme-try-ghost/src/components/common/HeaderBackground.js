import React from 'react'
import PropTypes from 'prop-types'
import styled from "styled-components"
import BackgroundImage from 'gatsby-background-image'

import { StaticQuery, graphql } from 'gatsby'

const BackgroundSheet = styled.div`
    background-color: #000;
`

const HeaderBackground = ({ localImage, backgroundImage, children }) => {
    const localBackgroundImage = localImage.desktop.childImageSharp.fluid
    let isRemote = backgroundImage && true || false
    const isLocal = localBackgroundImage && isRemote || false
    isRemote = backgroundImage && !isLocal || false
    const isNoImage = !(isLocal || isRemote)

    return (
        <>
            {isLocal &&
                <BackgroundSheet>
                    <BackgroundImage Tag="div" preserveStackingContext={false} className="outer site-header-background responsive-header-img" fluid={localBackgroundImage} backgroundColor={`#000`}>
                        {children}
                    </BackgroundImage>
                </BackgroundSheet>
            }
            {isRemote &&
                <div className="outer site-header-background responsive-header-img" style={{ backgroundImage: `url(${backgroundImage})` }}>
                    {children}
                </div>
            }
            {isNoImage &&
                <div className="outer site-header-background no-image">
                    {children}
                </div>
            }
        </>
    )
}

HeaderBackground.propTypes = {
    localImage: PropTypes.object,
    backgroundImage: PropTypes.string,
    children: PropTypes.node.isRequired,
}

const HeaderBackgroundQuery = props => (
    <StaticQuery
        query={graphql`
            query {
                desktop: file(relativePath: { eq: "publication-cover.png" }) {
                    childImageSharp {
                        fluid(quality: 90, maxWidth: 1920) {
                            ...GatsbyImageSharpFluid_withWebp
                        }
                    }
                }
            }
        `}
        render={data => <HeaderBackground localImage={data} {...props} />}
    />
)

export default HeaderBackgroundQuery
