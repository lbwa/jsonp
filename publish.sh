#!/bin/sh

set -e

yarn run lint

read -p "升级版本号:
1. [patch] 修复了 BUG，并向下兼容
2. [minor] 添加了一些新功能，并向下兼容
3. [major] 进行了破坏性更新，不兼容之前的版本
请选择升级版本号的方式：" var

# https://yarnpkg.com/en/docs/cli/version#toc-git-tags
# disable the git tagging by yarn default behavior
# yarn config set version-git-tag true

yarn version --$var
yarn run build

# CURRENT_VERSION=`cat package.json | grep version | sed -E 's/[^.0-9]//g'`
CURRENT_VERSION=`node -p "require('./package.json').version"`

yarn publish --new-version $CURRENT_VERSION
yarn run commit

# To include the latest code, it must be invoked after commit
git tag v$CURRENT_VERSION
git push
git push origin --tags
echo ' <<<<<<<<<< Mission completed >>>>>>>>>> '

# more details:
# https://github.com/lbwa/lbwa.github.io/issues/17
