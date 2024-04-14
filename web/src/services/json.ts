/**
 * Check if a string is a valid JSON
 * @param str the string to check
 * @returns true if the string is a valid JSON, false otherwise
 */
export const isJSON = (str: string) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

/**
 * Transform the values of an object using a function
 * @param object the object to transform
 * @param transformValue the function to transform the values
 * @returns the transformed object
 */
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

/**
 * Clean empty (null or "") values from an object by setting them to undefined
 * @param obj the object to clean
 * @returns the cleaned object
 */
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
