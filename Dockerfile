# 1단계: 빌드 스테이지
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2단계: 실행 스테이지 (불필요한 devDependencies 제거)
FROM node:20
WORKDIR /app
COPY --from=builder /app /app
RUN npm install --omit=dev
CMD ["npm", "run", "start:prod"]
