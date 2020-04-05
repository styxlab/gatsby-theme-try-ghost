# gatsby-theme-ghost-contact
[![Released under MIT license.](https://badgen.net/github/license/micromatch/micromatch)](https://github.com/styxlab/gatsby-theme-ghost-contact/blob/master/LICENSE)
[![gatsby-theme-ghost-contact npm package version.](https://badgen.net/npm/v/gatsby-theme-ghost-contact)](https://www.npmjs.org/package/gatsby-theme-ghost-contact)
[![PRs welcome!](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)]()

Adds a contact form page to [gatsby-theme-try-ghost](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/packages/gatsby-theme-try-ghost). This theme makes use of latent-component-shadowing and showcases best practices for adding custom themes to `gatsby-theme-try-ghost`.

## Install

`yarn add gatsby-theme-ghost-contact`


## Dependencies

This theme is an add-on theme designed to seamlessly integrate with [gatsby-theme-try-ghost](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/packages/gatsby-theme-try-ghost). The theme uses functions provided by `gatsby-theme-try-ghost`, so installing `gatsby-theme-try-ghost` is required.

`yarn add gatsby-theme-try-ghost`

## How to use

```javascript
// In your gatsby-config.js
plugins: [
    {
        resolve: `gatsby-theme-ghost-contact`,
        options: {
            siteMetadata: {
                // This will be added to your navigation menu
                navigation: [{ label: `Contact` }],
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
                path: `/contact/`,
                custom_excerpt: `Just drop us a line!`,
                feature_image: `https://static.gotsby.org/v1/assets/images/gatsby-ghost-contact.png`,
                // Can be disabled by providing an empty list []
                form_topics: [`Feedback`, `Question`],
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

If you want to integrate other pages or if you want to customize the base theme provided with `gatsby-theme-try-ghost`, please inspect the source code of `gatsby-theme-ghost-contact` closely. The latent-component-shadowing approach used here is very general and is an amazing concept. All additions to `gatsby-theme-try-ghost` will be based on these principles.

## Validations

Form validations are currently hard-coded and cannot be changed by configuration. The following restrictions have been chosen which should cover a wide range of use cases:

- Name: Number of characters must be in the range of 3 to 20.
- Email: Must conform to the standard.
- Subject: A subject must be chosen, if configured.
- Message: Number of characters must be in the range of 10 to 4000.

In addition, the honeyspot is only visible to robots and must be left empty.

## Backends

All backend options described in the [Gatsby Docs](https://www.gatsbyjs.org/docs/building-a-contact-form/) should work with this theme as well. One of the following two options should get you started quickly:

### Netlify

If you deploy your site to netlify, this may be the easiest approach for you. As all necessary [netlify fields](https://docs.netlify.com/forms/setup/) have been added to the form, you will automatically see form submissions in your netlify dashboards. The `serviceConfig` defaults have been set to match what netlify expects. Easiest is therefore to remove the `serviceConfig` object in the above configuration. If you want to explicitly see or control the values used, here are the default values for netlify:

```javascript
    serviceConfig: {
        url: `/`,
        contentType: `application/x-www-form-urlencoded`,
    }
```

### Run your own server

Running your own server will give you most control of the data and how it is processed. An initial implementation of such a micro-service is explained in this tutorial: [Contact Forms in Ghost — Without External Services](https://atmolabs.org/contact-forms-in-ghost/). Note that only chapters on the node micro-service are relevant here. Once your micro-service is up and running, just change `serviceConfig` to point to your endpoint. The micro-service described in the tutorial expects `json`, so the settings should look like:

```javascript
    serviceConfig: {
        url: `https://api.your-server.com/contact`,
        contentType: `application/json`,
    }
```

### Encoding

By selecting a content type, the form data json object is automatically encoded before being sent to the backend. If you choose `application/x-www-form-urlencoded`, data is url encoded. For `application/json` we use `JSON.stringify(data)` to convert the json object into a string. For all other content types, no encoding is performed.


## Contributions

PRs are welcome! Consider contributing to this project if you are missing feature that is also useful for others.


# Copyright & License

Copyright (c) 2020 styxlab - Released under the [MIT license](LICENSE).
