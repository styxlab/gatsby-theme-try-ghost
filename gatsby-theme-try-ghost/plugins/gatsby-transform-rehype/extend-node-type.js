const _ = require(`lodash`);

const Promise = require(`bluebird`);

const Rehype = require(`rehype`);

let pluginsCacheStr = ``;
let pathPrefixCacheStr = ``;

const htmlCacheKey = node => `transformer-remark-markdown-html-${node.internal.contentDigest}-${pluginsCacheStr}-${pathPrefixCacheStr}`;

const htmlAstCacheKey = node => `transformer-remark-markdown-html-ast-${node.internal.contentDigest}-${pluginsCacheStr}-${pathPrefixCacheStr}`; // TODO: remove this check with next major release


const safeGetCache = ({
  getCache,
  cache
}) => id => {
  if (!getCache) {
    return cache;
  }

  return getCache(id);
};

module.exports = ({
  type,
  basePath,
  getNode,
  getNodesByType,
  cache,
  getCache: possibleGetCache,
  reporter,
  ...rest
}, pluginOptions) => {
  const {
    type: nodeType
  } = _.merge({}, {
    type: `HtmlRehype`
  }, pluginOptions);

  if (type.name !== nodeType) {
    return {};
  }

  pluginsCacheStr = pluginOptions.plugins.map(p => p.name).join(``);
  pathPrefixCacheStr = basePath || ``;
  const getCache = safeGetCache({
    cache,
    getCache: possibleGetCache
  });
  return new Promise((resolve, reject) => {
    const rehypeOptions = ({
      fragment,
      space,
      emitParseErrors,
      verbose
    } = _.merge({}, {
      fragment: true,
      space: `html`,
      emitParseErrors: false,
      verbose: false
    }, pluginOptions)); // Setup rehype.


    let rehype = new Rehype().data(`settings`, rehypeOptions);

    for (let plugin of pluginOptions.plugins) {
      const requiredPlugin = require(plugin.resolve);

      if (_.isFunction(requiredPlugin.setParserPlugins)) {
        for (let parserPlugin of requiredPlugin.setParserPlugins(plugin.pluginOptions)) {
          if (_.isArray(parserPlugin)) {
            const [parser, options] = parserPlugin;
            rehype = rehype.use(parser, options);
          } else {
            rehype = rehype.use(parserPlugin);
          }
        }
      }
    }

    async function getAST(htmlNode) {
      // Use Bluebird's Promise function "each" to run rehype plugins serially.
      await Promise.each(pluginOptions.plugins, plugin => {
        const requiredPlugin = require(plugin.resolve);

        if (_.isFunction(requiredPlugin.mutateSource)) {
          return requiredPlugin.mutateSource({
            htmlNode,
            getNode,
            reporter,
            cache: getCache(plugin.name),
            getCache,
            compiler: {
              parseString: rehype.parse.bind(rehype),
              generateHTML: getHTML
            },
            ...rest
          }, plugin.pluginOptions);
        } else {
          return Promise.resolve();
        }
      });
      const htmlAst = rehype.parse(htmlNode.content);
      await Promise.each(pluginOptions.plugins, plugin => {
        const requiredPlugin = require(plugin.resolve); // Allow both exports = function(), and exports.default = function()


        const defaultFunction = _.isFunction(requiredPlugin) ? requiredPlugin : _.isFunction(requiredPlugin.default) ? requiredPlugin.default : undefined;

        if (defaultFunction) {
          return defaultFunction({
            htmlAst,
            htmlNode,
            getNode,
            basePath,
            reporter,
            cache: getCache(plugin.name),
            getCache,
            compiler: {
              parseString: rehype.parse.bind(rehype),
              generateHTML: null
            },
            ...rest
          }, plugin.pluginOptions);
        } else {
          return Promise.resolve();
        }
      });
      return htmlAst;
    }

    async function getHTMLAst(htmlNode) {
      const cachedAst = await cache.get(htmlAstCacheKey(htmlNode));

      if (cachedAst) {
        return cachedAst;
      } else {
        const htmlAst = await getAST(htmlNode); // Save new HTML AST to cache and return

        cache.set(htmlAstCacheKey(htmlNode), htmlAst);
        return htmlAst;
      }
    }

    async function getHTML(htmlNode) {
      const shouldCache = htmlNode;
      const cachedHTML = shouldCache && (await cache.get(htmlCacheKey(htmlNode)));

      if (cachedHTML) {
        return cachedHTML;
      } else {
        const htmlAst = await getAST(htmlNode);
        const html = rehype.stringify(htmlAst);

        if (shouldCache) {
          // Save new HTML to cache
          cache.set(htmlCacheKey(htmlNode), html);
        }

        return html;
      }
    }

    return resolve({
      html: {
        type: `String`,

        resolve(htmlNode) {
          return getHTML(htmlNode);
        }

      },
      htmlAst: {
        type: `JSON`,

        resolve(htmlNode) {
          return getHTMLAst(htmlNode).then(ast => {
            return ast;
          });
        }

      },
      htmlSource: {
        type: `String`,

        resolve(htmlNode) {
          return htmlNode.content;
        }

      }
    });
  });
};