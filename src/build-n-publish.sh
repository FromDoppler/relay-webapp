#!/bin/sh

pkgName="relay-webapp"
pkgVersion=${1:-"v0.0.0-build0"}
cdnBaseUrl=${2:-"//cdn.fromdoppler.com/$pkgName"}
cdnUrl="$cdnBaseUrl/$pkgVersion"

# Exit immediately if a command exits with a non-zero status.
set -e

# Lines added to get the script running in the script path shell context
# reference: http://www.ostricher.com/2014/10/the-right-way-to-get-the-directory-of-a-bash-script/
cd $(dirname $0)

# To avoid issues with MINGW and Git Bash, see:
# https://github.com/docker/toolbox/issues/673
# https://gist.github.com/borekb/cb1536a3685ca6fc0ad9a028e6a959e3
export MSYS_NO_PATHCONV=1
export MSYS2_ARG_CONV_EXCL="*"

./build-w-docker.sh $pkgVersion $cdnBaseUrl

# Force pull the latest image version due to the cache not always is pruned immediately after an update is uploaded to docker hub
docker pull dopplerrelay/doppler-relay-akamai-publish

docker run --rm \
    -e AKAMAI_CDN_HOSTNAME \
    -e AKAMAI_CDN_USERNAME \
    -e AKAMAI_CDN_PASSWORD \
    -e AKAMAI_CDN_CPCODE \
    -e "PROJECT_NAME=$pkgName" \
    -e "VERSION_NAME=$pkgVersion" \
    -v /`pwd`/build:/source \
    dopplerrelay/doppler-relay-akamai-publish
