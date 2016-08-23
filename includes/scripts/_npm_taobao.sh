#!/bin/sh
echo "npm taobao..."
npm config set registry https://registry.npm.taobao.org
check_code $?

npm config set disturl https://npm.taobao.org/dist
check_code $?

npm config get registry
check_code $?