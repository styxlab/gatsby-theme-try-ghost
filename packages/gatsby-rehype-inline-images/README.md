# gatsby-rehype-inline-images
[![Released under MIT license.](https://badgen.net/github/license/micromatch/micromatch)](https://github.com/styxlab/gatsby-theme-try-ghost/blob/master/LICENSE)
[![gatsby-rehype-inline-images npm package version.](https://badgen.net/npm/v/gatsby-rehype-inline-images)](https://www.npmjs.org/package/gatsby-rehype-inline-images)
[![PRs welcome!](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)]()

Downloads remote inline images and processes them with the [Gatsby image tool chain](https://www.gatsbyjs.org/docs/working-with-images/). This plugin is part of the *rehype* collection and intended to be used with [gatsby-transformer-rehype](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/packages/gatsby-transformer-rehype). 

## Install

`yarn add gatsby-plugin-sharp gatsby-transformer-rehype gatsby-rehype-inline-images`

## How to use

```javascript
// In your gatsby-config.js
plugins: [
  {
    resolve: `gatsby-plugin-sharp`,
  },
  {
    resolve: `gatsby-transformer-rehype`,
    options: {
        filter: node => (
            // this is an example (any node type can be selected)
            node.internal.type === `GhostPost`
        ),
        plugins: [
            {
                resolve: `gatsby-rehype-inline-images`,
                // all options are optional and can be omitted
                options: {
                    // all images larger are scaled down to maxWidth (default: maxWidth = imageWidth)
                    // maxWidth: 2000,
                    withWebp: true,
                    // disable, if you need to save memory
                    useImageCache: true,
                }
            },
        ],
    },
  },
]
```

## Details

This plugin walks the `htmlAst` syntax tree and extracts all `img` tags. For each image found, the remote image data is fetched and put into a new file node. If the image format is supported by `gatsby-plugin-sharp`, the image is transformed into a fluid image. The fluid image is attached to the `htmlAst` coming from `gatsby-transformer-rehype` and the `img` tag is replaced by `img-sharp-inline`. That way, transformed images can be easily detected later and picked up by React components.

Unsupported image formats are directly copied to the `/static` folder and the image `src` attribute is updated to the new local image location. Both the file node and the processed images are cached in order to speed up build times on subsequent runs.

## How to query

As this plugin mutates the `htmlAst` all changes are included in this syntax tree and in the transformed `html`:

```graphql
{
  allGhostPost {
    edges {
      node {
        childHtmlRehype {
          htmlAst
          html
        }
      }
    }
  }
}
```

## Image tag `img-sharp-inline` properties

An image that is transformed gets additional properties:

```html
<img-sharp-inline htmlTag="" htmlClearProps="" parentClassName="" className="" fluidImg="" alt="" maxWidth="" />
```

where

- htmlTag: original tag name before transformation (always `img`)
- htmlClearProps: array of property names that should not be included in html output
- parentClassName: class attribute from parent plus `fluid-image`
- className: class attribute from replaced `img`
- fluidImg: fluid image object as string (use JSON.parse(fluidImg) to transform back to object)
- alt: alternative image title
- maxWidth: maximum image width (number in pixels)

These properties give you the needed flexibility in your React components.

## Properties injected into parent

CSS flexbox layouts need a little help in order to be able to display images with correct aspect ratios. For that reason, the following *style property* is added to the parent of the `img` tag:

```html
style="flex: ${image.aspectRatio} 1 0"
```

where the `image.aspectRatio`is computed directly from the image. If you do not use CSS flexbox styles, the added style instruction won't have any effect.

In addition, the attribute `fluid-image` is added to the parent's `class` property, which you can use in your style sheets.


## Use in React components

Instead of using the `html` it is highly recommended start from the `htmlAst` and compile it directly into a React component:

```jsx
import React from 'react'
import rehypeReact from 'rehype-react'
import { ImgSharpInline } from '.'

const renderAst = new rehypeReact({
    Fragment: React.Fragment,
    createElement: React.createElement,
    components: { "img-sharp-inline": ImgSharpInline },
}).Compiler

const RenderContent = ({ htmlAst }) => (
    <div>
        { renderAst(htmlAst) }
    </div>
)

export default RenderContent
```

A minimal `ImgSharpInline` component may look like:

```jsx
import React from 'react'
import Img from 'gatsby-image'

const ImgSharpInline = ({ parentClassName, className, fluidImg, alt }) => (
    <Img
        className={className}
        fluid={fluidImg && JSON.parse(fluidImg)}
        alt={alt}
    />
)

export default ImgSharpInline

```

This will make your inline images fully responsive and plays nicely with all `gatsby-image` features such as the blur-up effect.

## Caveats

If your site contains many inline images, your build times may be considerably increased by using this plugin. Every image needs to be downloaded and processed which are network and computationally heavy tasks. This plugin utilizes the cache, so *subsequent builds* will be fast. Property injection into the parent has been hard-coded -- this could be made configurable. If that limits your use case, let me know.

## Troubleshooting

Please always clear the cache with `yarn clean` before reporting a bug to this project.

# Copyright & License

Copyright (c) 2020 styxlab - Released under the [MIT license](LICENSE).
