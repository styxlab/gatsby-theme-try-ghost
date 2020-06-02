# Jamify Source Ghost

Gatsby source plugin for pulling data from headless [Ghost](https://ghost.org) CMS, using the Ghost [Content API](https://docs.ghost.org/api/content/). This plugin uses the Gatsby schmema customization API to provide a strictly typed content schema. This has many benefits, from faster type buildings to better hot-reloadings.

## Install

`yarn add jamify-source-ghost`

## How to use

Plugin configuration for `gatsby-config.js`:

```
{
   resolve: `jamify-source-ghost`,
   options: {
       apiUrl: `https://<your-subdomain>.ghost.io`,
       contentApiKey: `<your content api key>`,
       version: `v3` // Ghost API version, optional, defaults to "v3".
                     // Pass in "v2" if your Ghost install is not on 3.0 yet!!!
   }
}
```

`apiUrl`
 Ghost Content API URL - for Ghost(Pro) customers this is your `.ghost.io` domain, it’s the same URL used to view the admin panel, but without the `/ghost` subdirectory. This should be served over https.

`contentApiKey`
The "Content API Key" copied from the "Integrations" screen in Ghost Admin.

If you want to keep these values private (if your site is not public) you can do so using [environment variables](https://www.gatsbyjs.org/docs/environment-variables/).

## How to query

There are 5 node types available from Ghost: Post, Page, Author, Tag, and Settings.

Documentation for the full set of fields made available for each resource type can be
found in the [Content API docs](https://docs.ghost.org/api/content/). Posts and Pages have the same properties.

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

A common but tricky example of filtering posts by tag, can be achieved like this (Gatsby v2+):

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

The settings node is different as there's only one object, and it has the properties [listed here](https://docs.ghost.org/api/content/#settings).

```
{
  allGhostSettings {
    edges {
      node {
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
