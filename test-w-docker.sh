#!/bin/sh

pkgName="relay-webapp"
pkgVersion=${1:-"v0.0.0-build0"}

# Exit immediately if a command exits with a non-zero status.
set -e

# Lines added to get the script running in the script path shell context
# reference: http://www.ostricher.com/2014/10/the-right-way-to-get-the-directory-of-a-bash-script/
cd "$(dirname "$0")"

# To avoid issues with MINGW and Git Bash, see:
# https://github.com/docker/toolbox/issues/673
# https://gist.github.com/borekb/cb1536a3685ca6fc0ad9a028e6a959e3
export MSYS_NO_PATHCONV=1
export MSYS2_ARG_CONV_EXCL="*"

R=$(awk 'BEGIN { srand(); print int(rand()*32768) }')
tag="${pkgName}-${pkgVersion}-${R}"

# Run tests (it does not work during docker build)
docker build --target build --build-arg environment="${ENVIRONMENT}" --tag "${tag}-for-test" .
docker run --rm "${tag}-for-test" sh -c "yarn run test"

## I cannot run gulp test because it requires chrome
