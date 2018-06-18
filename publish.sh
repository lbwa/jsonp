#!/bin/sh

set -e

# 实现方法 1

read -p "请输入提交至 Git 仓库的提交描述信息：" message

git add .
git commit -m "$message"
git push origin master

read -p "升级版本号:
1. [patch] 修复了 BUG，并向下兼容
2. [minor] 添加了一些新功能，并向下兼容
3. [major] 进行了破坏性更新，不兼容之前的版本
请选择升级版本号的方式：" var

yarn run build
yarn run build:dev

# only works for yarn v1.7.0+
# It will also tag in git
# yarn version --patch

npm version $var

npm publish

git push --tag

# 实现方法 2

# verify parameter number
#　-ne means not equal
# if [ "$#" -ne "1" ]
# then
#   echo '请在双引号内输入更新版本的方式。yarn run publish "[--patch] [--minor] [--major]"'
#   # code 2 means wrong usage
#   exit 2
# else

# yarn run build
# yarn run build:dev

# # only works for yarn v1.7.0+
# # It will also tag in git
# yarn version $1

# yarn publish

# fi

echo ' -- Mission completed !! -- '
