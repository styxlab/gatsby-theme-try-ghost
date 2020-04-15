#!/bin/bash

npm-upgrade

cd packages/gatsby-theme-try-ghost
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

diff -q -s compare/global.css packages/gatsby-theme-try-ghost/src/styles/global.css
diff -q -s compare/screen.css packages/gatsby-theme-try-ghost/src/styles/screen-casper.css

#rm -rf compare
