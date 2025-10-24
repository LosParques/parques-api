## Configuración realizada

### 1. Proveedor AWS
- Se definió el proveedor `hashicorp/aws` con versión `~> 5.0`.
- Se configuró la autenticación mediante perfil local (`parques`) usando AWS CLI.

### 2. Archivos base
- **main.tf:** define el proveedor y versión de Terraform.
- **variables.tf:** contiene variables `aws_region` y `aws_profile`.
- **outputs.tf:** muestra la configuración aplicada y un mensaje de confirmación.

### 3. Credenciales
- Se creó el usuario **IAM** `terraform-user` con permisos:
  - `AmazonEC2FullAccess`
  - `AmazonS3FullAccess`
  - `AmazonVPCFullAccess`
- Se generaron **Access Keys** y se configuró el perfil local:
  ```bash
  aws configure --profile parques
## Despliegue de Recursos AWS – ECR (Elastic Container Registry)

### Objetivo
Implementar los repositorios privados de Amazon ECR para almacenar las imágenes Docker del proyecto parques-api (backend y frontend) utilizando Terraform.
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
Este paso aplica el principio de mínimo privilegio, permitiendo solo las acciones estrictamente necesarias.

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

## Amazon ECS (Cluster y Definición de Tareas)

### Objetivo
Implementar un Cluster ECS con una definición de tarea (Task Definition) que orqueste la ejecución del contenedor backend usando la imagen almacenada en Amazon ECR.
Esta configuración forma la base para desplegar el servicio de la aplicación con Fargate.

---

### Archivos involucrados
- **`ecs.tf`** → Define el cluster ECS y la task definition del backend.
- **`outputs.tf`** → Exporta el nombre del cluster y el ARN de la task definition.

---

### Código principal (`ecs.tf`)
```hcl
# Cluster principal para ECS
resource "aws_ecs_cluster" "parques_cluster" {
  name = "${var.project_name}-ecs-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Name        = "${var.project_name}-ecs-cluster"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# Definición de tarea (backend)
resource "aws_ecs_task_definition" "backend_task" {
  family                   = "${var.project_name}-backend"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name      = "backend"
      image     = "${aws_ecr_repository.backend_repo.repository_url}:latest"
      essential = true
      portMappings = [
        {
          containerPort = 8080
          hostPort      = 8080
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = "/ecs/${var.project_name}-backend"
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "ecs"
        }
      }
    }
  ])
}
