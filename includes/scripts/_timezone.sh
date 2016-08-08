#!/bin/sh
echo "setTimeZone $1"
echo $1 > /etc/timezone && dpkg-reconfigure -f noninteractive tzdata
