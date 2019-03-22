# vim: et sr sw=2 ts=2 smartindent:

provider "google" {
  project = "${var.gcp_project_id}"
  region  = "${var.gcp_region}"
}

terraform {
  backend "gcs" {
    bucket = "gcp-typescript-kata-tf-states"
    project = "kata-app"
    prefix = "kata-app"
    region  = "europe-west2"
  }
}
module "shared" {
  source          = "../shared"
  gcp_project_id  = "${var.gcp_project_id}"
  gcp_region    = "${var.gcp_region}"
  gcs_bucket_function_store = "${var.gcs_bucket_function_store}"
  environment     = "${var.environment}"
  package_version = "${var.package_version}"
}
