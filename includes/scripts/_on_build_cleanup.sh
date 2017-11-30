#!/bin/sh
NODE8=$1

find /app -maxdepth 1 -name "settings*.json" | xargs -i mv {} /

rm -rf /app

rm -rf ~/.meteor 

rm /usr/local/bin/meteor 

# Autoremove any junk
apt-get clean -y
apt-get autoclean -y
apt-get autoremove -y
check_code $?

# Remove apt lists
rm -rf /var/lib/apt/lists/*

# Locale cleanup
cp -R /usr/share/locale/en\@* /tmp/ && rm -rf /usr/share/locale/* && mv /tmp/en\@* /usr/share/locale/

# Clean out docs
rm -rf /usr/share/doc /usr/share/doc-base /usr/share/man /usr/share/locale /usr/share/zoneinfo /var/cache/debconf/*-old

# Clean out package management dirs
rm -rf /var/lib/cache /var/lib/log

# Clean out /tmp
rm -rf /tmp/*

# Clear npm cache
if [ $NODE8 = "1" ] ; then
  npm cache verify
else
  npm cache clear
fi
