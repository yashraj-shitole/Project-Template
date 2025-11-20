# build stage
FROM node:18-alpine as builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --no-audit --no-fund
COPY . .

# production stage
FROM node:18-alpine as production
WORKDIR /app
COPY --from=builder /app/package.json /app/package-lock.json* ./
RUN npm install --production --no-audit --no-fund
COPY --from=builder /app .
EXPOSE 3000
CMD ["node", "-r", "dotenv/config", "index.js"]
