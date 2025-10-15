terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Define la región y perfil de autenticación
provider "aws" {
  region  = var.aws_region
  profile = var.aws_profile  # Perfil configurado con AWS CLI
}
