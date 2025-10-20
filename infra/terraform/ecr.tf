# ECR
# repositorio para el backend
resource "aws_ecr_repository" "backend_repo" {
  name                 = "${var.project_name}-backend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name        = "${var.project_name}-backend"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# repositorio para el frontend
resource "aws_ecr_repository" "frontend_repo" {
  name                 = "${var.project_name}-frontend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name        = "${var.project_name}-frontend"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

#outputs
output "ecr_backend_url" {
  description = "URL del repositorio ECR para el backend"
  value       = aws_ecr_repository.backend_repo.repository_url
}

output "ecr_frontend_url" {
  description = "URL del repositorio ECR para el frontend"
  value       = aws_ecr_repository.frontend_repo.repository_url
}
