import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'

import { HoverOnAvatar } from './effects'

import AvatarIcon from './icons/avatar-icon'

const AuthorList = ({ authors, isPost }) => (
    <ul className="author-list">
        {authors.map((author, i) => (
            <HoverOnAvatar key={i} activeClass="hovered" render={ hover => (
                <li key={i} ref={hover.anchorRef} className="author-list-item">
                    { !isPost &&
                        <div className="author-name-tooltip">
                            {author.name}
                        </div>
                    }
                    { isPost &&
                        <div className={`author-card ${hover.state.currentClass}`}>
                            { author.profile_image ? (
                                <img className="author-profile-image" src={author.profile_image} alt={author.name} />
                            ) : (
                                <div className="author-profile-image"><AvatarIcon /></div>
                            )}
                            <div className="author-info">
                                { author.bio ? (
                                    <div className="bio">
                                        <h2>{author.name}</h2>
                                        <p>{author.bio}</p>
                                        <p><Link to={`/author/${author.slug}/`}>More posts</Link> by {author.name}.</p>
                                    </div>
                                ) : (
                                    <>
                                        <h2>{author.name}</h2>
                                        <p>Read <Link to={`/author/${author.slug}/`}>more posts</Link> by this author.</p>
                                    </>
                                )}
                            </div>
                        </div>
                    }
                    { author.profile_image ? (
                        <Link to={`/author/${author.slug}/`} className={`${isPost && `author` || `static`}-avatar`}>
                            <img className="author-profile-image" src={author.profile_image} alt={author.name} />
                        </Link>
                    ) : (
                        <Link to={`/author/${author.slug}/`} className={`${isPost && `author` || `static`}-avatar author-profile-image`}><AvatarIcon /></Link>
                    )}
                </li>
            )}/>
        ))}
    </ul>
)

AuthorList.propTypes = {
    authors: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            slug: PropTypes.string.isRequired,
            profile_image: PropTypes.string,
            bio: PropTypes.string,
        })
    ).isRequired,
    isPost: PropTypes.bool,
}

export default AuthorList
