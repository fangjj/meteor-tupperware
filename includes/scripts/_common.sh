#!/bin/sh

# Environment variables
export TUPPERBUILD_DIR="$BASEDIR/../tupperbuild"
export OUTPUT_DIR="/output"
export BUILD_DEPS="build-essential python"
export IMAGE_UTILS="git curl ca-certificates bzip2 apt-utils"

# Function for checking process return codes
check_code () {
  if [ ! "$1" -eq 0 ]; then
    echo "[!] Failure. Exiting..."
    exit 1
  fi
}
