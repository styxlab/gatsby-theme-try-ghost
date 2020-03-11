# gatsby-plugin-ghost-images

Downloads images from Ghost CMS so they can be automatically processed with Gatsby image tools.

## Install

`yarn add gatsby-plugin-ghost-images `

## How to use

```javascript
// In your gatsby-config.js
plugins: [
  {
    resolve: `gatsby-transformer-rehype`,
    options: {
      plugins: [
        {
          resolve: `gatsby-rehype-ghost-links`,
        },
      ],
    },
  },
]
```

## Details

Due to current limitations of the [Ghost Content API](https://ghost.org/docs/api/v3/content/), links within posts and pages are always returned as absolute URLs rather than relative ones. For example, if you have a link in one of your pages that refers to an internal post (e.g. `/welcome-post/`) the Ghost Content API will always return an absolute URL such as
`https://your-ghost-cms.org/welcome-post/`.

Those links won't work on your Gatsby site as you host them on a different `siteUrl`. `gatsby-rehype-ghost-links` is part of the *rehype* collection and will rewrite `https://your-ghost-cms.org/welcome-post/` into `/welcome-post/` so internal links work as expected.

## Limitations

Currently the detection mechanism for the CMS site URL is limited to content coming from a headless Ghost CMS, but it should be easy to add some options, so this can be also used in other contexts.

# Copyright & License

Copyright (c) 2020 styxlab - Released under the [MIT license](LICENSE).
