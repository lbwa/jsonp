#!/bin/sh

set -e

yarn run lint

read -p "升级版本号:
1. [patch] 修复了 BUG，并向下兼容
2. [minor] 添加了一些新功能，并向下兼容
3. [major] 进行了破坏性更新，不兼容之前的版本
请选择升级版本号的方式：" var

# only works for yarn v1.7.0+
# It will run `git tag -a v1.0.0 -m 'info'` at same time
yarn version --$var

yarn run build

# CURRENT_VERSION=`cat package.json | grep version | sed -E 's/[^.0-9]//g'`
CURRENT_VERSION=`node -p "require('./package.json').version"`

yarn publish --new-version $CURRENT_VERSION

yarn run commit

git push --tag

echo ' <<<<<<<<<< Mission completed >>>>>>>>>> '
