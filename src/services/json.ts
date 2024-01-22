export const isJSON = (str: string) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export function transformObjectValues<T extends object>(
  object: T,
  transformValue: (value: unknown) => unknown,
): T {
  const result: any = {};
  for (const [key, value] of Object.entries(object)) {
    result[key] = transformValue(value);
  }
  return result;
}

export function cleanEmptyValues<T extends object>(obj: T): T {
  return transformObjectValues(obj, (value) => {
    if (value === null) {
      return undefined;
    }
    if (value === "") {
      return undefined;
    }
    return value;
  });
}
