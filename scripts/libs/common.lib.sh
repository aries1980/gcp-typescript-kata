#!/usr/bin/env bash
# vim: et sr sw=2 ts=2 smartindent:

_check_var_defined() {
  local var_name="$1"
  local var_val="${!var_name}"
  if [[ -z $var_val ]]; then
    return 1
  fi
}

required_vars() {
  local rc=0
  local required_vars="$1"
  local this_var
  for this_var in $required_vars; do
    if ! _check_var_defined $this_var
    then
      echo "ERROR $0: \$$this_var must be set in env" >&2
      rc=1
    fi
  done

  return $rc
}

container_as_cmd() {
  cmd_args="$@"
  docker run --name ${__CONTAINER_NAME} --rm ${__DOCKER_OPTS} ${__TAGGED_IMG} $cmd_args
}

##
# Used to minimise race-conditions when you run cmd more than once in the same second.
##
unique_id() {
  echo $(( $(shuf -i 000001-999999 -n1) * $(shuf -i 000001-999999 -n1) ))
}

build_timer_start() {
  export __BUILD_STARTED=$(date +%s)
}

build_timer_finish() {
  export __BUILD_FINISHED=$(date +%s)
}

build_metrics_log() {
  local package_name=$1
  local payload='{
    "level": "info",
    "message": "Build metrics.",
    "type": "build-metrics",
    "data": {
      "package_name": "'$package_name'" ,
      "build_started": "'$__BUILD_STARTED'",
      "build_finished": "'$__BUILD_FINISHED'",
      "build_total_time": "'$(($__BUILD_FINISHED-$__BUILD_STARTED))'",
      "branch_name": "'${BRANCH_NAME}'",
      "build_number": "'${BUILD_NUMBER}'"
    }
  }'

  __logger "$payload"
}

##
# Generates a formatted log.
##
__logger() {
  local timestamp=$(date --iso-8601=seconds)
  local uuid="$(unique_id)"
  local request_id=$uuid
  local correlation_id=$uuid
  # Payload must include the loglevel and must be a valid JSON.
  local payload=$1

  echo "$timestamp $request_id $correlation_id $payload" | tr '\n' ' '
}

__date_unique_name() {
  echo "$(date +'%Y%m%d%H%M%S')_$(unique_id)"
}

