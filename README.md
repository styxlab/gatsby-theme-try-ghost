# gatsby-theme-try-ghost

[![Released under MIT license.](https://badgen.net/github/license/micromatch/micromatch)](https://github.com/styxlab/gatsby-theme-try-ghost/blob/master/LICENSE)
[![gatsby-theme-try-ghost npm package version.](https://badgen.net/npm/v/gatsby-theme-try-ghost)](https://www.npmjs.com/package/gatsby-theme-try-ghost)
[![PRs welcome!](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)]()

A Gatsby theme plugin for creating blogs from headless [Ghost CMS](https://ghost.org/changelog/jamstack/).

Turn your Ghost blog into a flaring fast static website. This Gatsby theme is a frontend replacement of the Ghost handlebars engine featuring the standard Ghost Casper skin and functionality. All content is sourced from a headless Ghost CMS.

## Variants 🔥

Favor [Next.js](https://nextjs.org/) over Gatsby? Head over to [next-cms-ghost](https://github.com/styxlab/next-cms-ghost)!

## Tutorials ✨ 🆕

> Check out the [Tutorials](https://www.jamify.org) for practical guides on using this project.

## Demo

Play with the [Demo](https://demo.jamify.org/) to get a first impression.

## Features

-   Ghost Casper look and feel
-   _Feature & inline_ images with [lazy-loading and blur-up effect](https://using-gatsby-image.gatsbyjs.org/) 🚀 🆕
-   Infinite Scroll ✨
-   Featured posts pinned on top 🆕
-   Sticky navigation headers
-   Hover on author avatar
-   Styled 404 page
-   SEO optimized
-   Fully responsive
-   Advanced routing 🆕
-   Composable and extensible
-   Incremental build enabled 🚀 🆕

## Plugins

Additional features can be integrated by installing Gatsby themes or plugins. The following plugins have been tested to work with [`gatsby-theme-try-ghost`](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/packages/gatsby-theme-try-ghost):

| Name                                                                                                                                   | Version                                                                                                                             | Description                                                                    |
| -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| [`gatsby-theme-ghost-dark-mode`](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/packages/gatsby-theme-ghost-dark-mode)  | [![version](https://badgen.net/npm/v/gatsby-theme-ghost-dark-mode)](https://www.npmjs.com/package/gatsby-theme-ghost-dark-mode)     | Dark mode toggle 🌗                                                            |
| [`gatsby-rehype-ghost-links`](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/packages/gatsby-rehype-ghost-links)        | [![version](https://badgen.net/npm/v/gatsby-rehype-ghost-links)](https://www.npmjs.com/package/gatsby-rehype-ghost-links)           | Rewrite CMS links from absolute to relative                                    |
| [`gatsby-rehype-inline-images`](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/packages/gatsby-rehype-inline-images) 🆕 | [![version](https://badgen.net/npm/v/gatsby-rehype-inline-images)](https://www.npmjs.com/package/gatsby-rehype-inline-images)       | Lazy-loading inline images with blur-up                                        |
| [`gatsby-rehype-prismjs`](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/packages/gatsby-rehype-prismjs)                | [![version](https://badgen.net/npm/v/gatsby-rehype-prismjs)](https://www.npmjs.com/package/gatsby-rehype-prismjs)                   | Syntax highlighting with [PrismJS](http://prismjs.com/)                        |
| [`gatsby-theme-ghost-contact`](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/packages/gatsby-theme-ghost-contact)      | [![version](https://badgen.net/npm/v/gatsby-theme-ghost-contact)](https://www.npmjs.com/package/gatsby-theme-ghost-contact)         | Contact page                                                                   |
| [`gatsby-theme-ghost-commento`](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/packages/gatsby-theme-ghost-commento)    | [![version](https://badgen.net/npm/v/gatsby-theme-ghost-commento)](https://www.npmjs.com/package/gatsby-theme-ghost-commento)       | Commenting system with [Commento](https://commento.io/)                        |
| [`gatsby-theme-ghost-toc`](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/packages/gatsby-theme-ghost-toc) 🆕           | [![version](https://badgen.net/npm/v/gatsby-theme-ghost-toc)](https://www.npmjs.com/package/gatsby-theme-ghost-toc)                 | Table of Contents                                                              |
| [`gatsby-theme-ghost-members`](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/packages/gatsby-theme-ghost-members) 🆕   | [![version](https://badgen.net/npm/v/gatsby-theme-ghost-members)](https://www.npmjs.com/package/gatsby-theme-ghost-members)         | Member Subscriptions                                                           |
| [`gatsby-plugin-ackee-tracker`](https://github.com/burnsy/gatsby-plugin-ackee-tracker)                                                 | [![version](https://badgen.net/npm/v/gatsby-plugin-ackee-tracker)](https://www.npmjs.com/package/gatsby-plugin-ackee-tracker)       | Site tracking with [Ackee](https://github.com/electerious/Ackee)               |
| [`gatsby-plugin-google-analytics`](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-plugin-google-analytics)             | [![version](https://badgen.net/npm/v/gatsby-plugin-google-analytics)](https://www.npmjs.com/package/gatsby-plugin-google-analytics) | Site tracking with [Google Analytics](https://developers.google.com/analytics) |

## Quick Start

Head over to the [starter repo](https://github.com/styxlab/gatsby-starter-try-ghost) to get up and running quickly! The starter is recommended if you are creating a new site.

## Installation

This mono repository contains the demo code, the base theme and add-ons. If you are here to install the Gatsby base theme plugin in your existing project, check out the [theme specific README](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/packages/gatsby-theme-try-ghost/README.md) for further details. All add-ons can be found under the [packages/](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/packages/) folder.

In case you want to work with this repository (for local development, pull requests, etc.):

1. Clone or fork this repository:

```bash
git clone https://github.com/styxlab/gatsby-theme-try-ghost.git
cd gatsby-theme-try-ghost
```

2. Run `yarn` to install dependencies.

3. Run `yarn develop` to start the example locally.

## Contributions

Special thanks go to the following contributors: [marcoSven](https://github.com/marcoSven), [jem](https://github.com/jempurich), [sawilde](https://github.com/sawilde), [tobimori](https://github.com/tobimori), [Torqu3Wr3nch](https://github.com/Torqu3Wr3nch) and [mf](https://github.com/motherfacker).

PRs are welcome! Consider contributing to this project if you are missing feature that is also useful for others. Explore [this guide](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/CONTRIBUTING.md), to get some more ideas.

## Credits

This project would not be possible without the great [Gatsby](https://www.gatsbyjs.org/), [Ghost](https://ghost.org/), [React](https://reactjs.org/), [GraphQL](https://graphql.org/), [Node](https://nodejs.org) and the [JavaScript](https://developer.mozilla.org/de/docs/Web/JavaScript) eco-system in general.

## Disclaimer

This project is not affiliated with [Gatsby](https://www.gatsbyjs.org/) or [Ghost](https://ghost.org/).

# Copyright & License

Copyright (c) 2020 styxlab - Released under the [MIT license](LICENSE).
