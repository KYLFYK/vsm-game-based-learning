# Фичи client

Здесь собираются пользовательские флоу: что происходит шаг за шагом, какие
файлы задействованы, какие endpoints и гочи.

## Список фич

| Фича | Маршрут | Документ |
|------|---------|----------|
| Прохождение сценария | /scenarios/:scenarioId | [scenario-run.md](scenario-run.md) |
| Курсы и результаты | /courses, /courses/:courseId | [courses.md](courses.md) |
| Достижения | /achievements | [achievements.md](achievements.md) |

## Шаблон для новой фичи

Файл `<kebab-case>.md` в этой папке:

```
# <Feature name>

## Что делает
Одно-два предложения, что фича даёт пользователю.

## Маршруты
- путь → компонент

## Файлы
- pages/...
- containers/...
- store/apis/...
- types/...

## Поток (step-by-step)
1. ...
2. ...

## API
- `METHOD /url` — короткое описание.

## Зависимости / гочи
- ...
```

И строка в таблицу выше.

## См. также

- [../routing.md](../routing.md) — как добавить маршрут.
- [../api.md](../api.md) — как добавить endpoint.
