#!/bin/sh
echo "npm taobao..."
npm config set registry https://registry.npm.taobao.org
npm config set disturl https://npm.taobao.org/dist
npm config get registry
