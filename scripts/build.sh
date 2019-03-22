#!/usr/bin/env bash

. scripts/libs/travis.lib.sh
. scripts/libs/common.lib.sh

set -x

setenv() {
  travis_setenv
  export PACKAGE_NAME=gcp-typescript-kata-birthday
  required_vars "1 GCP_PROJECT_ID GCP_PROJECT_NUMBER"
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
    --env PROJECT_VERSION \
    -v "${HOST_WORKSPACE}:/code" \
    -w /code \
    node:8.10-slim \
      bash -x -e -c \
      "npm install && \
      npm run test && \
      npm run build \
    "

  zip -rj ./gcp-typescript-kata-birthday.zip ./dist/*

  # TODO: Create a shell function for GSutil as it happened for Terraform.
  docker run \
    --rm \
    -v ${HOST_WORKSPACE}/gcp-travis-bot-service-account-auth.json:/root/service-bot.json \
    --env PACKAGE_VERSION \
    --env GCP_REGION \
    --env GCP_PROJECT_ID \
    --env GCP_PROJECT_NUMBER \
    -v "${HOST_WORKSPACE}:/code" \
    -w /code \
    google/cloud-sdk \
      bash -x -e -c \
      "gcloud auth activate-service-account --key-file /root/service-bot.json && \
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
