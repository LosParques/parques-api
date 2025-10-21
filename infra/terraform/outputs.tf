#ECR
output "ecr_backend_url" {
  description = "URL del repositorio ECR para el backend"
  value       = aws_ecr_repository.backend_repo.repository_url
}

output "ecr_frontend_url" {
  description = "URL del repositorio ECR para el frontend"
  value       = aws_ecr_repository.frontend_repo.repository_url
}


# IAM
output "ecs_task_execution_role_arn" {
  description = "ARN del rol IAM que ECS Tasks utilizarán"
  value       = aws_iam_role.ecs_task_execution_role.arn
}


# ECS
output "ecs_cluster_name" {
  description = "Nombre del cluster ECS creado"
  value       = aws_ecs_cluster.parques_cluster.name
}

output "ecs_task_definition_arn" {
  description = "ARN de la definición de tarea del backend"
  value       = aws_ecs_task_definition.backend_task.arn
}
