#!/bin/sh

# Purge build deps
apt-get purge -y --force-yes $BUILD_DEPS
apt-get remove --purge -y --force-yes $BUILD_DEPS
check_code $?

# Autoremove any junk
apt-get clean -y --force-yes
apt-get autoclean -y --force-yes
apt-get autoremove -y --force-yes
check_code $?

# Remove apt lists
rm -rf /var/lib/apt/lists/*
check_code $?

# Locale cleanup
cp -R /usr/share/locale/en\@* /tmp/ && rm -rf /usr/share/locale/* && mv /tmp/en\@* /usr/share/locale/

# Clean out docs
rm -rf /usr/share/doc /usr/share/doc-base /usr/share/man /usr/share/locale /usr/share/zoneinfo /var/cache/debconf/*-old

# Clean out package management dirs
rm -rf /var/lib/cache /var/lib/log

# Clean out /tmp
rm -rf /tmp/*

# Clear npm cache
npm cache clear
