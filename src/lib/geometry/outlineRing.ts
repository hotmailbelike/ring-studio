import { Vector3 } from 'three';
import type { Point2 } from './polygon';

export interface OutlineExtent {
  /** Half the extent across the finger (x). */
  halfWidth: number;
  /** Half the extent along the finger (z). */
  halfLength: number;
}

/** One point on an outline at parameter t, lifted to the given height. */
export function outlinePoint(
  outlineAt: (t: number) => Point2,
  t: number,
  extent: OutlineExtent,
  height: number,
): Vector3 {
  const point = outlineAt(t);
  return new Vector3(point.x * extent.halfWidth, height, point.y * extent.halfLength);
}

/**
 * Samples a girdle-style outline as a horizontal ring of 3D points.
 * The outline's y axis maps to z so elongated stones sit north–south on the finger.
 * phase shifts samples by a fraction of one segment (0.5 interleaves facets).
 */
export function outlineRing(
  outlineAt: (t: number) => Point2,
  segmentCount: number,
  extent: OutlineExtent,
  height: number,
  phase = 0,
): Vector3[] {
  return Array.from({ length: segmentCount }, (_, index) =>
    outlinePoint(outlineAt, (index + phase) / segmentCount, extent, height),
  );
}
