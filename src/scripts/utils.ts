export function toObjectIIfJsonString(arg: string): string | object {
  if (typeof arg === 'string' && arg.startsWith('{') && arg.endsWith('}')) {
    return JSON.parse(arg);
  }
  return arg;
}
