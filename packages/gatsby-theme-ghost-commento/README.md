# gatsby-theme-ghost-commento
[![Released under MIT license.](https://badgen.net/github/license/micromatch/micromatch)](https://github.com/styxlab/gatsby-theme-ghost-commento/blob/master/LICENSE)
[![gatsby-theme-ghost-commento npm package version.](https://badgen.net/npm/v/gatsby-theme-ghost-commento)](https://www.npmjs.org/package/gatsby-theme-ghost-commento)
[![PRs welcome!](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)]()

Integrates dark mode into [gatsby-theme-try-ghost](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/packages/gatsby-theme-try-ghost). This theme makes use of latent-component-shadowing and showcases best practices for adding custom themes to `gatsby-theme-try-ghost`.

## Install

`yarn add gatsby-theme-ghost-commento`


## Dependencies

This theme is an add-on theme designed to seamlessly integrate with [gatsby-theme-try-ghost](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/packages/gatsby-theme-try-ghost). The theme uses functions provided by `gatsby-theme-try-ghost`, so installing `gatsby-theme-try-ghost` is required.

`yarn add gatsby-theme-try-ghost`

## How to use

```javascript
// In your gatsby-config.js
plugins: [
    {
        resolve: `gatsby-theme-ghost-commento`,
        options: {
            // The url pointing to your commento installation (required)
            url: `https://commento.your-blog.com`,
        },
    },
]
```

## Details

This Gatsby theme plugin hooks into the `gatsby-theme-try-ghost` theme and adds a comment section to every post. To configure, just add your commento url to the plugin options as shown above.

This plugin also showcases how to best customize `gatsby-theme-try-ghost`. The latent-component-shadowing approach used here is very general and is an amazing concept. This is useful if you plan on customizing `gatsby-theme-try-ghost` yourself.

## Wishlist

All comments are sourced in via a javascript plugin on runtime. To improve SEO it would be better to have an hybrid approach, where older comments are sourced in during Gatsby build time and only new comments are provided on runtime.  If you feel the call to improve this plugin, please get in contact with us.


## Contributions

PRs are welcome! Consider contributing to this project if you are missing feature that is also useful for others.


# Copyright & License

Copyright (c) 2020 styxlab - Released under the [MIT license](LICENSE).
