# Utiliza NPM
FROM node:lts-alpine

# Directorio de trabajo
WORKDIR /app

# Copiar dependencias a root.
COPY package.json package-lock.json ./

# Instalar dependencias del package.json
RUN npm install

# Copiar el resto del código de la aplicación
COPY . .

# Expone el puerto 3000
EXPOSE 3000

# Define comando para correr la aplicacion.
CMD ["npm","start"]
