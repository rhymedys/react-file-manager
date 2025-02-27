#!/bin/bash

# 步骤零：安装依赖
pnpm install

# 步骤一：自动修改 package.json 的 version 版本号自动加1
current_version=$(node -p "require('./package.json').version")
IFS='.' read -r -a version_parts <<< "$current_version"
version_parts[2]=$((version_parts[2] + 1))
new_version="${version_parts[0]}.${version_parts[1]}.${version_parts[2]}"
jq ".version = \"$new_version\"" package.json > tmp.json && mv tmp.json package.json

# 步骤二：npm run build
npm run build

# 步骤三：nrm use npm
nrm use npm

# 步骤四：npm publish
npm publish