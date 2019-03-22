#!/usr/bin/env bash

. scripts/common.lib.sh

set -x

setenv() {
  export PACKAGE_NAME=gcp-typescript-kata-birthday
}

build() {
  if [ "${GIT_BRANCH}" = "${MASTER_BRANCH}" ]; then
    export PACKAGE_VERSION=$(jq -r ".version" ./package.json)
    echo ">>> Master build ${PACKAGE_VERSION}"
  else
    PACKAGE_VERSION=$(pr_version_number)
    echo ">>> Non-master build ${PACKAGE_VERSION}"
  fi

  # TODO: Create a shell function for NPM as it happened for Terraform.
  docker run \
    --rm \
    -v "${HOST_WORKSPACE}:/code" \
    -w /code \
    node:8.10-alpine \
      bash -x -e -c \
      "npm install && \
      npm run test && \
      npm run build \
    "

  zip -rj ./gcp-typescript-kata-birthday.zip ./dist/*

  # TODO: Create a shell function for GSutil as it happened for Terraform.
  docker run \
    --rm \
    -e PACKAGE_VERSION \
    -v "${HOST_WORKSPACE}:/code" \
    -w /code \
    google/cloud-sdk:alpine \
      bash -x -e -c \
      "gcloud auth activate-service-account --key-file /root/${HOME}/gcp-key.json && \
      gsutil cp gcp-typescript-kata-birthday.zip gs://gcp-typescript-kata-function-storage/$PACKAGE_VERSION \
    "
}

(
  build_timer_start
  setenv
  build
  build_timer_finish
  build_metrics_log gcp-typescript-kata-birthday
)
