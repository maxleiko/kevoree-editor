const CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

class RGBColor {

  readonly red = randomInt(0, 256);
  readonly green = randomInt(0, 256);
  readonly blue = randomInt(0, 256);

  toString() {
    return `#${this.red.toString(16)}${this.green.toString(16)}${this.blue.toString(16)}`;
  }
}

/**
 * Random integer between min included and max excluded
 * @param min included
 * @param max excluded
 */
export function randomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Random RGB color
 */
export function randomColor() {
  return new RGBColor();
}

export function uid(length: number = 5) {
  let _uid = '';
  for (let i = 0; i < length; i++) {
    _uid += CHARS.charAt(randomInt(0, CHARS.length));
  }
  return _uid;
}