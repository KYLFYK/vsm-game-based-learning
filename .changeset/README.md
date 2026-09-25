# Changesets

Каждый PR с изменением кода приложения (`src/`, `public/`, `index.html`,
`Dockerfile`, `nginx.conf`, `package.json`) несёт файл changeset в этой папке:
`yarn changeset` — выбрать тип изменения (patch / minor / major) и описать
его для CHANGELOG на русском языке.

Тот же список путей задан в `changedFilePatterns` в `config.json`: правки
вне него (`docs/`, `.github/`, конфиги тулчейна) проверка CI пропускает
без changeset. Меняется список — меняются оба места.

Как это работает и как CI поднимает версию — [docs/versioning.md](../docs/versioning.md).
`repo` в `config.json` — `KYLFYK/vsm-game-based-learning`: по нему генератор
CHANGELOG ищет коммиты и PR. При переносе репозитория его меняют, иначе job
`Version` упадёт.
