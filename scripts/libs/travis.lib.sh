#!/usr/bin/env bash

##
# @file
# Transform Travis-specific environment variables to generic ones.
##

setenv() {
  export BUILD_NUMBER=$TRAVIS_BUILD_NUMBER
  export GIT_COMMIT=$TRAVIS_COMMIT
  export GIT_BRANCH=$TRAVIS_BRANCH
}
