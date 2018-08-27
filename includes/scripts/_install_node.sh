#!/bin/sh

NODE_DIST=node-v${NODE_VERSION}-linux-x64

echo "[-] Installing Node.js... $NODE_DIST"

cd /tmp

curl -SLO "http://nodejs.org/dist/v$NODE_VERSION/$NODE_DIST.tar.gz"
check_code $?

tar -xzf "$NODE_DIST.tar.gz" -C /usr/local --strip-components=1
check_code $?

rm "$NODE_DIST.tar.gz"
check_code $?
