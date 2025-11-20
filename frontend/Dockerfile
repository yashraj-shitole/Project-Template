FROM node:20.19-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
# Install all dependencies (including devDependencies) so the Angular CLI is available
# Use `npm install` to avoid lockfile mismatch errors during the Docker build
RUN npm install --no-audit --no-fund
COPY . .
# build production files
RUN npm run build -- --configuration production

FROM nginx:stable-alpine
COPY --from=builder /app/dist/frontend /usr/share/nginx/html
# Copy custom nginx config (overrides default)
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
