# Jamify Source Ghost

Gatsby source plugin for pulling data from headless [Ghost CMS](https://ghost.org/changelog/jamstack/). This plugin uses the [Gatsby schema customization](https://www.gatsbyjs.org/docs/schema-customization/) API to provide a strictly typed content schema. Data is fetched
via the [Ghost Content API Client](https://ghost.org/docs/api/v3/javascript/content/).

## Features

- [First class](https://www.gatsbyjs.com/docs/integration-guide/source-plugin/) Gatsby source plugin ✨
- Strictly typed schema
- Only fetch new or updated content from Ghost CMS
- Create or update GraphQL nodes only if content changes
- Ready for incremental builds

## Install

`yarn add jamify-source-ghost`

## How to use

Plugin configuration for `gatsby-config.js`:

```
{
   resolve: `jamify-source-ghost`,
   options: {
      ghostConfig: {
        apiUrl: `https://<cms.your-ghost.com>`,
        contentApiKey: `<your content api key>`,
        version: `v3` // Ghost API version (optional)
      },
      // Use cache (optional, default: true)
      cacheResponse: true, 
      // Show info messages (optional, default: true)
      verbose: false,
   }
}
```

`apiUrl`: Ghost Content API URL.

`contentApiKey`: The Content API Key that can be generated in Ghost Admin under *Integrations*. Use of [environment variables](https://www.gatsbyjs.org/docs/environment-variables/) is recommended.

`cacheResponse`: This plugin uses the cache to hold state information for subsequent runs. For best performance, this setting should be turned on. Only switch off for debugging purposes.

`verbose`: Print informative messages during build processing.

## How to query

This plugin generates five different node types: Post, Page, Author, Tag, and Settings. A full list of fields can be inspected in the [schema customizaion file](https://github.com/styxlab/gatsby-theme-try-ghost/blob/master/packages/jamify-source-ghost/create-schema-customization.js).

**Example Post Query**

```
{
  allGhostPost(sort: { order: DESC, fields: [published_at] }) {
    edges {
      node {
        id
        slug
        title
        html
        published_at
        ...
        tags {
          id
          slug
          ...
        }
        primary_tag {
          id
          slug
          ...
        }
        authors {
          id
          slug
          ...
        }
      }
    }
  }
}
```

**Filter Posts by Tag**

A common example of filtering posts by tag, can be achieved like this (Gatsby v2+):

```
{
  allGhostPost(filter: {tags: {elemMatch: {slug: {eq: $slug}}}}) {
    edges {
      node {
        slug
        ...
      }
    }
  }
}
```

**Query Settings**

The settings node is different as there's only one object:

```
{
  ghostSettings {
    title
    description
    lang
    ...
    navigation {
        label
        url
    }
  }
}
```

**Query Other Node Types**

The Post, Page, Author and Tag nodes all work the same. Use the node type you need in this query:


```
{
  allGhost${NodeType} {
    edges {
      node {
        id
        slug
        ...
      }
    }
  }
}
```

## Credits

This project would not be possible without the great [Gatsby](https://www.gatsbyjs.org/), [Ghost](https://ghost.org/), [React](https://reactjs.org/), [GraphQL](https://graphql.org/), [Node](https://nodejs.org) and the [JavaScript](https://developer.mozilla.org/de/docs/Web/JavaScript) eco-system in general. This project started from a fork of [`gatsby-source-ghost`](https://github.com/TryGhost/gatsby-source-ghost), but has evolved to a different, independent project.

# Copyright & License

Copyright (c) 2020 styxlab - Released under the [MIT license](LICENSE).
