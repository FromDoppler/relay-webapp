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

rm -rf `pwd`/build && mkdir `pwd`/build
docker run --rm \
    -v /`pwd`:/work \
    -w /work \
    --user 0 \
    circleci/node:6-browsers \
    /bin/sh -c "\
        yarn global add gulp \
        && yarn \
        && yarn run build \
        && yarn run test \
    "

## I cannot run gulp test because it requires chrome
