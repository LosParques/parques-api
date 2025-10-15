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
