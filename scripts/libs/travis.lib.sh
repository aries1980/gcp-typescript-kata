#!/usr/bin/env bash

##
# @file
# Transform Travis-specific environment variables to generic ones.
##

travis_setenv() {
  export BUILD_NUMBER=${TRAVIS_BUILD_NUMBER:-"1"}
  export GIT_COMMIT=${TRAVIS_COMMIT:-""}
  export GIT_BRANCH=${TRAVIS_BRANCH:-"master"}
  export GIT_PR_NUMBER=${TRAVIS_PULL_REQUEST:-"1"}
  export HOST_WORKSPACE=${TRAVIS_BUILD_DIR:-$(pwd)}
}
