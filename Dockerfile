# STAGE 1: Builder
FROM node:lts-alpine as builder

# Directorio de trabajo
WORKDIR /app

# Copiar dependencias a root.
COPY package*.json ./

# Instalar dependencias del package.json
RUN npm ci

# Copiar el resto del código de la aplicación
COPY . .

# Stage 2: Production
FROM node:lts-alpine AS production

# Directorio de trabajo
WORKDIR /app

# Copia del builder los node_modules y package cuando se actualize el sistema.
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Expone el puerto 3000
EXPOSE 3000

# Define comando para correr la aplicacion.
CMD ["npm","start"]
