## Despliegue de Recursos AWS – ECR (Elastic Container Registry)

### Objetivo
Implementar los repositorios privados de Amazon ECR para almacenar las imágenes Docker del proyecto **parques-api** (backend y frontend) utilizando Terraform.
Este paso forma parte del despliegue de infraestructura AWS (tarea Jira: *SCRUM-12 – Recursos AWS*).

---

### Archivos modificados / creados
- **`ecr.tf`** → Define los recursos `aws_ecr_repository` para los repositorios backend y frontend.
- **`variables.tf`** → Se agregaron las variables `project_name` y `environment` necesarias para construir los nombres dinámicos de los repositorios.

---

### Configuración de variables
```hcl
variable "project_name" {
  description = "Nombre base del proyecto (usado para nombrar recursos)"
  type        = string
  default     = "parques-api"
}

variable "environment" {
  description = "Ambiente de despliegue (por ejemplo: dev, staging, prod)"
  type        = string
  default     = "dev"
}

