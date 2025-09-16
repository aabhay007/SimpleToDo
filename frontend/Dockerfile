# syntax=docker/dockerfile:1

# Build frontend (Vite + React)
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci --no-audit --no-fund

COPY . .

# Accept VITE_API_URL at build time and expose to Vite
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

# NGINX to serve static files
FROM nginx:1.27-alpine AS final
WORKDIR /usr/share/nginx/html

# Remove default content
RUN rm -rf ./*

COPY --from=build /app/dist ./

# Copy a minimal nginx config to support SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Use default nginx entrypoint/cmd


