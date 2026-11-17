export interface Point2 {
  x: number;
  y: number;
}

/** Unsigned area of a simple closed polygon (shoelace formula). */
export function polygonArea(points: readonly Point2[]): number {
  let doubledArea = 0;
  points.forEach((point, index) => {
    const next = points[(index + 1) % points.length] ?? point;
    doubledArea += point.x * next.y - next.x * point.y;
  });
  return Math.abs(doubledArea) / 2;
}

export function sampleClosedCurve(curve: (t: number) => Point2, sampleCount: number): Point2[] {
  return Array.from({ length: sampleCount }, (_, index) => curve(index / sampleCount));
}

/** |cos|^(2/n) style power that keeps the sign, used for superellipses. */
export function signedPower(value: number, exponent: number): number {
  return Math.sign(value) * Math.abs(value) ** exponent;
}
