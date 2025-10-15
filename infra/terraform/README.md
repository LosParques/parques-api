
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
