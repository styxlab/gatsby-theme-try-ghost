import { graphql, useStaticQuery } from "gatsby"
import lang from './lang'

const useLang = (locale) => {
    const data = useStaticQuery(graphql`
    {
        allGhostSettings {
            edges {
                node {
                    lang
                }
            }
        }
    }`)

    return lang[locale || data.allGhostSettings.edges[0].node.lang || `en`]
}

const get = text => (name) => {
    if (text[name] === undefined) {
        throw new Error(`Cannot find ${name} in lang file.`)
    }

    return text[name]
}

export { useLang, get }
