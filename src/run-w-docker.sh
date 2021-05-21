#!/bin/sh

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

docker run --rm \
    -v /`pwd`:/work \
    -p 3000:3000 \
    -p 35729:35729 \
    -w /work \
    node:6.10.1 \
    /bin/sh -c "\
        yarn global add gulp \
        && yarn \
        && yarn run start \
    "
