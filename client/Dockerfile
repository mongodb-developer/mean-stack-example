# ============================================
# Stage 1: Build Angular application
# ============================================
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy application source
COPY . .

# Production build
RUN npm run build -- --configuration production


# ============================================
# Stage 2: Serve with NGINX
# ============================================
FROM nginx:alpine

# Copy Angular production build
COPY --from=builder /app/dist/client/browser/. /usr/share/nginx/html

RUN mv /usr/share/nginx/html/index.csr.html /usr/share/nginx/html/index.html

# Custom NGINX configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
