import React from 'react';
import PropTypes from 'prop-types';

export default function HTML(props) {
  return (
    <html data-support="no-js" {...props.htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        {props.headComponents}
      </head>
      <body className="fade-in" {...props.bodyAttributes}>
        <script
        dangerouslySetInnerHTML={{
          __html: `
            (function(){
                window.isDark = JSON.parse(localStorage.getItem('dark'));
                document.documentElement.dataset.support = 'js';
                if ( window.isDark ) {
                  document.body.classList.add('dark')
                } else if( window.isDark !== false && window.matchMedia('(prefers-color-scheme: dark)').matches === true ){
                  document.body.classList.add('dark')
                }
            })()
          `,
          }}
        />
        {props.preBodyComponents}
        <div
          key={`body`}
          id="___gatsby"
          dangerouslySetInnerHTML={{ __html: props.body }}
        />
        {props.postBodyComponents}
      </body>
    </html>
  );
}

HTML.propTypes = {
  htmlAttributes: PropTypes.object,
  headComponents: PropTypes.array,
  bodyAttributes: PropTypes.object,
  preBodyComponents: PropTypes.array,
  body: PropTypes.string,
  postBodyComponents: PropTypes.array,
};
