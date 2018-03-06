import * as ColorHash from 'color-hash';

export function str2rgb(name: string) {
  const rgb: number[] = new ColorHash().rgb(name);
  return { r: rgb[0], g: rgb[1], b: rgb[2] };
}