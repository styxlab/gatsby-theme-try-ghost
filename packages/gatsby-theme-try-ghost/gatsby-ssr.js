const React = require(`react`)

const HtmlAttributes = {
    'data-support': `no-js`,
}
const preBodyComponents = [
    <script
        key={1}
        dangerouslySetInnerHTML={{
            __html: `
            document.documentElement.dataset.support = 'js';
          `,
        }}
    />,
]

exports.onRenderBody = ({ setHtmlAttributes, setPreBodyComponents }) => {
    setHtmlAttributes(HtmlAttributes)
    setPreBodyComponents(preBodyComponents)
}
