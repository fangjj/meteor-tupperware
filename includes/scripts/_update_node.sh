#!/bin/sh
NODE_VERSION=v$1
echo "update node $NODE_VERSION"
npm install -g n
n $NODE_VERSION
