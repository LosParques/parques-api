#SIRVE DE MUESTRA EN LO QUE SE CREAN LOS RECURSOS
# Muestra la región de AWS utilizada
output "aws_region" {
  description = "Región configurada en Terraform"
  value       = var.aws_region
}

# Muestra el perfil de AWS CLI que está usando Terraform
output "aws_profile" {
  description = "Perfil configurado para la autenticación con AWS CLI"
  value       = var.aws_profile
}

# Mensaje de confirmación
output "init_status" {
  description = "Confirmación de que la infraestructura base se inicializó correctamente"
  value       = "Terraform base configurado exitosamente ✅"
}
