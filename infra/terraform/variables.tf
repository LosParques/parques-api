variable "aws_region" {
  description = "Región donde se desplegará la infraestructura"
  type        = string
  default     = "us-east-1"
}

variable "aws_profile" {
  description = "Perfil configurado en AWS CLI para autenticarse"
  type        = string
  default     = "parques"
}

variable "project_name" {
  description = "Nombre base del proyecto"
  type        = string
  default     = "parques-api"
}

variable "environment" {
  description = "Ambiente de despliegue (dev, staging, prod)"
  type        = string
  default     = "dev"
}
