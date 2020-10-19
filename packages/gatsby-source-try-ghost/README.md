# Gatsby Source Ghost

Gatsby source plugin for pulling data from headless [Ghost CMS](https://ghost.org/changelog/jamstack/). This plugin uses the [Gatsby schema customization](https://www.gatsbyjs.org/docs/schema-customization/) API to provide a strictly typed content schema. Data is fetched
via the [Ghost Content API Client](https://ghost.org/docs/api/v3/javascript/content/).

*Note:* This plugin replaces [jamify-source-ghost](https://github.com/styxlab/gatsby-theme-try-ghost/packages/jamify-source-ghost).

## Features

- [First class](https://www.gatsbyjs.com/docs/integration-guide/source-plugin/) Gatsby source plugin ✨
- Only fetch new or updated content from Ghost CMS
- Create or update GraphQL nodes only if content changes
- Strictly typed schema
- Foreign-key linking between post/pages and authors/tags
- Enabling incremental builds on Gatsby Cloud

## Install

`yarn add gatsby-source-try-ghost`

## How to use

Plugin configuration for `gatsby-config.js`:

```
{
   resolve: `gatsby-source-try-ghost`,
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

## Details

This plugin makes an effort to only fetch the minimal amount of data needed from the Ghost CMS to deliver exceptional performance. Equally important, only the GraphQL nodes that are new or have changed are updated. The latter is needed for incremental builds to function. In a first step, all existing nodes are touched, so they do not get garbage collected by Gatsby. Second, all node types are fetched from Ghost CMS, but only with a minimal field list in order to detect which nodes have been deleted. 

For the post and page types, a cached timestamp is used to only fetch new content. As authors and tag types do not contain a timestamp, all of them need to be fetched. This plugin uses a hash for authors and tags, so it creates GraphQL nodes only if changed. Set the `verbose` flag to true to get additional build time information about which nodes have been deleted, updated or created.


## How to query

This plugin generates five different node types: Post, Page, Author, Tag, and Settings. A full list of fields can be inspected in the [schema customizaion file](https://github.com/styxlab/gatsby-theme-try-ghost/blob/master/packages/gatsby-source-try-ghost/create-schema-customization.js).

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
