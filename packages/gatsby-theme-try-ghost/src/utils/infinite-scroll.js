const fs = require(`fs`)

/**
* Infinite Scroll
*
* Record all possible postIds that can be shown for each page (unpaginated).
* Infinite scroll will load more posts in the same order as given here.
* Uses pageContext to pass this information along.
*
* Each post is saved in a JSON file, so it can be fetched upon request.
*
*/

const infiniteScroll = (posts) => {
    const indexIds = []
    const tagIds = {}
    const authorIds = {}

    function saveInfiniteScrollPost(post) {
        const dir = `public/infiniteScroll/`
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir)
        }
        const id = post.id
        const filePath = `${dir}${id}.json`
        const dataToSave = JSON.stringify(post)
        fs.writeFile(filePath, dataToSave, err => err && console.log(err))
    }

    posts.forEach(({ node }) => {
        saveInfiniteScrollPost(node)
        indexIds.push(node.id)

        node.tags.map((tag) => {
            if (tagIds[tag.slug] === undefined) {
                tagIds[tag.slug] = []
            }
            tagIds[tag.slug].push(node.id)
        })

        node.authors.map((author) => {
            if (authorIds[author.slug] === undefined) {
                authorIds[author.slug] = []
            }
            authorIds[author.slug].push(node.id)
        })
    })

    return ({
        indexIds: indexIds,
        tagIds: tagIds,
        authorIds: authorIds,
    })
}

module.exports = infiniteScroll
