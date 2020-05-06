# gatsby-theme-try-ghost
[![Released under MIT license.](https://badgen.net/github/license/micromatch/micromatch)](https://github.com/styxlab/gatsby-theme-try-ghost/blob/master/LICENSE)
[![gatsby-theme-try-ghost npm package version.](https://badgen.net/npm/v/gatsby-theme-try-ghost)](https://www.npmjs.org/package/gatsby-theme-try-ghost)
[![PRs welcome!](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)]()
 
A Gatsby theme plugin for creating blogs from headless [Ghost CMS](https://ghost.org/changelog/jamstack/).

Turn your Ghost blog into a flaring fast static website. This Gatsby theme is a frontend replacement of the Ghost handlebars engine featuring the standard Ghost Casper skin and functionality. All content is sourced from a headless Ghost CMS.


## Demo

Play with the [Demo](https://styxlab.github.io) to get a first impression.


## Features

- Ghost Casper look and feel
- Infinite Scroll ✨ 🆕
- [Gatsby images](https://using-gatsby-image.gatsbyjs.org/) 🚀 🆕
- Sticky navigation headers
- Hover on author avatar
- Styled 404 page
- SEO optimized
- Fully responsive
- Advanced routing 🆕
- Composable and extensible

## Performance

![Lighthouse Score](https://static.gotsby.org/v1/assets/images/jamify-lighthouse.png)


## Plugins

Additional features can be integrated by installing Gatsby themes or plugins. The following plugins have been tested to work with [`gatsby-theme-try-ghost`](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/packages/gatsby-theme-try-ghost):

| Name | Version | Description |   
| ---- | ------- | ----------- |
| [`gatsby-theme-ghost-dark-mode`](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/packages/gatsby-theme-ghost-dark-mode) | [![version](https://badgen.net/npm/v/gatsby-theme-ghost-dark-mode)](https://www.npmjs.com/package/gatsby-theme-ghost-dark-mode) | Dark mode toggle 🌗 |
| [`gatsby-rehype-ghost-links`](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/packages/gatsby-rehype-ghost-links) | [![version](https://badgen.net/npm/v/gatsby-rehype-ghost-links)](https://www.npmjs.com/package/gatsby-rehype-ghost-links) | Rewrite CMS links from absolute to relative |
| [`gatsby-rehype-prismjs`](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/packages/gatsby-rehype-prismjs) | [![version](https://badgen.net/npm/v/gatsby-rehype-prismjs)](https://www.npmjs.com/package/gatsby-rehype-prismjs) | Syntax highlighting with [PrismJS](http://prismjs.com/) |
| [`gatsby-theme-ghost-contact`](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/packages/gatsby-theme-ghost-contact) | [![version](https://badgen.net/npm/v/gatsby-theme-ghost-contact)](https://www.npmjs.com/package/gatsby-theme-ghost-contact) | Contact page |
| [`gatsby-theme-ghost-commento`](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/packages/gatsby-theme-ghost-commento) 🆕 | [![version](https://badgen.net/npm/v/gatsby-theme-ghost-commento)](https://www.npmjs.com/package/gatsby-theme-ghost-commento) | Commenting system with [Commento](https://commento.io/) |
| [`gatsby-theme-ghost-toc`](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/packages/gatsby-theme-ghost-toc) 🆕 | [![version](https://badgen.net/npm/v/gatsby-theme-ghost-toc)](https://www.npmjs.com/package/gatsby-theme-ghost-toc) | Table of Contents |
| [`gatsby-plugin-ackee-tracker`](https://github.com/burnsy/gatsby-plugin-ackee-tracker) | [![version](https://badgen.net/npm/v/gatsby-plugin-ackee-tracker)](https://www.npmjs.com/package/gatsby-plugin-ackee-tracker) | Site tracking with [Ackee](https://github.com/electerious/Ackee) |
| [`gatsby-plugin-google-analytics`](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-plugin-google-analytics) | [![version](https://badgen.net/npm/v/gatsby-plugin-google-analytics)](https://www.npmjs.com/package/gatsby-plugin-google-analytics) | Site tracking with [Google Analytics](https://developers.google.com/analytics) |


## Installation

> Head over to the [starter repo](https://github.com/styxlab/gatsby-starter-try-ghost) to get up and running quickly! 


If you want to add this blog theme to an existing site, follow these instructions:

1. Install the blog theme

    ```bash
    yarn add gatsby-theme-try-ghost
    # or
    npm install gatsby-theme-try-ghost --save
    ```

2. Add the following configuration to your `gatsby-config.js` file

    ```js
    // gatsby-config.js
    module.exports = {
    plugins: [
        {
        resolve: `gatsby-theme-try-ghost`,
        options: {
            siteConfig: {
                siteUrl: `https://your-bog.com`,
                postsPerPage: 3,
                siteTitleMeta: `Gatsby frontend powered by headless Ghost CMS`,
                siteDescriptionMeta: `Turn your Ghost blog into a flaring fast static site with Gatsby`, 
                shareImageWidth: 1000,
                shareImageHeight: 523,
                shortTitle: `Ghost`,
                siteIcon: `favicon.png`,
                backgroundColor: `#e9e9e9`,
                themeColor: `#15171A`,
                // Overwrite navigation menu (default: []), label is case sensitive
                // overwriteGhostNavigation: [{ label: `Home`, url: `/` }],
            },
            ghostConfig: {
                "development": {
                    "apiUrl": "http://localhost:2368",
                    "contentApiKey": "9fcfdb1e5ea5b472e2e5b92942",
                },
                "production": {
                    "apiUrl": "https://your-ghost-cms.com",
                    "contentApiKey": "9fcfdb1e5ea5b472e2e5b92942",
                },
            },
            //routes: {
            //    // Root url for Ghost posts and pages (optional, defaults to `/`)
            //    basePath: `/blog`,
            //
            //    // Collections (optional , default: [])
            //    collections: [{
            //        path: `speeches`,
            //        selector: node => node.primary_tag && node.primary_tag.slug === `speeches`,
            //    }],
            //},
          },
       },
    ],  
    }
    ```

3. Update siteConfig

    In the configuration shown above, the most important fields to be changed are `siteUrl`, `siteTitleMeta` and `siteDescriptionMeta`. Update at least those to fit your needs. Also make sure your `favicon.png` can be found in folder `static` of your working directory.

4. Ghost Content API Keys

    Change the `apiUrl` value to the URL of your Ghost CMS site. Next, update the `contentApiKey` value to a key associated with the Ghost CMS site. A key can be provided by creating an integration within Ghost Admin. Navigate to *Integrations* and click *Add new integration*. Give the integration a name and click create.

5. Advanced Routing

    You can define a `basePath` that is added to all routes, effectively moving all routes one level down. Collections are distinct groups of posts that get an entry point at `collections.path`. Permalinks are best configured in`routes.yaml` of the Ghost CMS.

## Running

Start the development server. You now have a Gatsby site pulling content from headless Ghost.

```bash
gatsby develop
```

## Ensure headless mode of Ghost CMS

For best SEO results it is strongly recommended to disable the default Ghost Handlebars theme front-end by selecting the *Make this site private* flag within your Ghost admin settings. This enables password protection in front of the Ghost install and sets `<meta name="robots" content="noindex" />` so your Gatsby front-end becomes the source of truth for SEO.


## Contributions

PRs are welcome! Consider contributing to this project if you are missing feature that is also useful for others. Explore [this guide](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/CONTRIBUTING.md), to get some more ideas.

# Copyright & License

Copyright (c) 2020 styxlab - Released under the [MIT license](LICENSE).
