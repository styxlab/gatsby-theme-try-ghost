# gatsby-rehype-prismjs
[![Released under MIT license.](https://badgen.net/github/license/micromatch/micromatch)](https://github.com/styxlab/gatsby-theme-try-ghost/blob/master/LICENSE)
[![gatsby-rehype-prismjs npm package version.](https://badgen.net/npm/v/gatsby-rehype-prismjs)](https://www.npmjs.org/package/gatsby-rehype-prismjs)
[![PRs welcome!](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)]()

Adds syntax highlighting to code tags in HTML fragments using [PrismJS](http://prismjs.com/). This package is inspired by [gatsby-remark-prismjs](https://www.gatsbyjs.org/packages/gatsby-remark-prismjs/), the difference being that the content source is [HTML](https://www.w3schools.com/html/) instead of remark.

This plugin is part of the *rehype* collection and intended to be used with [gatsby-transformer-rehype](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/packages/gatsby-transformer-rehype).


## Install

`yarn add gatsby-transformer-rehype gatsby-rehype-prismjs prismjs`


## How to use

```javascript
// In your gatsby-config.js
plugins: [
  {
    resolve: `gatsby-transformer-rehype`,
    options: {
      plugins: [
        {
          resolve: `gatsby-rehype-prismjs`,
          options: {
            // All code blocks will be wrapped in an additional <div>
            // containter to allow for better styling. This might break
            // your current theme. You might therefore have to provide
            // additional styling classes (below is just an example).
            divClassNames: "kg-card kg-code-card",
            // Class prefix for <pre> tags containing syntax highlighting;
            // defaults to 'language-' (e.g. <pre class="language-js">).
            // If your site loads Prism into the browser at runtime,
            // (e.g. for use with libraries like react-live),
            // you may use this to prevent Prism from re-processing syntax.
            // This is an uncommon use-case though;
            // If you're unsure, it's best to use the default value.
            classPrefix: "language-",
            // This is used to allow setting a language for inline code
            // (i.e. single backticks) by creating a separator.
            // This separator is a string and will do no white-space
            // stripping.
            // A suggested value for English speakers is the non-ascii
            // character '›'.
            inlineCodeMarker: null,
            // This lets you set up language aliases.  For example,
            // setting this to '{ sh: "bash" }' will let you use
            // the language "sh" which will highlight using the
            // bash highlighter.
            aliases: {},
            // If setting this to false, the parser handles and highlights inline
            // code, i.e. single backtick code like `this`.
            noInlineHighlight: true,
            // By default the HTML entities <>&'" are escaped.
            // Add additional HTML escapes by providing a mapping
            // of HTML entities and their escape value IE: { '}': '&#123;' }
            escapeEntities: {},
          },
        },
      ],
    },
  },
]
```

## Customize PrismJS theme

> If you are using this plugin together with [gatsby-theme-try-ghost](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/packages/gatsby-theme-try-ghost), a default prism theme is already installed for you. Installing a CSS theme is only required, if used with other projects or if you want to change or customize the theme.

PrismJS ships with a number of themes that you can easily include in your Gatsby site. You can find these themes in `node_modules/prismjs/themes/`. To load a theme, you can require its CSS file in `gatsby-browser.js`, e.g.

```javascript
// gatsby-browser.js
require("prismjs/themes/prism-solarizedlight.css")
```

If your base theme is [gatsby-theme-try-ghost](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/packages/gatsby-theme-try-ghost), *do not* put the CSS file into `gatsby-browser.js` as it has unwanted side effects. Rather provide the CSS file in a specific location, so `gatsby-theme-try-ghost` can easily find it. Create a file with name `prism.css` and put it in the following location, so the default file is shadowed:

```text
// in your base directory
└── gatsby-config.js
└── src/
    └── gatsby-theme-try-ghost
        └── styles
            └── prism.css
```

## Dark mode

The standard theme that ships with [gatsby-theme-try-ghost](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/packages/gatsby-theme-try-ghost) is already dark mode enabled. If you are using the standard themes, you should add some additional CSS for dark mode support.

## Usage in HTML

Syntax highlighting is applied to HTML `<code>` blocks that are enclosed by a parent `<pre>` blocks.

```html
<pre>
    <code class="language-javascript">
        var app = express();
    </code>
</pre>
```

## Inline code blocks

In addition to fenced code blocks, inline code blocks will be passed through PrismJS as well. If you set the `inlineCodeMarker`, then you can also specify a format style.

Here's an example of how to use this if the `inlineCodeMarker` was set to `±`:

I can highlight `css±.some-class { background-color: red }` with CSS syntax.

This will be rendered in a `<code class=language-css>` with just the (syntax highlighted) text of `.some-class { background-color: red }`


## Disable syntax highlighting

If you want to disable syntax highlighting in specific code blocks, use the `none` language.


## Contributions

PRs are welcome! Consider contributing to this project if you are missing feature that is also useful for others. Explore [this guide](https://github.com/styxlab/gatsby-theme-try-ghost/tree/master/CONTRIBUTING.md), to get some more ideas.


# Copyright & License

Copyright (c) 2020 styxlab - Released under the [MIT license](LICENSE).
