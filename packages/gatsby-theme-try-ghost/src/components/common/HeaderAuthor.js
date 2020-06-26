import React from 'react'
import PropTypes from 'prop-types'

import { SiteNav, HeaderBackground } from '.'
import { useLang, get } from '../../utils/use-lang'

import { ImgSharp } from '.'

import AvatarIcon from './icons/avatar-icon'

const HeaderAuthor = ({ author, numberOfPosts, overlay }) => {
    const text = get(useLang())
    const twitterUrl = author.twitter ? `https://twitter.com/${author.twitter.replace(/^@/, ``)}` : null
    const facebookUrl = author.facebook ? `https://www.facebook.com/${author.facebook.replace(/^\//, ``)}` : null

    const coverImg = author.coverImageSharp && author.coverImageSharp.publicURL || author.cover_image
    const profileImg = author.profileImageSharp && author.profileImageSharp.publicURL || author.profile_image
    const fluidProfileImg = author.profileImageSharp && author.profileImageSharp.childImageSharp && author.profileImageSharp.childImageSharp.fluid

    return (
        <header className="site-archive-header">
            <div className="outer site-nav-main">
                <div className="inner">
                    <SiteNav className="site-nav" overlay={overlay}/>
                </div>
            </div>
            <HeaderBackground fluidImg={author.coverImageSharp} srcImg={coverImg}>
                <div className="inner">
                    <div className="site-header-content author-header">
                        {profileImg ? (
                            <ImgSharp fluidClass="author-profile-image" fluidImg={fluidProfileImg} srcImg={profileImg} title={author.name}/>
                        ) : (
                            <div className="author-profile-image"><AvatarIcon /></div>
                        )}
                        <div className="author-header-content">
                            <h1 className="site-title">{author.name}</h1>
                            {author.bio && <h2 className="author-bio">{author.bio}</h2>}
                            <div className="author-meta">
                                {author.location && <div className="author-location">{author.location}</div>}
                                <div className="author-stats">
                                    {numberOfPosts && ` ${numberOfPosts} ${1 < numberOfPosts ? text(`POSTS`) : text(`POST`)}` || `${text(`NO_POSTS`)}`}
                                </div>
                                {author.website && <span className="author-social-link"><a href={author.website} target="_blank" rel="noopener noreferrer">{text(`WEBSITE`)}</a></span>}
                                {twitterUrl && <span className="author-social-link"><a href={twitterUrl} target="_blank" rel="noopener noreferrer">Twitter</a></span>}
                                {facebookUrl && <span className="author-social-link"><a href={facebookUrl} target="_blank" rel="noopener noreferrer">Facebook</a></span>}
                            </div>
                        </div>
                    </div>
                </div>
            </HeaderBackground>
        </header>
    )
}

HeaderAuthor.propTypes = {
    author: PropTypes.object.isRequired,
    numberOfPosts: PropTypes.number,
    overlay: PropTypes.object.isRequired,
}

export default HeaderAuthor
