#!/bin/sh
echo "setTimeZone $1"
sudo echo $1 > /etc/timezone && sudo dpkg-reconfigure -f noninteractive tzdata
check_code $?
