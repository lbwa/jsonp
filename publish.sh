#!/bin/bash

set -e

yarn run lint
yarn run test

# recommend Semantic Versioning 2.0.0 , https://semver.org/
read -p "Upgrade version:
1. [patch] when you make backwards-compatible bug fixes.
2. [minor] when you add functionality in a backwards-compatible manner.
3. [major] when you make incompatible API changes.
Your choice：" var

# upgrade package
# https://yarnpkg.com/en/docs/cli/version#toc-git-tags
# disable the git tagging by yarn default behavior
# yarn config set version-git-tag true

yarn version --$var
yarn run build

# publish package
# CURRENT_VERSION=`cat package.json | grep version | sed -E 's/[^.0-9]//g'`
CURRENT_VERSION=`node -p "require('./package.json').version"`
yarn publish --new-version $CURRENT_VERSION

# make sure the latest code has been included in the latest commit before git tagging
yarn run commit
git push

# git tagging must be invoked after new commit
git tag v$CURRENT_VERSION
git push origin --tags

# generate and commit CHANGELOG which is based on tags log and commit log
yarn run changelog
yarn run commit
git push

echo ' ============ Mission completed ============ '

# more details:
# https://github.com/lbwa/lbwa.github.io/issues/17
