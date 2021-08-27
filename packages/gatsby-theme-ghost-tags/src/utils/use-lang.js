import { graphql, useStaticQuery } from "gatsby"
import lang from './lang'

const useLang = (locale) => {
    const data = useStaticQuery(graphql`
    {
        ghostSettings {
            lang
        }
    }`)

    return lang[locale || data.ghostSettings.lang || `en`]
}

const get = text => (name, fallback) => {
    if (text[name] === undefined && fallback === null) {
        throw new Error(`Cannot find ${name} in lang file.`)
    }

    if (text[name] === undefined) {
        return fallback
    }

    return text[name]
}

export { useLang, get }
