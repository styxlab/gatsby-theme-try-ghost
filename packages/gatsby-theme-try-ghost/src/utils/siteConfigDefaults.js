module.exports = {

    // Site domain. Do not include a trailing slash!
    siteUrl: `https://demo.jamify.org`,

    // Enable infinite scroll (default: true)
    infiniteScroll: true,

    // Initial number fetched, scrolling lazy loads posts one by one
    // If infinite scroll is disabled: maximum number of post shown per page
    postsPerPage: 12,

    // This allows an alternative site title for meta data for pages.
    siteTitleMeta: `Gatsby Headless Ghost Casper`,

    // This allows an alternative site description for meta data for pages.
    siteDescriptionMeta: `Gastby with Ghost CMS and Casper Skin`,

    // Used for App manifest e.g. Mobile Home Screen
    shortTitle: `Ghost`,

    // Logo in /static dir used for SEO, RSS, and App manifest
    siteIcon: `favicon.png`,
    backgroundColor: `#e9e9e9`,
    themeColor: `#15171A`,

    // Show more logs for debugging purposes (default: false)
    verbose: false,

    // Severity for verbose mode: (`info`, `warn`, `error`)
    severity: `info`,

    // Exclude post or pages (default: do not exclude)
    excludePostsOrPages: (() => false),

    // Overwrite navigation menu (default: []), label is case sensitive
    // overwriteGhostNavigation: [{ label: `Home`, url: `/` }],

}
