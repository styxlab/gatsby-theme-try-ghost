# gatsby-theme-ghost-tags
[![Released under MIT license.](https://badgen.net/github/license/micromatch/micromatch)](https://github.com/styxlab/gatsby-theme-ghost-tags/blob/master/LICENSE)
[![gatsby-theme-ghost-members npm package version.](https://badgen.net/npm/v/gatsby-theme-ghost-members)](https://www.npmjs.org/package/gatsby-theme-ghost-tags)
[![PRs welcome!](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)]()

Adds a tags page to [gatsby-theme-try-ghost](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/packages/gatsby-theme-try-ghost). 

## Install

`yarn add gatsby-theme-ghost-tags`


## Dependencies

This theme is an add-on theme designed to seamlessly integrate with [gatsby-theme-try-ghost](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/packages/gatsby-theme-try-ghost). The theme uses functions provided by `gatsby-theme-try-ghost`, so installing `gatsby-theme-try-ghost` is required.

`yarn add gatsby-theme-try-ghost`

## How to use

```javascript
// In your gatsby-config.js
plugins: [
    {
        resolve: `gatsby-theme-ghost-tags`,
        options: {
            pageContext: {
                title: `Tags Collection`,
                path: `/tags/`,
                showIcon: true
            },
        },
    },
]
```

## Details

This plugin brings Tags functionality to your Gatsby site!✨ 

Tags functionality:
1. a page that shows all your tags in one navigation page for all your visitors to browse
2. a navigation link (icon) to allow your visitors to reach that page
3. can configure page title, path and icon visability via config

## Contributions

PRs are welcome! Consider contributing to this project if you are missing feature that is also useful for others. Explore [this guide](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/CONTRIBUTING.md), to get some more ideas.


# Copyright & License

Copyright (c) 2020 styxlab - Released under the [MIT license](LICENSE).
