#!/bin/sh

echo "[-] Performing image cleanup..."

# Purge packages
apt-get purge -y --force-yes `apt-mark showauto`
apt-get remove --purge -y --force-yes `apt-mark showauto`
check_code $?

# Autoremove any junk
apt-get clean -y --force-yes
apt-get autoclean -y --force-yes
apt-get autoremove -y --force-yes
check_code $?
