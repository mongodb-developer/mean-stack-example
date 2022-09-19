FROM node:18-slim AS frontend-builder
WORKDIR /usr/src/app

COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build
RUN npm ci --omit=dev


FROM node:18-slim AS backend-builder
WORKDIR /usr/src/app

COPY server/package*.json ./
RUN npm ci
COPY server/ ./
RUN npm run build
RUN npm ci --omit=dev


#FROM gcr.io/distroless/nodejs:18
FROM node:18-slim
EXPOSE 8080
WORKDIR /usr/src/app

COPY --from=backend-builder /usr/src/app/dist/ ./
COPY --from=backend-builder /usr/src/app/node_modules ./node_modules
COPY --from=frontend-builder /usr/src/app/dist/client/ public/

CMD ["server.js"]
