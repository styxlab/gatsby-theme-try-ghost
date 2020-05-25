# gatsby-theme-ghost-members
[![Released under MIT license.](https://badgen.net/github/license/micromatch/micromatch)](https://github.com/styxlab/gatsby-theme-ghost-members/blob/master/LICENSE)
[![gatsby-theme-ghost-members npm package version.](https://badgen.net/npm/v/gatsby-theme-ghost-members)](https://www.npmjs.org/package/gatsby-theme-ghost-members)
[![PRs welcome!](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)]()

Adds a membership subscription button and form to [gatsby-theme-try-ghost](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/packages/gatsby-theme-try-ghost). This plugin interacts directly with your headless Ghost CMS. After a user submits an email address via the subscription form, the user receives a magic link for membership activation in the inbox. If that link is clicked, the user is registered as a member in your Ghost CMS dashboard.

## Install

`yarn add gatsby-theme-ghost-members`


## Dependencies

This theme is an add-on theme designed to seamlessly integrate with [gatsby-theme-try-ghost](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/packages/gatsby-theme-try-ghost). The theme uses functions provided by `gatsby-theme-try-ghost`, so installing `gatsby-theme-try-ghost` is required.

`yarn add gatsby-theme-try-ghost`

## How to use

```javascript
// In your gatsby-config.js
plugins: [
    {
        resolve: `gatsby-theme-ghost-members`,
    },
]
```

## Details

This plugin brings Ghost Membership functionality to your Gatsby site!✨ It utilizes your headless Ghost CMS for managing your members, so there is no need to install another back-end.

A subscription button is added to every page which opens a modal page with a subscription form. In addition, a subscription section is shown at the end of every post with an email input field and a submit button. Once a user submits an email, a `POST` request is issued to your headless Ghost CMS containing the email as payload. This triggers your CMS to send out an email to that address containing a magic link for membership subscription. Once a user clicks on that link, the user's email address is added to your Ghost membership dashboard.

A final request from Ghost CMS is fired which opens your Ghost site and displays a success message. As this request also points to your CMS, you should use your reverse proxy to forward it to your static site. That way, the user will see the success message where it belongs: on the same website where membership subscription was initiated.


## Ghost CMS configuration

You must activate the members dashboard in Ghost Admin. Go to *Labs* and activate the *Enable members* section. In addition, ensure that the email configuration is set up correctly. You can test that by clicking on the *Send* button under *Labs -> Test email configuration*.


## Nginx Configuration (optional)

It is strongly recommended to make a small configuration change to your reverse proxy. With this, the user will be redirected to your Gatsby site after clicking on the magic link:

```text
// /etc/nginx/conf.d/cms-ghost.conf

server {

    server_name cms.your-backend.com;

    if ($args ~* "^action=subscribe&success=") {
        return 301 \$scheme://www.gatsby-frontend.com\$request_uri;
    }
}

```

Substitute `www.gatsby-frontend.com` with the address of your static site. Without this change users may get confused: After clicking the magic link, they will see the private login screen of your CMS.

## Contributions

PRs are welcome! Consider contributing to this project if you are missing feature that is also useful for others. Explore [this guide](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/CONTRIBUTING.md), to get some more ideas.


# Copyright & License

Copyright (c) 2020 styxlab - Released under the [MIT license](LICENSE).
