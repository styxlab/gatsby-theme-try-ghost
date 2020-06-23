# gatsby-plugin-ghost-images
[![Released under MIT license.](https://badgen.net/github/license/micromatch/micromatch)](https://github.com/styxlab/gatsby-theme-try-ghost/blob/master/LICENSE)
[![gatsby-plugin-ghost-images npm package version.](https://badgen.net/npm/v/gatsby-plugin-ghost-images)](https://www.npmjs.org/package/gatsby-plugin-ghost-images)
[![PRs welcome!](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)]()

Downloads images from [Ghost CMS](https://ghost.org/changelog/jamstack/) so they can be processed with the [Gatsby image tool chain](https://www.gatsbyjs.org/docs/working-with-images/). This plugin is designed to seamlessly work with a headless Ghost CMS, but it should also work with other content management systems.

## Install

`yarn add gatsby-plugin-ghost-images`

Note that `gatsby-source-filesystem` is installed as a dependency of this plugin, because it provides needed functions. It is *not required* to include `gatsby-source-filesystem` in your `gatsby-config.js` as all images are fetched remotely from the CMS.


## Works best with...

While you can use `gatsby-plugin-ghost-images` on its own, you most likely want to use it with Gatsby image and sharp plugins:

`yarn add gatsby-plugin-sharp gatsby-transformer-sharp gatsby-image`


## How to use

```javascript
// In your gatsby-config.js
plugins: [
    // sharp plugins are only needed if you want to use gatsby image processing tools
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
        resolve: `gatsby-plugin-ghost-images`,
        options: {
            // An array of node types and image fields per node
            // Image fields must contain a valid absolute path to the image to be downloaded
            lookup: [
                {
                    type: `GhostPost`,
                    imgTags: [`feature_image`],
                },
                {
                    type: `GhostPage`,
                    imgTags: [`feature_image`],
                },
                {
                    type: `GhostSettings`,
                    imgTags: [`cover_image`],
                },
            ],
            // Additional condition to exclude nodes 
            // Takes precedence over lookup
            exclude: node => (
                node.ghostId === undefined
            ),
            // Additional information messages useful for debugging
            verbose: true,
            // Option to disable the module (default: false)
            disable: false,
        },
    },
]
```

## Image nodes

For each image, this plugin creates a new file node and puts the image data into the cache. For convenience all images are also attached to the original node. We adopt a naming convention, so the reference names are automatically generated. First the image tag name is extended with `_sharp`, next it is transformed into camel Case. For example:

```
feature_image -> feature_image_sharp -> featureImageSharp
```

With this naming convention there is no need to provide a target name.


## Details

This plugin will dramatically improve user experience and site performance! Gatsby provides amazing image processing tools that natively ships with lazy loading, adaptive image resolutions and much more. Get *all these image features* into your Ghost site with this plugin.


## How to query

```graphql
{
  allGhostPost {
    edges {
      node {
        featureImageSharp {
          id
        }
      }
    }
  }
}
```

## How to query images created by sharp

```graphql
{
  allGhostPost {
    edges {
      node {
        featureImageSharp {
          childImageSharp {
            fluid(maxWidth: 1024) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
}
```

## How to access in React code

```javascript
import Img from "gatsby-image"

...

const fluidImg = ghostPost.featureImageSharp.childImageSharp.fluid

<Img fluid={fluidImg} />

```

## Contributions

PRs are welcome! Consider contributing to this project if you are missing feature that is also useful for others. Explore [this guide](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/CONTRIBUTING.md), to get some more ideas.


# Copyright & License

Copyright (c) 2020 styxlab - Released under the [MIT license](LICENSE).
