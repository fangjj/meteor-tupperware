#!/bin/sh
echo "[-] meteor setting....."
BASEDIR=`dirname $0`
. $BASEDIR/_common.sh
exec node $TUPPERBUILD_DIR/setting.js
