# gatsby-theme-ghost-contact

Adds a contact form page to [gatsby-theme-try-ghost](https://github.com/styxlab/gatsby-theme-try-ghost). This theme makes use of latent-component-shadowing and showcases best practices for adding custom themes to `gatsby-theme-try-ghost`.

## Install

`yarn add gatsby-theme-ghost-contact`


## Dependencies

This theme is an add-on theme designed to seamlessly integrate with [gatsby-theme-try-ghost](https://github.com/styxlab/gatsby-theme-try-ghost). The theme uses functions provided by `gatsby-theme-try-ghost`, so installing `gatsby-theme-try-ghost` is required.

`yarn add gatsby-theme-try-ghost`


## Works best with...

If you are using a feature image on your contact page, it is highly recommended to also install `gatsby-plugin-ghost-images` in order to get your image lazy loaded with `gatsby-images`.

`yarn add gatsby-plugin-ghost-images`


## How to use

```javascript
// In your gatsby-config.js
plugins: [
    {
        resolve: `gatsby-theme-ghost-contact`,
        options: {
            siteMetadata: {
                // This will be added to your navigation menu
                navigation: [{ label: `Contact`, url: `/contact/` }],
            },
            serviceConfig: {
                // This is the endpoint where your form data is sent to
                url: `https://api.your-server.com/contact`,
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

If you want to integrate other pages or if you want to customize the base theme provided with `gatsby-theme-try-ghost`, please inspect the source code of `gatsby-theme-ghost-contact` closely. The latent-component-shadowing approach used here is very general and is an amazing concept. All additions to `gatsby-theme-try-ghost` will be based on these principles.

## Backends

All backend options described in the [Gatsby Docs](https://www.gatsbyjs.org/docs/building-a-contact-form/) should work with this theme as well. One of the following two options should get you started quickly:

### Netlify

If you deploy your site to netlify, this may be the easiest approach for you. As all necessary [netlify fields](https://docs.netlify.com/forms/setup/) have been added to the form, you will automatically see form submissions in your netlify dashboards. No configuration needed.

### Run your own server

Running your own server will give you most control of the data and how it is processed. An initial implementation of such a micro-service is explained in this tutorial: [Contact Forms in Ghost — Without External Services](https://atmolabs.org/contact-forms-in-ghost/). Note that only chapters on the node micro-service are relevant here. Once your micro-service is up and running, just change `serviceConfig.url` to point to your endpoint.


# Copyright & License

Copyright (c) 2020 styxlab - Released under the [MIT license](LICENSE).
