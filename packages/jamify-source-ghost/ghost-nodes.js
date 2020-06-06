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

const GhostNodes = {
    post: PostNode,
    page: PageNode,
    tag: TagNode,
    author: AuthorNode,
    settings: SettingsNode,
}

const GhostTypes = {
    post: POST,
    page: PAGE,
    tag: TAG,
    author: AUTHOR,
    settings: SETTINGS,
}

const PrefixedGhostTypes = {
    post: `${PREFIX}${POST}`,
    page: `${PREFIX}${PAGE}`,
    tag: `${PREFIX}${TAG}`,
    author: `${PREFIX}${AUTHOR}`,
    settings: `${PREFIX}${SETTINGS}`,
}

module.exports = {
    GhostNodes,
    GhostTypes,
    PrefixedGhostTypes,
    generateNodeId,
}
