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