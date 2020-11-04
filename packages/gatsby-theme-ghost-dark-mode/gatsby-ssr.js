const React = require(`react`)

const preBodyComponents = [
    <script
        key={1}
        dangerouslySetInnerHTML={{
            __html: `
            (function(){
                window.isDark = JSON.parse(localStorage.getItem('dark'));
                if ( window.isDark ) {
                  document.body.classList.add('dark')
                } else if( window.isDark !== false && window.matchMedia('(prefers-color-scheme: dark)').matches === true ){
                  document.body.classList.add('dark')
                }
            })()
          `,
        }}
    />,
]

exports.onRenderBody = ({ setPreBodyComponents }) => {
    setPreBodyComponents(preBodyComponents)
}
