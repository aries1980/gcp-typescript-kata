resource "google_storage_bucket" "gcp-typescript-kata-birthday" {
  name = "gcp-typescript-kata-birthday-store"
  storage_class = "STANDARD"
  location      = "${var.gcp_region}"
}

resource "google_cloudfunctions_function" "gcp-typescript-kata-birthday" {
  name                  = "gcp-typescript-kata-birthday"
  description           = "Stores and retreives user birthdays."
  available_memory_mb   = 128
  runtime               = "nodejs8"
  source_archive_bucket = "${var.gcs_bucket_function_store}"
  source_archive_object = "${var.package_version}-gcp-typescript-kata-birthday.zip"
  trigger_http          = true
  timeout               = 15
  entry_point           = "handler"
  labels = {
    my-label = "my-label-value"
  }

  environment_variables = {
    GCP_PROJECT_ID = "${var.gcp_project_id}"
    GCS_BUCKET_BIRTHDAY = "${google_storage_bucket.gcp-typescript-kata-birthday.name}"
    // Setting a version triggers a deployment.
    PACKAGE_VERSION = "${var.package_version}"
  }
}
