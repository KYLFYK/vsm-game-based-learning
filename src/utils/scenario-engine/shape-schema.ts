import { Validation } from '@/types';

import { index, isObject, issue, key } from './issue';

/** Проверка значения по пути; ошибки формы дописываются в `out` */
export type Check = (
  value: unknown,
  path: string,
  out: Validation.Issue[]
) => void;

interface Field {
  check: Check;
  required: boolean;
}

export const required = (check: Check): Field => ({ check, required: true });
export const optional = (check: Check): Field => ({ check, required: false });

const typeError = (path: string, expected: string): Validation.Issue =>
  issue(Validation.Code.ShapeType, path, `Ожидается ${expected}`);

export const string: Check = (value, path, out) => {
  if (typeof value !== 'string') out.push(typeError(path, 'строка'));
};

export const boolean: Check = (value, path, out) => {
  if (typeof value !== 'boolean') out.push(typeError(path, 'boolean'));
};

export const finite: Check = (value, path, out) => {
  if (typeof value !== 'number') {
    out.push(typeError(path, 'число'));
  } else if (!Number.isFinite(value)) {
    out.push(
      issue(Validation.Code.ShapeNumber, path, 'Ожидается конечное число')
    );
  }
};

export const positive: Check = (value, path, out) => {
  if (typeof value === 'number' && Number.isFinite(value) && value <= 0) {
    out.push(
      issue(Validation.Code.ShapeNumber, path, 'Ожидается положительное число')
    );
  } else {
    finite(value, path, out);
  }
};

export const oneOf =
  (values: readonly string[]): Check =>
  (value, path, out) => {
    if (typeof value !== 'string' || !values.includes(value)) {
      out.push(typeError(path, `одно из: ${values.join(', ')}`));
    }
  };

export const nullable =
  (check: Check): Check =>
  (value, path, out) => {
    if (value !== null) check(value, path, out);
  };

export const arrayOf =
  (item: Check): Check =>
  (value, path, out) => {
    if (!Array.isArray(value)) {
      out.push(typeError(path, 'массив'));
      return;
    }
    value.forEach((element, position) =>
      item(element, index(path, position), out)
    );
  };

export const recordOf =
  (item: Check): Check =>
  (value, path, out) => {
    if (!isObject(value)) {
      out.push(typeError(path, 'объект'));
      return;
    }
    Object.entries(value).forEach(([name, element]) =>
      item(element, key(path, name), out)
    );
  };

export const objectOf =
  (fields: Record<string, Field>): Check =>
  (value, path, out) => {
    if (!isObject(value)) {
      out.push(typeError(path, 'объект'));
      return;
    }
    Object.keys(value)
      .filter((name) => !Object.hasOwn(fields, name))
      .forEach((name) =>
        out.push(
          issue(
            Validation.Code.ShapeUnknownField,
            key(path, name),
            `Поле «${name}» вне схемы`
          )
        )
      );
    Object.entries(fields).forEach(([name, field]) => {
      const fieldPath = key(path, name);
      if (value[name] !== undefined) {
        field.check(value[name], fieldPath, out);
      } else if (field.required) {
        out.push(
          issue(
            Validation.Code.ShapeMissing,
            fieldPath,
            `Нет обязательного поля «${name}»`
          )
        );
      }
    });
  };

/** Вариант выбирается по первому присутствующему полю-признаку */
export const variantBy =
  (variants: Record<string, Check>, expected: string): Check =>
  (value, path, out) => {
    if (!isObject(value)) {
      out.push(typeError(path, 'объект'));
      return;
    }
    const tag = Object.keys(variants).find((name) => value[name] !== undefined);
    if (tag === undefined) {
      out.push(typeError(path, expected));
      return;
    }
    variants[tag](value, path, out);
  };
