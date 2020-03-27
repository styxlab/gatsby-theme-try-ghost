import React from 'react'
import PropTypes from 'prop-types'
import styled from "styled-components"
import BackgroundImage from 'gatsby-background-image'

const BackgroundSheet = styled.div`
    background-color: #000;
`

const HeaderBackground = ({ fluidImg, srcImg, children }) => {
    const fluidImgSharp = fluidImg && fluidImg.childImageSharp && fluidImg.childImageSharp.fluid

    return (
        <>
            {fluidImgSharp ? (
                <BackgroundSheet>
                    <BackgroundImage Tag="div" fluid={fluidImgSharp} preserveStackingContext={false} className="outer site-header-background responsive-header-img" backgroundColor={`#000`}>
                        {children}
                    </BackgroundImage>
                </BackgroundSheet>
            ) : (
                srcImg ? (
                    <div className="outer site-header-background responsive-header-img" style={{ backgroundImage: `url(${srcImg})` }}>
                        {children}
                    </div>
                ) : (
                    <div className="outer site-header-background no-image">
                        {children}
                    </div>
                )
            )}
        </>
    )
}

HeaderBackground.propTypes = {
    fluidImg: PropTypes.object,
    srcImg: PropTypes.string,
    children: PropTypes.node.isRequired,
}

export default HeaderBackground
