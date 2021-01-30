/* eslint-env jest */
import plugin from "../gatsby-node"

describe(`gatsby-rehype-ghost-links`, () => {
    let htmlAst
    let getNode
    let getNodesByType

    beforeEach(() => {
        htmlAst = {
            type: `root`,
            children: [
                {
                    type: `element`,
                    tagName: `p`,
                    properties: {},
                    children: [
                        {
                            type: `text`,
                            value: `This is a `,
                        },
                        {
                            type: `element`,
                            tagName: `a`,
                            properties: {
                                href: `https://gatsbyjs.com/plugins/gatsby-rehype-ghost-links/`,
                            },
                            children: [
                                {
                                    type: `text`,
                                    value: `local link`,
                                },
                            ],
                        },
                    ],
                },
                {
                    type: `element`,
                    tagName: `p`,
                    properties: {},
                    children: [
                        {
                            type: `text`,
                            value: `This is an `,
                        },
                        {
                            type: `element`,
                            tagName: `a`,
                            properties: {
                                href: `https://www.npmjs.com/package/gatsby-rehype-ghost-links`,
                            },
                            children: [
                                {
                                    type: `text`,
                                    value: `external link`,
                                },
                            ],
                        },
                    ],
                },
            ],
            data: {
                quirksMode: false,
            },
        }

        getNode = jest.fn().mockReturnValue({})
        getNodesByType = jest
            .fn()
            .mockReturnValue([{ url: `https://gatsbyjs.com` }])
    })

    it(`should replace absolute urls with zero config`, () => {
        plugin({ htmlAst, getNode, getNodesByType })

        // local link (changed)
        expect(htmlAst.children[0].children[1].properties.href).toBe(
            `/plugins/gatsby-rehype-ghost-links/`
        )

        // external link (unchanged)
        expect(htmlAst.children[1].children[1].properties.href).toBe(
            `https://www.npmjs.com/package/gatsby-rehype-ghost-links`
        )
    })

    it(`should replace absolute urls with url relative to base path if set`, () => {
        getNode.mockReturnValue({ basePath: `/blog/` })
        plugin({ htmlAst, getNode, getNodesByType })

        // local link (changed)
        expect(htmlAst.children[0].children[1].properties.href).toBe(
            `/blog/plugins/gatsby-rehype-ghost-links/`
        )

        // external link (unchanged)
        expect(htmlAst.children[1].children[1].properties.href).toBe(
            `https://www.npmjs.com/package/gatsby-rehype-ghost-links`
        )
    })

    it(`should work if GhostSettings url contains trailing slash`, () => {
        getNodesByType.mockReturnValue([{ url: `https://gatsbyjs.com` }])
        plugin({ htmlAst, getNode, getNodesByType })

        // local link (changed)
        expect(htmlAst.children[0].children[1].properties.href).toBe(
            `/plugins/gatsby-rehype-ghost-links/`
        )

        // external link (unchanged)
        expect(htmlAst.children[1].children[1].properties.href).toBe(
            `https://www.npmjs.com/package/gatsby-rehype-ghost-links`
        )
    })

    it(`should ignore urls with different protocols`, () => {
        const ftpUrl = `ftp://gatsbyjs.com/plugins/gatsby-rehype-ghost-links/`
        htmlAst.children[0].children[1].properties.href = ftpUrl
        plugin({ htmlAst, getNode, getNodesByType })

        // local link (unchanged)
        expect(htmlAst.children[0].children[1].properties.href).toBe(ftpUrl)

        // external link (unchanged)
        expect(htmlAst.children[1].children[1].properties.href).toBe(
            `https://www.npmjs.com/package/gatsby-rehype-ghost-links`
        )
    })
})
