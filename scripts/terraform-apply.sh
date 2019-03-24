#!/usr/bin/env bash
# vim: et sr sw=2 ts=2 smartindent:

. scripts/libs/terraform.lib.sh

(
  tf_setenv "$@"
  tf_docker_image_update
  tf_info "APPLY"
  tf_apply
)
