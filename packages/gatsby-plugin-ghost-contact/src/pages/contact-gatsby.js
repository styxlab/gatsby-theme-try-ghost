import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import styled from "styled-components"
import { css } from "styled-components"
import { Layout, HeaderPage, PostCard } from '../components/common'
import { PostClass } from '../components/common/helpers'

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

const ContactPage = ({ data }) => {
    const posts = data.allGhostPost.edges
    const page = {}
    const featImg = false
    page.title = `Contact Us`
    page.slug = `contact`
    const postClass = PostClass({ tags: page.tags, isPage: page && true, isImage: featImg && true })

    return (
        <Layout page={page} tags={page.tags} header={<HeaderPage />}>
            <div className="inner">
                <article className={`post-full ${postClass}`}>
                    <header className="post-full-header">
                        <h1 className="post-full-title">{page.title}</h1>
                    </header>
                    <section className="post-full-content">
                        <div className="post-content">
                            <p>Want to get in touch with the team? Just drop us a line!</p>
                        </div>
                        <Form id="contact-form" method="post" data-format="inline">
                            <Input type="text" id="name" placeholder="Full Name" pattern=".{2,30}" required />
                            <Input type="email" id="email" placeholder="Email Address" required />
                            <Select id="subject" pattern=".{1,20}" required>
                                <option value="" disabled selected>Please select...</option>
                                <option value="comment">I want to give feedback</option>
                                <option value="question">I want to ask a question</option>
                            </Select>
                            <Textarea rows="5" id="message" placeholder="Your message" pattern=".{10,4000}" required></Textarea>
                            <Robot type="text" name="_norobots" />
                            <Button className="btn" type="submit" id="submit" value="Submit" onClick="formProcessor.process();return false;">Submit</Button>
                            <span id="responsemsg"></span>
                        </Form>
                    </section>
                </article>

                <div className="post-feed">
                    {posts.map(({ node } , i) => (
                        <PostCard key={node.id} post={node} num={i} />
                    ))}
                </div>

            </div>
        </Layout>
    )
}

ContactPage.propTypes = {
    data: PropTypes.shape({
        allGhostPost: PropTypes.object.isRequired,
    }).isRequired,
}

export default ContactPage

export const pageQuery = graphql`
  query GhostContactQuery {
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
