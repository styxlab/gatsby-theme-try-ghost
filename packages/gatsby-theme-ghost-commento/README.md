# gatsby-theme-ghost-commento
[![Released under MIT license.](https://badgen.net/github/license/micromatch/micromatch)](https://github.com/styxlab/gatsby-theme-ghost-commento/blob/master/LICENSE)
[![gatsby-theme-ghost-commento npm package version.](https://badgen.net/npm/v/gatsby-theme-ghost-commento)](https://www.npmjs.org/package/gatsby-theme-ghost-commento)
[![PRs welcome!](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)]()

Integrates the commenting system [Commento](https://commento.io/) into blog posts of [gatsby-theme-try-ghost](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/packages/gatsby-theme-try-ghost). This theme makes use of latent-component-shadowing and showcases best practices for adding custom themes to `gatsby-theme-try-ghost`.

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
            // The url pointing to your self-hosted commento installation
            // You can remove the option, if you use the commento.io managed service
            url: `https://commento.your-blog.com`,
        },
    },
]
```

## Details

This Gatsby theme plugin hooks into the `gatsby-theme-try-ghost` theme and adds a comment section to every post. Please play with the [Commento Demo](https://demo.commento.io/) in order to find out if this is the right commenting system for you. If you are self-hosting commento, then add your endpoint in the `url` field above. Users of the commento.io managed service, can remove the options as the `url` defaults to `https://cdn.commento.io`.

## Backend

In order to be able to use comments with Commento, you need a backend. You have two options here:

1. Register with [Commento](https://commento.io/signup) (convenient, subscription fees).

2. Spin-up a self-hosted Commento server [Commento server](https://docs.commento.io/installation/self-hosting/) (full control, own server costs).

The Commento backend allows you to set spam filters, add moderators, authentication options and much more. It also provides a dashboard for anonymous analytics.


## Wishlist

All comments are sourced in via a javascript plugin on runtime. To improve SEO it would be better to have an hybrid approach, where older comments are sourced in during Gatsby build time and only new comments are provided on runtime.  If you feel the call to improve this plugin, please get in contact with us.


## Contributions

PRs are welcome! Consider contributing to this project if you are missing feature that is also useful for others. Explore [this guide](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/CONTRIBUTING.md), to get some more ideas.


# Copyright & License

Copyright (c) 2020 styxlab - Released under the [MIT license](LICENSE).
