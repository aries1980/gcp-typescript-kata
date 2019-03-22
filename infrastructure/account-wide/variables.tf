# vim: et sr sw=2 ts=2 smartindent:

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
