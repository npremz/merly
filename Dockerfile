FROM node:25-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:25-alpine AS runtime

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

ENV HOST=0.0.0.0
ENV PORT=5103

EXPOSE 5103

CMD ["node", "dist/server/entry.mjs"]
