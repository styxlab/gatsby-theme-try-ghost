# gatsby-theme-ghost-dark-mode
[![Released under MIT license.](https://badgen.net/github/license/micromatch/micromatch)](https://github.com/styxlab/gatsby-theme-ghost-dark-mode/blob/master/LICENSE)
[![gatsby-theme-ghost-dark-mode npm package version.](https://badgen.net/npm/v/gatsby-theme-ghost-dark-mode)](https://www.npmjs.org/package/gatsby-theme-ghost-dark-mode)
[![PRs welcome!](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)]()

Integrates dark mode into [gatsby-theme-try-ghost](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/packages/gatsby-theme-try-ghost). This theme makes use of latent-component-shadowing and showcases best practices for adding custom themes to `gatsby-theme-try-ghost`.

## Install

`yarn add gatsby-theme-ghost-dark-mode`


## Dependencies

This theme is an add-on theme designed to seamlessly integrate with [gatsby-theme-try-ghost](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/packages/gatsby-theme-try-ghost). The theme uses functions provided by `gatsby-theme-try-ghost`, so installing `gatsby-theme-try-ghost` is required.

`yarn add gatsby-theme-try-ghost`

## How to use

```javascript
// In your gatsby-config.js
plugins: [
    {
        resolve: `gatsby-theme-ghost-dark-mode`,
        options: {
            siteMetadata: {
                // This will be added to your navigation menu
                navigation: [{ label: `Contact`, url: `/contact/` }],
            },
            //For netlify users only: remove serviceConfig or read section on netlify below.
            serviceConfig: {
                // This is the endpoint where your form data is sent to (optional, default: `/`)
                url: `https://api.your-server.com/contact`,
                // Must match the content type your service endpoint is expecting
                // optional, default: `application/x-www-form-urlencoded`
                contentType: `application/json`,
            },
            // Customize your page content here
            pageContext: {
                title: `Contact Us`,
                slug: `contact`,
                custom_excerpt: `Want to get in touch with the team? Just drop us a line!`,
                feature_image: `https://static.gotsby.org/v1/assets/images/contact-bluish.png`,
                // Can be disabled by providing an empty list []
                form_topics: [`I want to give feedback`, `I want to ask a question`],
                meta_title: `Contact Us`,
                meta_description: `A contact form page.`,
                // All content below the contact form
                html: ``,
            },
        },
    },
]
```

## Details

This plugin provides a simple contact page to your Gatsby-Ghost static website. The page style is inherited from the base theme and the form is styled using styled components. The plugin also does form validations. All configuration can be done in one place, namely in your `gatsby-config.js`. If you provide the navigation data shown above, a menu entry will be automatically added to your navigation bar.

You will have to change the `serviceConfig.url` to connect to your backend. The backend receives the form data and initiates an action such as sending you an email. Some guidance about your backend options can be found below.

If you want to integrate other pages or if you want to customize the base theme provided with `gatsby-theme-try-ghost`, please inspect the source code of `gatsby-theme-ghost-dark-mode` closely. The latent-component-shadowing approach used here is very general and is an amazing concept. All additions to `gatsby-theme-try-ghost` will be based on these principles.

# Copyright & License

Copyright (c) 2020 styxlab - Released under the [MIT license](LICENSE).
