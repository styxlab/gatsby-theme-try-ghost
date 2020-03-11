# gatsby-plugin-ghost-images

Downloads images from [Ghost CMS](https://ghost.org/changelog/jamstack/) so they can be processed with the [Gatsby image tool chain](https://www.gatsbyjs.org/docs/working-with-images/). This plugin is designed to seamlessly work with the headless Ghost CMS, but it should also work with other content management systems.

## Install

`yarn add gatsby-plugin-ghost-images`

Note that `gatsby-source-filesystem` is installed as a dependency of this plugin. It is *not required* to include `gatsby-source-filesystem` in your `gatsby-config.js` as all images are fetched remotely from the CMS.


## Works best with...

While you can use `gatsby-plugin-ghost-images` on its own, you most likely want to use it in conjunction with the Gatsby image and sharp plugins:

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
        },
    },
]
```

## Image nodes

Where can you find the downloaded images? For each image, this plugin creates a new file node and puts the image data into the cache. For convenience all images are also attached to the original node. Here we have adapted a naming convention, so the reference names are automatically generated. First the image tag name is extended with `_sharp`, next it is transformed into camel Case. For example:

```
feature_image &rarr; feature_image_sharp &rarr; featureImageSharp

```

With this naming convention there is no need to provide a target name.


## Details

This plugin will dramatically improve user experience and site performance! Gatsby provides amazing image processing tools that natively ship with lazy loading, adaptive image resolutions and much more. Get *all these image features* into your Ghost site with this plugin.


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

# Copyright & License

Copyright (c) 2020 styxlab - Released under the [MIT license](LICENSE).
