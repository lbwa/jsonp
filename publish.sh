#!/bin/sh

set -e

read -p "升级版本号:
1. [patch] 修复了 BUG，并向下兼容
2. [minor] 添加了一些新功能，并向下兼容
3. [major] 进行了破坏性更新，不兼容之前的版本
请选择升级版本号的方式：" var

yarn run build

# only works for yarn v1.7.0+
# It will run `git tag -a v1.0.0 -m 'info'` at same time
yarn version --$var

# CURRENT_VERSION=`cat package.json | grep version | sed -E 's/[^.0-9]//g'`
CURRENT_VERSION=`node -p "require('./package.json').version"`

yarn publish --new-version $CURRENT_VERSION

git push --tag

yarn run commit

# read -p "请输入提交至 Git 仓库的 commit 描述信息：" message

# if [ ! -n "$message" ]
# then
#   echo "请输入正确的 commit 描述信息！"
#   exit 2
# fi

# git add .
# git commit -m "$message"
# git push origin master

echo ' <<<<<<<<<< Mission completed >>>>>>>>>> '
