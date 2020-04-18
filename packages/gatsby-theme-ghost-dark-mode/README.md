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
            // Set to true if you want your theme to default to dark mode (default: false)
            // Note that this setting has an effect only, if
            //    1. The user has not changed the dark mode
            //    2. Dark mode is not reported from OS
            defaultModeDark: false,
            // If you want the defaultModeDark setting to take precedence
            // over the mode reported from OS, set this to true (default: false)
            overrideOS: false,
        },
    },
]
```

## Details

This Gatsby theme plugin hooks into the `gatsby-theme-try-ghost` theme and adds a dark mode toggle in the top right navigation bar. User's dark mode settings are persisted to `localStore`, so they should remain on page revisits. If the functionality is provided by the browser, dark mode setting is read from the OS and that setting is taken for first time use. The `defaultModeDark` setting is taken, if OS does not report dark mode or if the user has not chosen a theme preference in the OS. Finally, OS settings can be overruled with `overrideOS`.

This plugin also shows how to best customize `gatsby-theme-try-ghost`. The latent-component-shadowing approach used here is very general and is an amazing concept. This is useful if you plan on customizing `gatsby-theme-try-ghost` yourself.

## Limitations

If you use PrismJS your prism styles might be changed. Currently, the best option is to use a dark PrismJS style that looks great in both dark and light mode.


## Contributions

PRs are welcome! Consider contributing to this project if you are missing feature that is also useful for others. Explore [this guide](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/CONTRIBUTING.md), to get some more ideas.


# Copyright & License

Copyright (c) 2020 styxlab - Released under the [MIT license](LICENSE).
