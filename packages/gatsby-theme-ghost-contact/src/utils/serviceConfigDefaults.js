const encodeURL = data => (
    Object.keys(data)
        .map(key => encodeURIComponent(key) + `=` + encodeURIComponent(data[key]))
        .join(`&`)
)

module.exports = {

    url: `/`,

    contentType: `application/x-www-form-urlencoded`,

    encodeFormData: data => encodeURL(data),

}
