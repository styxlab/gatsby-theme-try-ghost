"use strict";

const _ = require(`lodash`);

const {
  createRemoteFileNode
} = require(`gatsby-source-filesystem`);

const ext = `_sharp`;
const pluginDefaults = {
  lookup: [],
  exclude: () => false,
  verbose: false,
  disable: false
};

exports.onCreateNode = async function ({
  node,
  actions,
  createNodeId,
  reporter,
  cache,
  store
}, pluginOptions) {
  const {
    createNode
  } = actions;

  const {
    lookup,
    exclude,
    verbose,
    disable
  } = _.merge({}, pluginDefaults, pluginOptions); // leave if node is excluded by user


  if (exclude(node) || disable) {
    return {};
  }

  const imgNode = lookup.filter(item => item.type === node.internal.type); // leave if node type does not match

  if (imgNode.length === 0) {
    return {};
  }

  const allImgTags = imgNode[0].imgTags.filter(item => node[item] !== null && node[item] !== undefined); // leave if image field is empty

  if (allImgTags.length === 0) {
    return {};
  } // remaining image fields


  const promises = allImgTags.map(tag => {
    const imgUrl = node[tag].replace(/^\/\//, `https://`);

    if (verbose) {
      reporter.info(`${node.internal.type}/${tag}/${node.slug}/${imgUrl}`);
    }

    return createRemoteFileNode({
      url: imgUrl,
      parentNodeId: node.id,
      createNode,
      createNodeId,
      cache,
      store
    });
  });
  let fileNodes;

  try {
    fileNodes = await Promise.all(promises);
  } catch (err) {
    reporter.panicOnBuild(`Error processing images ${node.absolutePath ? `file ${node.absolutePath}` : `in node ${node.id}`}:\n ${err}`);
    return {};
  } // foreign-key linking


  fileNodes.map((fileNode, i) => {
    const id = `${_.camelCase(`${allImgTags[i]}${ext}`)}___NODE`;
    node[id] = fileNode.id;
  });
  return {};
};