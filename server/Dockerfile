
# ============================================
# Stage 1: Build
# ============================================
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript application
RUN npm run build


# ============================================
# Stage 2: Production runtime
# ============================================
FROM node:22-alpine

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled application
COPY --from=builder /app/dist ./dist

# Copy required scripts
COPY --from=builder /app/scripts ./scripts

EXPOSE 5300

ENV PORT=5300

CMD ["node", "dist/server.js"]
