# Деплой

Деплой пока не автоматизирован: CI собирает и проверяет код, ставит
версию и тег ([ci.md](ci.md)). Здесь — как запускается артефакт и что
добавить для прода.

## Артефакт

Приложение — статика в Docker-образе с nginx ([architecture.md](architecture.md#docker)).
Образ собирается из репозитория:

```bash
cp .env.example .env            # CLIENT_PORT, VITE_API_URL
docker compose up --build -d    # http://localhost:${CLIENT_PORT}
docker compose logs -f client
docker compose down
```

`VITE_API_URL` вшивается в бандл при сборке: для другого API нужен
`docker compose build`. На проде обычно относительный `/api/`: фронт и API
на одном домене, маршрутизирует reverse-proxy.

Проверка живости: `GET /health` → `200 ok`.

## Reverse-proxy

Контейнер слушает только HTTP на 8080 и не знает про TLS. Перед ним ставится
reverse-proxy хоста (Caddy, nginx, Traefik): домен → `CLIENT_PORT`, при
общем домене `/api*` → сервер API без переписывания пути. Пример `Caddyfile`:

```
example.com {
    handle /api* {
        reverse_proxy 127.0.0.1:5000
    }
    handle {
        reverse_proxy 127.0.0.1:3000
    }
}
```

Порты compose на проде лучше привязать к loopback:
`'127.0.0.1:${CLIENT_PORT:-3000}:8080'`.

## Откат

Каждый релиз помечен тегом `vX.Y.Z` на `main`. Откатиться — собрать образ
из старого тега:

```bash
git checkout vX.Y.Z
docker compose up --build -d
```

Если CI расширен публикацией образов ([ci.md](ci.md#как-расширять)),
откат — запуск старого тега образа без пересборки.

## См. также

- [architecture.md](architecture.md#docker) — Dockerfile, nginx, compose.
- [ci.md](ci.md) — пайплайн и как добавить публикацию образов.
