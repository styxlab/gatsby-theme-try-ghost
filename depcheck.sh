#!/bin/bash

npm-upgrade


cd packages/gatsby-source-try-ghost
npm-upgrade

cd ../gatsby-plugin-ghost-images
npm-upgrade

cd ../gatsby-rehype-ghost-links
npm-upgrade

cd ../gatsby-rehype-inline-images
npm-upgrade

cd ../gatsby-rehype-prismjs
npm-upgrade

cd ../gatsby-theme-ghost-amp
npm-upgrade

cd ../gatsby-theme-ghost-commento
npm-upgrade

cd ../gatsby-theme-ghost-contact
npm-upgrade

cd ../gatsby-theme-ghost-dark-mode
npm-upgrade

cd ../gatsby-theme-ghost-members
npm-upgrade

cd ../gatsby-theme-ghost-toc
npm-upgrade

cd ../gatsby-transformer-rehype
npm-upgrade

cd ../gatsby-theme-try-ghost
npm-upgrade

cd ../../demo
npm-upgrade

cd ..
mkdir ./compare

github="https://raw.githubusercontent.com"
repo="TryGhost/Casper"
branch="master"

wget -q -P compare -N ${github}/${repo}/${branch}/assets/css/global.css
wget -q -P compare -N ${github}/${repo}/${branch}/assets/css/screen.css

diff -q -s compare/global.css packages/gatsby-theme-try-ghost/src/styles/global-original.css
diff -q -s compare/screen.css packages/gatsby-theme-try-ghost/src/styles/screen-original.css

rm -rf compare out
