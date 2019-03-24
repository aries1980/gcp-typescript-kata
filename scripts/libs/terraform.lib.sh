#!/usr/bin/env bash
# vim: et sr sw=2 ts=2 smartindent:

. scripts/libs/common.lib.sh

set -x

terraform() {
  export __CONTAINER_NAME="${__CONTAINER_NAME:-terraform_$(date +'%Y%m%d%H%M%S')_$(unique_id)}"
  export __TAGGED_IMG="hashicorp/terraform:light"
  container_as_cmd "$@"
}

tf_docker_image_update() {
  docker pull $__TERRAFORM_IMAGE
}

tf_setenv() {
  required_vars "1 GCP_PROJECT_ID GCP_PROJECT_NUMBER"

  __TERRAFORM_IMAGE=${__TERRAFORM_IMAGE:-"hashicorp/terraform:light"}
  ENVIRONMENT=$1
  TF_VARS=$2
  HOST_WORKSPACE=${HOST_WORKSPACE:-$(pwd)}
  GCP_REGION=${GCP_REGION:-"europe-west1"}

  # This breaks the string out into command line args.
  COMMAND_LINE_TF_VARS=$(eval echo $TF_VARS)

  if [ "${GIT_BRANCH}" = "${MASTER_BRANCH}" ]; then
    export PACKAGE_VERSION=$(jq -r ".version" ./package.json)
    echo ">>> Master build ${PACKAGE_VERSION}"
  else
    PACKAGE_VERSION=$(pr_version_number)
    echo ">>> Non-master build ${PACKAGE_VERSION}"
  fi

  if [ -z $TF_ENV_DIR ]; then
    TF_ENV_DIR=$ENVIRONMENT
  fi

  export __DOCKER_OPTS="
    --network host \
    -v ${HOST_WORKSPACE}/gcp-travis-bot-service-account-auth.json:/root/service-bot.json \
    -v ${HOST_WORKSPACE}:/app \
    -w /app/infrastructure/${TF_ENV_DIR} \
    --env TF_VAR_environment=${ENVIRONMENT} \
    --env TF_VAR_gcp_region=${GCP_REGION} \
    --env TF_VAR_gcp_project_id=${GCP_PROJECT_ID} \
    --env TF_VAR_gcp_project_number=${GCP_PROJECT_NUMBER} \
    --env GOOGLE_CLOUD_KEYFILE_JSON=/root/service-bot.json \
    --env GOOGLE_APPLICATION_CREDENTIALS=/root/service-bot.json \
    --env TERRAFORM_VERSION=0.11.13
  "
}

tf_info() {
  echo "-----------------------------"
  echo "RUNNING TERRAFORM $1"
  echo "-----------------------------"

  echo ENVIRONMENT=$ENVIRONMENT
  echo TF_ENV_DIR=$TF_ENV_DIR
  echo TF_VARS=$TF_VARS
  echo COMMAND_LINE_TF_VARS=$COMMAND_LINE_TF_VARS
  echo PACKAGE_VERSION=$PACKAGE_VERSION
}

tf_select_workspace() {
  terraform workspace new $ENVIRONMENT
  terraform workspace select $ENVIRONMENT
}

tf_init() {
  terraform init -backend=true -input=false
}

tf_plan() {
  required_vars "TF_ENV_DIR"
  tf_init
  tf_select_workspace
  terraform plan \
    -out=tfplan -input=false \
    -var "environment=${ENVIRONMENT}" \
    -var "package_version=${PACKAGE_VERSION}" \
    ${COMMAND_LINE_TF_VARS}
}

tf_force_apply() {
  tf_init
  tf_select_workspace
  terraform apply \
    -auto-approve \
    -var "environment=${ENVIRONMENT}" \
    -var "package_version=${PACKAGE_VERSION}" \
    ${COMMAND_LINE_TF_VARS}
}

tf_apply() {
  required_vars "TF_ENV_DIR"
  terraform apply -lock=false -input=false tfplan
}

tf_destroy() {
  terraform destroy -var "package_version=${PACKAGE_VERSION}"
}
