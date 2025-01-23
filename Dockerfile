# Etapa 1: Construcción de la aplicación Angular
FROM node:18-alpine AS build-step

# Crear y establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración e instalar dependencias
COPY package.json package-lock.json ./
RUN npm install

# Copiar todo el código de la aplicación y construir la aplicación Angular
COPY . .
RUN npm run build --prod

# Etapa 2: Servir la aplicación con Nginx
FROM nginx:1.23.3-alpine

# Copiar los archivos construidos desde la etapa anterior a la carpeta de Nginx
COPY --from=build-step /app/dist/tienda/browser /usr/share/nginx/html

# Exponer el puerto 80 y correr Nginx en modo foreground


