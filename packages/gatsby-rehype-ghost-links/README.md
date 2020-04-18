# gatsby-rehype-ghost-links
[![Released under MIT license.](https://badgen.net/github/license/micromatch/micromatch)](https://github.com/styxlab/gatsby-theme-try-ghost/blob/master/LICENSE)
[![gatsby-rehype-ghost-links npm package version.](https://badgen.net/npm/v/gatsby-rehype-ghost-links)](https://www.npmjs.org/package/gatsby-rehype-ghost-links)
[![PRs welcome!](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)]()

Rewrites absolute links to relative links coming from a [Ghost CMS](https://ghost.org/changelog/jamstack/).

## Install

`yarn add gatsby-transformer-rehype gatsby-rehype-ghost-links`

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

Those links won't work on your Gatsby site as you host them on a different `siteUrl`. `gatsby-rehype-ghost-links` is part of the *rehype* collection and rewrites `https://your-ghost-cms.org/welcome-post/` into `/welcome-post/` so internal links work as expected.

## Limitations

Currently the detection mechanism for the CMS site URL is limited to content coming from a headless Ghost CMS, but it should be easy to add some options, so this plugin becomes useful in other contexts.


## Contributions

PRs are welcome! Consider contributing to this project if you are missing feature that is also useful for others. Explore [this guide](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/CONTRIBUTING.md), to get some more ideas.


# Copyright & License

Copyright (c) 2020 styxlab - Released under the [MIT license](LICENSE).
