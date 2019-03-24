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

resource "google_storage_bucket" "tf-states" {
  name          = "gcp-typescript-kata-tf-states"
  storage_class = "STANDARD"
  location      = "europe-west2"

  versioning {
    enabled = true
  }

  logging {
    log_bucket        = "${google_storage_bucket.infrastructure_logs.id}"
    log_object_prefix = "tf-state-logs/"
  }

  lifecycle_rule {
    action {
      type          = "SetStorageClass"
      storage_class = "NEARLINE"
    }

    condition {
      age     = "30"
      is_live = "false"
    }
  }
}

resource "google_storage_bucket" "infrastructure_logs" {
  name          = "gcp-typescript-kata-infrastructure-logs"
  storage_class = "STANDARD"
  location      = "${var.gcp_region}"

  lifecycle_rule {
    action {
      type          = "SetStorageClass"
      storage_class = "NEARLINE"
    }

    condition {
      age     = "30"
      is_live = "false"
    }
  }

  lifecycle_rule {
    action {
      type          = "SetStorageClass"
      storage_class = "COLDLINE"
    }

    condition {
      age     = "180"
      is_live = "false"
    }
  }
}
