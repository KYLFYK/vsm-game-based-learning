# syntax=docker/dockerfile:1

ARG NODE_VERSION=24
ARG NGINX_VERSION=1.29

FROM node:${NODE_VERSION}-alpine AS builder

# VITE_API_URL вшивается в бандл на этапе vite build
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
# Без URL бандл собрался бы и упал только в браузере пользователя —
# останавливаем сборку сразу (compose передаёт пустую строку, если его нет в .env)
RUN test -n "$VITE_API_URL" || { echo "VITE_API_URL не задан: передайте --build-arg или заполните .env" >&2; exit 1; }

WORKDIR /app

# Сначала манифесты: слой с зависимостями кешируется отдельно от исходников.
# Yarn запускается из закоммиченного релиза, без corepack и загрузки из сети.
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/releases ./.yarn/releases
RUN node .yarn/releases/yarn-4.18.0.cjs install --immutable

COPY . .
RUN node .yarn/releases/yarn-4.18.0.cjs build

# Образ без root: nginx слушает 8080, конфиг и статика доступны на чтение
FROM nginxinc/nginx-unprivileged:${NGINX_VERSION}-alpine AS runner

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080
