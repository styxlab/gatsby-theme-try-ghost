# gatsby-theme-try-ghost 
[![Released under MIT license.](https://badgen.net/github/license/micromatch/micromatch)](https://github.com/styxlab/gatsby-theme-try-ghost/blob/master/LICENSE)
[![gatsby-theme-try-ghost npm package version.](https://badgen.net/npm/v/gatsby-theme-try-ghost)](https://www.npmjs.org/package/gatsby-theme-try-ghost)
[![PRs welcome!](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)]()

A Gatsby theme plugin for creating blogs from headless [Ghost CMS](https://ghost.org/changelog/jamstack/).

Turn your Ghost blog into a lightning fast static website. This Gatsby theme is a frontend replacement of the Ghost handlebars engine featuring the standard Ghost Casper skin and functionality. All content is sourced from a headless Ghost CMS.

## Demo

Play with the [Demo](https://styxlab.github.io) to get a first impression.


## Features

- Ghost Casper look and feel
- Sticky navigation headers
- [Gatsby images](https://using-gatsby-image.gatsbyjs.org/) :rocket: :new:
- Hover on author avatar
- Secondary navigation
- Styled 404 page
- SEO optimized
- Fully responsive
- Composable and extensible

## Performance

![Lighthouse Score](https://cms.gotsby.org/content/images/gotsby-lighthouse.png)

## Addons

Additional features can be integrated by installing Gatsby themes or plugins. The following plugins have been tested to work with this repository:

 - Dark mode toggle with [gatsby-theme-ghost-dark-mode](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/packages/gatsby-theme-ghost-dark-mode) :last_quarter_moon: :new:
 - Rewrite CMS links to relative with [gatsby-rehype-ghost-links](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/packages/gatsby-rehype-ghost-links)
 - Syntax highlighting with [gatsby-rehype-prismjs](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/packages/gatsby-rehype-prismjs)
 - Contact page with [gatsby-theme-ghost-contact](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/packages/gatsby-theme-ghost-contact) :new:
 - Site tracking with [Ackee](https://github.com/burnsy/gatsby-plugin-ackee-tracker)

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


## Contributing

PRs are welcome! Consider contributing to this project if you are missing feature that is useful also for others.

# Copyright & License

Copyright (c) 2020 styxlab - Released under the [MIT license](LICENSE).
