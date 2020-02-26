# gatsby-theme-try-ghost
Gatsby static web app served from headless Ghost CMS

## Project goals
- [x] Ghost should serve as headless CMS
- [x] Gatsby should do all frontend processing
- [x] Generated static sites should come as close to the standard Ghost with Casper v3 theme as possible
- [x] Casper v3 features like *Sticky Nav Title*, [*Gallery Card*, *Infinite Scroll*] should be supported
- [ ] Prioritize AMP pages (+ other SEO-related stuff)

## Not supported
- [x] No additions that go beyond the Ghost default Casper v3 theme
- [x] Dynamic functions, that are not easily replicated on a *static site* will be omitted (e.g. no members areas/functions)
- [x] Features that need solutions in upstream repositories, will have to wait until those solutions are available

## Initial Approach
- [x] Use gatsby-starter-ghost as a starting point
- [x] Resemble the Casper v3 handlebars template structure in JSX  (so it is easy to compare both frontends)
- [x] Use exactly the same css stylefiles as Casper v3

## Quality assurance
- [ ] qualitative tests
- [ ] possibly unit tests at a later time


## Todos
- [x] Inital Development in Playground: *in progress*
- [x] Public default Ghost Installation (serving as headless CMS)
- [x] Move project over to this repo after basic strategy/concepts are clearly defined
