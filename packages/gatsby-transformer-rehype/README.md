# gatsby-transformer-rehype

This is an HTML to HTML transformer. It parses HTML files and GraphQL HTML nodes using [rehype](https://github.com/rehypejs/rehype/). This package is heavily inspired by [gatsby-transformer-remark](https://www.gatsbyjs.org/packages/gatsby-transformer-remark/), the difference being that the content source is [HTML](https://www.w3schools.com/html/) instead of Remark.

The general idea of this package is to convert an input HTML blob into an [HAST syntax tree](https://github.com/syntax-tree/hast), that is put into the `HtmlAst` object. `HtmlAst` is passed down to all plugins provided in the options. Plugins are allowed to mutate `HtmlAst` and thereby provide requested transformations on the original `HTML`. Finally `gatsby-transformer-rehype` parses the `HtmlAst` back to regular HTML.

## Install

`yarn add gatsby-transformer-rehype`

## How to use

```javascript
// In your gatsby-config.js
plugins: [
  {
    resolve: `gatsby-transformer-rehype`,
    options: {
      // Condition for selecting an existing GrapghQL node (optional)
      // If not set, the transformer operates on file nodes.
      filter: node => node.internal.type === `GhostPost`,
      // Only needed when using filter (optional, default: node.html)
      // Source location of the html to be transformed
      source: node => node.html,
      // Additional fields of the sourced node can be added here (optional)
      // These fields are then available on the htmlNode on `htmlNode.context`
      contextFields: [],
      // Fragment mode (optional, default: true)
      fragment: true,
      // Space mode (optional, default: `html`)
      space: `html`,
      // EmitParseErrors mode (optional, default: false)
      emitParseErrors: false,
      // Verbose mode (optional, default: false)
      verbose: false,
      // Plugins configs (optional but most likely you need one)
      plugins: [],
    },
  },
],
```

The filter option allows you to transform HTML nodes that come from other GraphQL nodes. In conjunction
with the source option, you can also define a different location of your source `html`. If your HTML is sourced in from files, `mediaType` must be set to `text/html`.

The following parts of `options` are passed down to rehype as options:

- `options.fragment`
- `options.space`
- `options.emitParseErrors`
- `options.verbose`

The details of the rehype options above can be found in the [rehype-parse documentation](https://github.com/rehypejs/rehype/tree/master/packages/rehype-parse#options).

This transformer is most useful when combined with Gatsby **rehype plugins** which you can install to customize how HTML is transformed. The following `gatsby-rehype-*` plugins are soon available

- [gatsby-rehype-prismjs](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/packages/gatsby-rehype-prismjs)
- [gatsby-rehype-ghost-links](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/packages/gatsby-rehype-ghost-links)

If you are missing a plugin, consider collaborating with me to contribute your own. Writing plugins for `gatsby-transformer-rehype` is easy!

## Parsing algorithm

Each HTML file or HTML GraphQL node is parsed into a node of type `HtmlRehype`.

This plugin adds additional fields to the `HtmlRehype` GraphQL node including `html`, `htmlAst` and `internal.content`. The latter contains the source HTML. The transformed HTML can be found in `html`. All transformations should be made on `htmlAst` which is passed to all sub-plugins. Other Gatsby plugins can also add additional fields.

## How to query

A sample GraphQL query to get HtmlRehype nodes:

```graphql
{
  allHtmlRehype {
    edges {
      node {
        html
      }
    }
  }
}
```

### Access from parents

Your source HTML comes either from a file or from some other HTML GraphQL node. Assuming that you sourced your HTML from the `GhostPost` node, you can reach your transformed HTML also on the children node:

```graphql
{
  allGhostPost {
    edges {
      node {
        children {
          ... on HtmlRehype {
            html
          }
        }
      }
    }
  }
}
```

This allows for minimal changes in your original GraphQL queries.

## Troubleshooting

`gatsby-transformer-rehype` hooks into the Gatsby `onCreateNode` method. This method is only called if a new node is created. If nodes were previously generated, they might have been cached and `onCreateNode` is not called again. During development, or when adding new plugins to the options, you have to call

`yarn clean`

in order to trigger the transformer again. Please always do a `yarn clean` before reporting a bug to this project.


# Copyright & License

Copyright (c) 2020 styxlab - Released under the [MIT license](LICENSE).
