#!/bin/bash

npm-upgrade

mkdir ./compare

github="https://raw.githubusercontent.com"
repo="TryGhost/Casper"
branch="master"

wget -q -P compare -N ${github}/${repo}/${branch}/assets/css/global.css
wget -q -P compare -N ${github}/${repo}/${branch}/assets/css/screen.css

diff -q -s compare/global.css gatsby-theme-try-ghost/src/styles/global.css
diff -q -s compare/screen.css gatsby-theme-try-ghost/src/styles/screen.css

rm -rf compare
