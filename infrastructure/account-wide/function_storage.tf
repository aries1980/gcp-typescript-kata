resource "google_storage_bucket" "function-storage" {
  name          = "gcp-typescript-kata-function-storage"
  storage_class = "STANDARD"
  location      = "${var.gcp_region}"
}
