/**
* Paginate Pages
*
* Note: awesome-pagination plugin inhibits incremental builds.
*
*/

const paginate = ({
    createPage,
    totalItems = 0,
    itemsPerPage,
    component,
    pathPrefix,
    context,
}) => {
    const numberOfPages = Math.ceil(totalItems / itemsPerPage)

    const pagePath = (page) => {
        const path = pathPrefix({ pageNumber: page - 1 })
        return page === 1 ? path : `${path}/${page}/`
    }

    Array.from({ length: numberOfPages }).forEach((__, pageNumber) => {
        const currentPage = pageNumber + 1

        const prevPageNumber = currentPage <= 1 ? null : currentPage - 1
        const nextPageNumber = currentPage + 1 > numberOfPages ? null : currentPage + 1

        const previousPagePath = prevPageNumber ? pagePath(prevPageNumber) : null
        const nextPagePath = nextPageNumber ? pagePath(nextPageNumber) : null

        createPage({
            path: pagePath(currentPage),
            component: component,
            context: {
                pageNumber: pageNumber,
                limit: itemsPerPage,
                skip: pageNumber * itemsPerPage,
                totalPosts: totalItems,
                numberOfPages: numberOfPages,
                humanPageNumber: currentPage,
                prevPageNumber: prevPageNumber,
                nextPageNumber: nextPageNumber,
                previousPagePath: previousPagePath,
                nextPagePath: nextPagePath,
                ...context,
            },
        })
    })
}

module.exports = paginate
