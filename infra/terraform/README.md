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

## IAM Roles y Policies (ECS Task Execution Role) 

### Objetivo
Definir los recursos de IAM necesarios para que Amazon ECS pueda ejecutar tareas (containers) utilizando imágenes del ECR y enviar logs a CloudWatch.
Este paso aplica el principio de **mínimo privilegio**, permitiendo solo las acciones estrictamente necesarias.

---

### Archivos involucrados
- **`iam.tf`** → Define el rol IAM, la política personalizada y la asociación entre ambos.
- **`outputs.tf`** → Exporta el ARN del rol creado (`ecs_task_execution_role_arn`).

---

### Código principal (`iam.tf`)
```hcl
# Rol que ECS usa para ejecutar tareas (Task Execution Role)
resource "aws_iam_role" "ecs_task_execution_role" {
  name = "${var.project_name}-ecs-task-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = { Service = "ecs-tasks.amazonaws.com" },
        Action    = "sts:AssumeRole"
      }
    ]
  })

  tags = {
    Name        = "${var.project_name}-ecs-task-execution-role"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# Política que permite acceso a ECR y CloudWatch Logs
resource "aws_iam_policy" "ecs_task_policy" {
  name        = "${var.project_name}-ecs-task-policy"
  description = "Permite que ECS Tasks usen ECR y envíen logs a CloudWatch"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        Resource = "*"
      }
    ]
  })
}

# Vincular política al rol
resource "aws_iam_role_policy_attachment" "ecs_task_policy_attach" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = aws_iam_policy.ecs_task_policy.arn
}
