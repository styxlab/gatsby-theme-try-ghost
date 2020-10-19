const {
    GhostIdPrefix,
    PrefixedGhostTypes,
} = require(`./ghost-nodes`)

module.exports = ({ createResolvers }) => {
    const resolvers = {
        GhostPost: {
            primary_author: {
                resolve: (source, args, context) => (
                    context.nodeModel.getNodeById({
                        id: `${GhostIdPrefix.author}${source.primary_author && source.primary_author.id}`,
                        type: PrefixedGhostTypes.author,
                    })
                ),
            },
            primary_tag: {
                resolve: (source, args, context) => (
                    context.nodeModel.getNodeById({
                        id: `${GhostIdPrefix.tag}${source.primary_tag && source.primary_tag.id}`,
                        type: PrefixedGhostTypes.tag,
                    })
                ),
            },
            authors: {
                resolve: (source, args, context) => (
                    source.authors
                        .filter(postAuthor => context.nodeModel.getAllNodes({ type: PrefixedGhostTypes.author })
                            .find(author => author.id === `${GhostIdPrefix.author}${postAuthor.id}`) !== undefined
                        )
                ),
            },
            tags: {
                resolve: (source, args, context) => (
                    source.tags
                        .filter(postTag => context.nodeModel.getAllNodes({ type: PrefixedGhostTypes.tag })
                            .find(tag => tag.id === `${GhostIdPrefix.tag}${postTag.id}`) !== undefined
                        )
                ),
            },
        },
        GhostPage: {
            primary_author: {
                resolve: (source, args, context) => (
                    context.nodeModel.getNodeById({
                        id: `${GhostIdPrefix.author}${source.primary_author && source.primary_author.id}`,
                        type: PrefixedGhostTypes.author,
                    })
                ),
            },
            primary_tag: {
                resolve: (source, args, context) => (
                    context.nodeModel.getNodeById({
                        id: `${GhostIdPrefix.tag}${source.primary_tag && source.primary_tag.id}`,
                        type: PrefixedGhostTypes.tag,
                    })
                ),
            },
            authors: {
                resolve: (source, args, context) => (
                    source.authors
                        .filter(postAuthor => context.nodeModel.getAllNodes({ type: PrefixedGhostTypes.author })
                            .find(author => author.id === `${GhostIdPrefix.author}${postAuthor.id}`) !== undefined
                        )
                ),
            },
            tags: {
                resolve: (source, args, context) => (
                    source.tags
                        .filter(postTag => context.nodeModel.getAllNodes({ type: PrefixedGhostTypes.tag })
                            .find(tag => tag.id === `${GhostIdPrefix.tag}${postTag.id}`) !== undefined
                        )
                ),
            },
        },
    }
    createResolvers(resolvers)
}
