import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import styled from "styled-components"
import { css } from "styled-components"
import { Layout, HeaderPage, PostCard, ImgSharp } from 'gatsby-theme-try-ghost/src/components/common'

import { PostClass } from 'gatsby-theme-try-ghost/src/components/common/helpers'
import { MetaData } from 'gatsby-theme-try-ghost/src/components/common/meta'

const themeStyle = css`
    font-family: avenir next,avenir,helvetica neue,helvetica,ubuntu,roboto,noto,segoe ui,arial,sans-serif;
    display: block;
    margin: 0 0 2rem 0;
    padding: 1rem 0;
    width: 100% !important;
    align-items: flex-start;
    box-sizing: border-box;
`
const elementStyle = css`
    color: darkslategray;
    background-color: white;
    background-clip: padding-box;
    line-height: 1.5;
    border-radius: .5rem;
    padding: 1rem 4rem;
    border: 1px solid #ced4da;
    transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
`
const focusStyle = css`
    border-color: #3eb0ef;
    box-shadow: none;
    -webkit-box-shadow: none;
`

const Form = styled.form`
    ${themeStyle}
`
const Input = styled.input`
    ${themeStyle}
    ${elementStyle}
    &:focus {
        ${focusStyle}
    }
    &:placeholder {
        color: silver;
    }
}
`
const Robot = styled(Input)`
    display:none !important;
`
const Select = styled.select`
    ${themeStyle}
    ${elementStyle}
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    &:required:invalid {
        color: silver;
    }
    &:focus {
        ${focusStyle}
    }
`
const Textarea = styled.textarea`
    ${themeStyle}
    ${elementStyle}
    &:focus {
        ${focusStyle}
    }
`
const Button = styled.button`
    ${themeStyle}
    margin-bottom: 0;
    color: white;
    background-color: #3eb0ef;
    border-color: #3eb0ef;
    user-select: none;
    line-height: 1.5;
    border-radius: .5rem;
    border: 1px solid transparent;
    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    &:hover {
        filter: brightness(80%);
    }
`

const ContactPage = ({ data, location }) => {
    const page = data.contactPage
    const posts = data.allGhostPost.edges
    const featImg = page.feature_image
    const fluidFeatureImg = page.featureImageSharp && page.featureImageSharp.childImageSharp && page.featureImageSharp.childImageSharp.fluid
    const postClass = PostClass({ tags: page.tags, isPage: page && true, isImage: featImg && true })
    const transformedHtml = page.children && page.children[0] && page.children[0].html

    return (
        <>
            <MetaData data={data} location={location} type="website"/>
            <Layout page={page} tags={page.tags} header={<HeaderPage />}>
                <div className="inner">
                    <article className={`post-full ${postClass}`}>

                        <header className="post-full-header">
                            <h1 className="post-full-title">{page.title}</h1>

                            { page.custom_excerpt &&
                                <p className="post-full-custom-excerpt">{page.custom_excerpt}</p>
                            }
                        </header>

                        { featImg &&
                            <figure className="post-full-image">
                                <ImgSharp fluidClass="kg-card kg-code-card" fluidImg={fluidFeatureImg} srcImg={featImg} title={page.title} />
                            </figure>
                        }

                        <section className="post-full-content">
                            <Form id="contact-form" method="post" data-format="inline" data-netlify="true" data-netlify-honeypot="bot-field">
                                <Input type="text" id="name" placeholder="Full Name" pattern=".{2,30}" required />
                                <Input type="email" id="email" placeholder="Email Address" required />
                                { page.form_topics.length >= 0 &&
                                    <Select defaultValue="topic" id="subject" pattern=".{1,20}" required>
                                        <option value="topic" disabled hidden>Please select...</option>
                                        {page.form_topics.map((topic, i) => (
                                            <option num={i} value={`option-${i}`} key={`option-${i}`} >{topic}</option>
                                        ))}
                                    </Select>
                                }
                                <Textarea rows="5" id="message" placeholder="Your message" pattern=".{10,4000}" required></Textarea>
                                <Robot type="hidden" name="form-name" value="contact-form" />
                                <Button className="btn" type="submit" id="submit" value="Submit" onClick="formProcessor.process();return false;">Submit</Button>
                                <span id="responsemsg"></span>
                            </Form>

                            <div className="post-content"
                                dangerouslySetInnerHTML={{ __html: transformedHtml || page.html }} />
                        </section>
                    </article>

                    <div className="post-feed">
                        {posts.map(({ node }, i) => (
                            <PostCard key={node.id} post={node} num={i} />
                        ))}
                    </div>

                </div>
            </Layout>
        </>
    )
}

ContactPage.propTypes = {
    data: PropTypes.shape({
        contactPage: PropTypes.object.isRequired,
        allGhostPost: PropTypes.object.isRequired,
    }).isRequired,
    location: PropTypes.object.isRequired,
}

export default ContactPage

export const pageQuery = graphql`
  query GhostContactQuery($slug: String!) {
    contactPage(slug: { eq: $slug }) {
        ...ContactPageFields
    }
    allGhostPost(
        sort: { order: DESC, fields: [published_at] },
        limit: 3,
        skip: 0
    ) {
      edges {
        node {
          ...GhostPostFields
        }
      }
    }
  }
`
