# gatsby-theme-try-ghost 
[![Released under MIT license.](https://badgen.net/github/license/micromatch/micromatch)](https://github.com/styxlab/gatsby-theme-try-ghost/blob/master/LICENSE)
[![gatsby-theme-try-ghost npm package version.](https://badgen.net/npm/v/gatsby-theme-try-ghost)](https://www.npmjs.com/package/gatsby-theme-try-ghost)
[![PRs welcome!](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)]()

A Gatsby theme plugin for creating blogs from headless [Ghost CMS](https://ghost.org/changelog/jamstack/).

Turn your Ghost blog into a flaring fast static website. This Gatsby theme is a frontend replacement of the Ghost handlebars engine featuring the standard Ghost Casper skin and functionality. All content is sourced from a headless Ghost CMS.

## Demo

Play with the [Demo](https://styxlab.github.io) to get a first impression.


## Features

- Ghost Casper look and feel
- Infinite Scroll ✨ 🆕
- [Gatsby images](https://using-gatsby-image.gatsbyjs.org/) 🚀
- Sticky navigation headers
- Hover on author avatar
- Styled 404 page
- SEO optimized
- Fully responsive
- Advanced routing 🆕
- Composable and extensible

## Performance

![Lighthouse Score](https://static.gotsby.org/v1/assets/images/jamify-lighthouse.png)

## Addons

Additional features can be integrated by installing Gatsby themes or plugins. The following plugins have been tested to work with this repository:

| Name                                                                                                                          | Version                                                                                                                                                                        | Description                                                                                                                          |
| ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| [`gatsby-theme-ghost-dark-mode`](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/packages/gatsby-theme-ghost-dark-mode) | [![gatsby-theme-ghost-dark-mode npm package version.](https://badgen.net/npm/v/gatsby-theme-ghost-dark-mode)](https://www.npmjs.com/package/gatsby-theme-ghost-dark-mode) | Dark mode toggle 🌗 |
| [`gatsby-rehype-ghost-links`](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/packages/gatsby-rehype-ghost-links) | [![gatsby-rehype-ghost-links npm package version.](https://badgen.net/npm/v/gatsby-rehype-ghost-links)](https://www.npmjs.com/package/gatsby-rehype-ghost-links) | Rewrite CMS links from absolute to relative |
| [`gatsby-rehype-prismjs`](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/packages/gatsby-rehype-prismjs) | [![gatsby-rehype-prismjs npm package version.](https://badgen.net/npm/v/gatsby-rehype-prismjs)](https://www.npmjs.com/package/gatsby-rehype-prismjs) | Syntax highlighting with PrismJS |
| [`gatsby-theme-ghost-contact`](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/packages/gatsby-theme-ghost-contact) | [![gatsby-theme-ghost-contact npm package version.](https://badgen.net/npm/v/gatsby-theme-ghost-contact)](https://www.npmjs.com/package/gatsby-theme-ghost-contact) | Contact page |
| [`gatsby-theme-ghost-commento`](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/packages/gatsby-theme-ghost-commento) 🆕 | [![gatsby-theme-ghost-commento npm package version.](https://badgen.net/npm/v/gatsby-theme-ghost-commento)](https://www.npmjs.com/package/gatsby-theme-ghost-commento) | Commenting system with Commento |
| [`gatsby-theme-ghost-toc`](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/packages/gatsby-theme-ghost-toc) 🆕 | [![gatsby-theme-ghost-toc npm package version.](https://badgen.net/npm/v/gatsby-theme-ghost-toc)](https://www.npmjs.com/package/gatsby-theme-ghost-toc) | Table of Contents |
| [`Ackee`](https://github.com/burnsy/gatsby-plugin-ackee-tracker) | [![gatsby-plugin-ackee-tracker npm package version.](https://badgen.net/npm/v/gatsby-theme-ghost-toc)](https://www.npmjs.com/package/gatsby-plugin-ackee-tracker) | Site tracking |


## Quick Start

Head over to the [starter repo](https://github.com/styxlab/gatsby-starter-try-ghost) to get up and running quickly! The starter is recommended if you are creating a new site.


## Installation

This mono repository contains the demo code, the base theme and addons. If you are here to install the Gatsby base theme plugin in your existing project, check out the [theme specific README](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/packages/gatsby-theme-try-ghost/README.md) for further details. All addons can be found under the [packages/](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/packages/) folder.

In case you want to work with this repository (for local development, pull requests, etc.):

1. Clone or fork this repository:
```bash
git clone https://github.com/styxlab/gatsby-theme-try-ghost.git
cd gatsby-theme-try-ghost
```

2. Run `yarn` to install dependencies.

3. Run `yarn develop` to start the example locally.


## Contributions

PRs are welcome! Consider contributing to this project if you are missing feature that is also useful for others.

# Copyright & License

Copyright (c) 2020 styxlab - Released under the [MIT license](LICENSE).
