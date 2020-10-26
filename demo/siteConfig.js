module.exports = {
    // Do not include a trailing slash!
    siteUrl: `https://tryghost404.netlify.app/`,

    // Enable infinite scroll (default: true)
    infiniteScroll: true,

    // Initial number fetched, scrolling lazy loads posts one by one
    // If infinite scroll is disabled: maximum number of post shown per page
    postsPerPage: 4,

    // This allows an alternative site title for meta data for pages.
    siteTitleMeta: `Gatsby Ghost Casper`,

    // This allows an site description for meta data for pages.
    siteDescriptionMeta: `Gastby with Ghost CMS and Casper Theme`,

    // Used for App and Offline manifest e.g. Mobile Home Screen
    shortTitle: `Jamify`,
    siteIcon: `favicon.png`,
    backgroundColor: `#e9e9e9`,
    themeColor: `#15171A`,

    // Show more logs for debugging purposes (default: false)
    verbose: true,

    // Severity for verbose mode: (`info`, `warn`, `error`)
    severity: `info`,

    // Exclude post or pages (default: do not exclude)
    // excludePostsOrPages: (node => node.tags.find(tag => tag.slug === `hash-hidden`) !== undefined),

    // Overwrite navigation menu (default: []), label is case sensitive
    // overwriteGhostNavigation: [{ label: `Home`, url: `/` }],
}
