# gatsby-transformer-rehype

Parses HTML files and GrapghQL nodes using [rehype](https://github.com/rehypejs/rehype/).

## Install

`npm install --save gatsby-transformer-rehype`

## How to use

```javascript
// In your gatsby-config.js
plugins: [
  {
    resolve: `gatsby-transformer-rehype`,
    options: {
      // CommonMark mode (default: true)
      commonmark: true,
      // Footnotes mode (default: true)
      footnotes: true,
      // Pedantic mode (default: true)
      pedantic: true,
      // GitHub Flavored HTML mode (default: true)
      gfm: true,
      // Plugins configs
      plugins: [],
    },
  },
],
```

The following parts of `options` are passed down to rehype as options:

- `options.commonmark`
- `options.footnotes`
- `options.pedantic`
- `options.gfm`

The details of the rehype options above could be found in [`rehype-parse`'s documentation](https://github.com/rehypejs/rehype/tree/master/packages/rehype-parse#processoruseparse-options)

A full explanation of how to use HTML in Gatsby can be found here:
[Creating a Blog with Gatsby](https://www.gatsbyjs.org/blog/2017-07-19-creating-a-blog-with-gatsby/)

There are many Gatsby rehype plugins which you can install to customize how HTML is processed. Many of them are demoed at https://using-rehype.gatsbyjs.org/. See also the [source code for using-rehype](https://github.com/gatsbyjs/gatsby/tree/master/examples/using-rehype).

## Parsing algorithm

It recognizes files with the following extensions as HTML:

- md
- HTML

Each HTML file is parsed into a node of type `HTMLrehype`.

All frontmatter fields are converted into GraphQL fields. TODO link to docs on
auto-inferring types/fields.

This plugin adds additional fields to the `HTMLrehype` GraphQL type
including `html`, `excerpt`, `headings`, etc. Other Gatsby plugins can also add
additional fields.

## How to query

A sample GraphQL query to get HTMLrehype nodes:

```graphql
{
  allHTMLrehype {
    edges {
      node {
        html
        headings {
          depth
          value
        }
        frontmatter {
          # Assumes you're using title in your frontmatter.
          title
        }
      }
    }
  }
}
```

### Getting table of contents

Using the following GraphQL query you'll be able to get the table of contents

```graphql
{
  allHTMLrehype {
    edges {
      node {
        html
        tableOfContents
      }
    }
  }
}
```

### Configuring the tableOfContents

By default the tableOfContents is using the field `slug` to generate absolute URLs. You can however provide another field using the pathToSlugField parameter. **Note** that providing a non existing field will cause the result to be null. You can also pass `absolute: false` to generate relative path. To alter the default values for tableOfContents generation, include values for `heading` (string) and/or `maxDepth` (number 1 to 6) in graphQL query. If a value for `heading` is given, the first heading that matches will be omitted and the toc is generated from the next heading of the same depth onwards. Value for `maxDepth` sets the maximum depth of the toc (i.e. if a maxDepth of 3 is set, only h1 to h3 headings will appear in the toc).

```graphql
{
  allHTMLrehype {
    edges {
      node {
        html
        tableOfContents(
          absolute: true
          pathToSlugField: "frontmatter.path"
          heading: "only show toc from this heading onwards"
          maxDepth: 2
        )
        frontmatter {
          # Assumes you're using path in your frontmatter.
          path
        }
      }
    }
  }
}
```

To pass default options to the plugin generating the tableOfContents, configure it in gatsby-config.js as shown below. The options shown below are the defaults used by the plugin.

```javascript
// In your gatsby-config.js
plugins: [
  {
    resolve: `gatsby-transformer-rehype`,
    options: {
      tableOfContents: {
        heading: null,
        maxDepth: 6,
      },
    },
  },
]
```




You can also get excerpts in HTML format.

```graphql
{
  allHTMLrehype {
    edges {
      node {
        excerpt(format: HTML)
      }
    }
  }
}
```

## gray-matter options

`gatsby-transformer-rehype` uses [gray-matter](https://github.com/jonschlinkert/gray-matter) to parse HTML frontmatter, so you can specify any of the options mentioned [here](https://github.com/jonschlinkert/gray-matter#options) in the `gatsby-config.js` file.

### Example: Excerpts

If you don't want to use `pruneLength` for excerpts but a custom separator, you can specify an `excerpt_separator` in the `gatsby-config.js` file:

```javascript
{
  "resolve": `gatsby-transformer-rehype`,
  "options": {
    "excerpt_separator": `<!-- end -->`
  }
}
```

Any file that does not have the given `excerpt_separator` will fall back to the default pruning method.

## Troubleshooting

### Excerpts for non-latin languages

By default, `excerpt` uses `underscore.string/prune` which doesn't handle non-latin characters ([https://github.com/epeli/underscore.string/issues/418](https://github.com/epeli/underscore.string/issues/418)).

If that is the case, you can set `truncate` option on `excerpt` field, like:

```graphql
{
  HTMLrehype {
    excerpt(truncate: true)
  }
}
```

### Excerpts for HTML embedded in HTML files

If your HTML file contains HTML, `excerpt` will not return a value.

In that case, you can set an `excerpt_separator` in the `gatsby-config.js` file:

```javascript
{
  "resolve": `gatsby-transformer-rehype`,
  "options": {
    "excerpt_separator": `<!-- endexcerpt -->`
  }
}
```

Edit your HTML files to include that HTML tag after the text you'd like to appear in the excerpt:

```HTML
---
title: "my little pony"
date: "2017-09-18T23:19:51.246Z"
---

<p>Where oh where is that pony?</p>
<!-- endexcerpt -->
<p>Is he in the stable or down by the stream?</p>
```

Then specify `HTML` as the format in your graphql query:

```graphql
{
  HTMLrehype {
    excerpt(format: HTML)
  }
}
```
