variable "gcp_project_id" {
  description = "Google Cloud Platform Project ID."
}

variable "gcp_region" {
  description = "GCP default region."
}

variable "gcs_bucket_function_store" {
  description = "The GCS bucket name that contains the Google Cloud function code."
  default = "gcp-typescript-kata-function-storage"
}

variable "default_tags" {
  description = "(Optional) A map of additional tags to associate with the resource."
  type        = "map"

  default = {
    ServiceOwner = "Janos Feher"
  }
}

variable "environment" {
  description = "(Required) The name of the environment being deployed to."
}

variable "package_version" {
  description = "(Required) The version of the package."
}
