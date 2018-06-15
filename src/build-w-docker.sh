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

rm -rf `pwd`/build && mkdir `pwd`/build
docker run --rm \
    -v /`pwd`:/work \
    -w /work \
    node:6.10.1 \
    /bin/sh -c "\
        yarn global add gulp \
        && yarn \
        && gulp build \
    "

## I cannot run gulp test because it requires chrome
