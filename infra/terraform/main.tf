terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Proveedor AWS: cuenta/región se trabajará
provider "aws" {
  region  = var.aws_region
  profile = var.aws_profile      # perfil configurado con AWS CLI
}
