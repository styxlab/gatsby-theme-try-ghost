import React from 'react'
import PropTypes from 'prop-types'

import { SiteNav, HeaderBackground } from '.'

import AvatarIcon from './icons/avatar-icon'

const HeaderAuthor = ({ author, numberOfPosts }) => {
    const twitterUrl = author.twitter ? `https://twitter.com/${author.twitter.replace(/^@/, ``)}` : null
    const facebookUrl = author.facebook ? `https://www.facebook.com/${author.facebook.replace(/^\//, ``)}` : null

    return (
        <header className="site-archive-header">
            <div className="outer site-nav-main">
                <div className="inner">
                    <SiteNav className="site-nav" />
                </div>
            </div>
            <HeaderBackground srcImg={author.cover_image}>
                <div className="inner">
                    <div className="site-header-content author-header">
                        {author.profile_image ? (
                            <img className="author-profile-image" src={author.profile_image} alt={author.name} />
                        ) : (
                            <div className="author-profile-image"><AvatarIcon /></div>
                        )}
                        <div className="author-header-content">
                            <h1 className="site-title">{author.name}</h1>
                            {author.bio && <h2 className="author-bio">{author.bio}</h2>}
                            <div className="author-meta">
                                {author.location && <div className="author-location">{author.location}</div>}
                                <div className="author-stats">
                                    {numberOfPosts && ` ${numberOfPosts} post${1 < numberOfPosts && `s`}` || `No posts`}
                                </div>
                                {author.website && <span className="author-social-link"><a href={author.website} target="_blank" rel="noopener noreferrer">Website</a></span>}
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
    author: PropTypes.shape({
        name: PropTypes.string.isRequired,
        cover_image: PropTypes.string,
        profile_image: PropTypes.string,
        website: PropTypes.string,
        bio: PropTypes.string,
        location: PropTypes.string,
        facebook: PropTypes.string,
        twitter: PropTypes.string,
    }).isRequired,
    numberOfPosts: PropTypes.number,
}

export default HeaderAuthor
