const createNodeHelpers = require(`gatsby-node-helpers`).default

const PREFIX = `Ghost`
const POST = `Post`
const PAGE = `Page`
const TAG = `Tag`
const AUTHOR = `Author`
const SETTINGS = `Settings`

const {
    createNodeFactory,
    generateNodeId,
} = createNodeHelpers({
    typePrefix: PREFIX,
})

const PostNode = createNodeFactory(POST)
const PageNode = createNodeFactory(PAGE)
const TagNode = createNodeFactory(TAG)
const AuthorNode = createNodeFactory(AUTHOR)
const SettingsNode = createNodeFactory(SETTINGS)

const GhostTypes = {
    prefix: PREFIX,
    post: POST,
    page: PAGE,
    tag: TAG,
    author: AUTHOR,
    settings: SETTINGS,
}

module.exports = {
    PostNode,
    PageNode,
    TagNode,
    AuthorNode,
    SettingsNode,
    GhostTypes,
    generateNodeId,
}
