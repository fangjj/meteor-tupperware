#!/bin/sh
echo "[-] meteor setting....."
BASEDIR=`dirname $0`
. $BASEDIR/_common.sh
node $TUPPERBUILD_DIR/setting.js
