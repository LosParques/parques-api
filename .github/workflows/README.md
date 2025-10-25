# CI/CD – Los Parques (Backend)

Este repo implementa **dos pipelines** en GitHub Actions:

- **CI** → `.github/workflows/ci.yml`
  Valida build/tests en cada cambio.
- **CD** → `.github/workflows/cd.yml`
  Construye la imagen Docker, la publica en registro y (con credenciales) despliega a **AWS (ECR + ECS)**.

> Estado actual: **CD** está en (`DRY_RUN: "true"`)**.
> Publica la imagen en **GHCR** y deja listo el despliegue a AWS para cuando se añadan credenciales.

---

## Estructura

.github/
└─ workflows/
├─ ci.yml
└─ cd.yml

---

## CI – `.github/workflows/ci.yml`

**Qué hace**
1. `actions/checkout` – Descarga el repo.
2. Instala dependencias (p. ej. `npm ci`).
3. Compila (p. ej. `npm run build`).
4. Ejecuta tests (p. ej. `npm test`).
5. (Opcional) Lint/Format.

**Cuándo corre**
- `on: push` / `on: pull_request` (según la configuración del workflow).

**Resultado esperado**
- Jobs **en verde** antes de mergear a `main`.
- Si falla build/tests, el PR no se integra.

---

## CD – `.github/workflows/cd.yml`

**Objetivo**
- Build de imagen Docker del backend.
- Publicación en registro:
  - **GHCR** (no requiere credenciales).
  - **Con credenciales:** **AWS ECR**.
- **Deploy** en ECS (cuando existan credenciales).

**Disparadores**
- `push` a `main`, `master`, `feature/SCRUM-13`.
- Manual via `workflow_dispatch` (Run workflow).

**Variables principales**
- `AWS_REGION` – Región de AWS (e.g. `us-east-1`).
- `ECR_REPOSITORY` – Repo ECR del backend.
- `ECS_CLUSTER` / `ECS_SERVICE` – Cluster/Service de ECS.
- `TASK_DEFINITION_PATH` – `infra/task-def-api.json`.
- `CONTAINER_NAME` – Nombre del contenedor en la task (e.g. `backend`).
- `IMAGE_TAG` – Tag de imagen (`${{ github.sha }}`).
- `DRY_RUN` – `"true"` = simula (solo GHCR) / `"false"` = despliega en AWS.

### Job 1: `build-and-publish-ghcr` (siempre)
- Calcula `GHCR_IMAGE` en minúsculas (requerido por GHCR).
- Login a GHCR con `GITHUB_TOKEN`.
- **Build** de la imagen (`Dockerfile`).
- **Push** a GHCR:
  `ghcr.io/<owner-lower>/parques-api-backend:<SHA>`

### Job 2: `deploy-aws` (solo si `DRY_RUN="false"` **y** hay credenciales)
- Toma credenciales de:
  - **OIDC** → `AWS_OIDC_ROLE_ARN` (recomendado), **o**
  - **Access Keys** → `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` (+ `AWS_SESSION_TOKEN` si aplica).
- `aws sts get-caller-identity` (diagnóstico).
- Login a **ECR**.
- **Build & Push** a **ECR** (`<SHA>` y `latest`).
- **Render task definition** con la imagen del commit.
- **Deploy a ECS** (`update-service`) y espera estado estable.

**Resultado esperado (con credenciales y `DRY_RUN: "false"`):**
- Imagen en **ECR** con tag `<SHA>` y `latest`.
- **ECS Service** con deployment nuevo; tareas **RUNNING**.
- **CloudWatch Logs** con arranque del contenedor.

---

## Activar despliegue a AWS (cuando haya credenciales)

1. En el repo → **Settings → Secrets and variables → Actions**
   Crea **uno** de estos:
   - **OIDC (recomendado)**
     `AWS_OIDC_ROLE_ARN = arn:aws:iam::<ACCOUNT_ID>:role/<rol-para-actions>`
   - **Access Keys (temporal)**
     `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`
     *(y `AWS_SESSION_TOKEN` si son credenciales temporales)*

2. Edita `.github/workflows/cd.yml`:
   ```diff
   - DRY_RUN: "true"
   + DRY_RUN: "false"
