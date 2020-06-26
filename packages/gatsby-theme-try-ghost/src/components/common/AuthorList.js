import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'

import { resolveUrl } from '../../utils/routing'
import useOptions from '../../utils/use-options'
import { useLang, get } from '../../utils/use-lang'

import { HoverOnAvatar } from './effects'
import { ImgSharp } from '.'

import AvatarIcon from './icons/avatar-icon'

const AuthorList = ({ authors, isPost }) => {
    const { basePath } = useOptions()
    const text = get(useLang())

    return (
        <ul className="author-list">
            {authors.map((author, i) => {
                const url = resolveUrl(basePath, `/`, author.slug, author.url)
                const profileImg = author.profileImageSharp && author.profileImageSharp.publicURL || author.profile_image
                const fluidProfileImg = author.profileImageSharp && author.profileImageSharp.childImageSharp && author.profileImageSharp.childImageSharp.fluid

                return (
                    <HoverOnAvatar key={i} activeClass="hovered" render={ hover => (
                        <li key={i} ref={hover.anchorRef} className="author-list-item">
                            { !isPost &&
                                <div className="author-name-tooltip">
                                    {author.name}
                                </div>
                            }
                            { isPost &&
                                <div className={`author-card ${hover.state.currentClass}`}>
                                    { profileImg ? (
                                        <ImgSharp fluidClass="author-profile-image" fluidImg={fluidProfileImg} srcImg={profileImg} title={author.name}/>
                                    ) : (
                                        <div className="author-profile-image"><AvatarIcon /></div>
                                    )}
                                    <div className="author-info">
                                        { author.bio ? (
                                            <div className="bio">
                                                <h2>{author.name}</h2>
                                                <p>{author.bio}</p>
                                                <p><Link to={url}>{text(`MORE_POSTS`)}</Link> {text(`BY`)} {author.name}.</p>
                                            </div>
                                        ) : (
                                            <React.Fragment>
                                                <h2>{author.name}</h2>
                                                <p>{text(`READ`)} <Link to={url}>{text(`MORE_POSTS_SM`)}</Link> {text(`BY_THIS_AUTHOR`)}.</p>
                                            </React.Fragment>
                                        )}
                                    </div>
                                </div>
                            }
                            { profileImg ? (
                                <Link to={url} className={`${isPost && `author` || `static`}-avatar`}>
                                    <ImgSharp fluidClass="author-profile-image" fluidImg={fluidProfileImg} srcImg={profileImg} title={author.name}/>
                                </Link>
                            ) : (
                                <Link to={url} className={`${isPost && `author` || `static`}-avatar author-profile-image`}><AvatarIcon /></Link>
                            )}
                        </li>
                    )}/>
                )
            })}
        </ul>
    )
}

AuthorList.propTypes = {
    authors: PropTypes.arrayOf(
        PropTypes.object,
    ).isRequired,
    isPost: PropTypes.bool,
}

export default AuthorList
