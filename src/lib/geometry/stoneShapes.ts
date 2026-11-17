import type { StoneShape } from '../ringOptions';
import { polygonArea, sampleClosedCurve, signedPower, type Point2 } from './polygon';

export type CutStyle = 'brilliant' | 'step';

export interface CutProportions {
  /** Table width as a fraction of the girdle outline. */
  tableScale: number;
  crownHeightToWidth: number;
  girdleThicknessToWidth: number;
  pavilionDepthToWidth: number;
}

export interface StoneShapeSpec {
  label: string;
  cutStyle: CutStyle;
  lengthToWidthRatio: number;
  /** Facet count around the girdle. */
  girdleSegments: number;
  /** Where the first prong sits on the outline, as a fraction of a full turn. */
  prongPhase: number;
  /**
   * Girdle outline inside the unit square, x across the finger and y along it.
   * t runs 0..1 counter-clockwise seen from above, starting at the north tip.
   */
  outlineAt: (t: number) => Point2;
}

const FULL_TURN = Math.PI * 2;
const QUARTER_TURN_FRACTION = 1 / 8;

const BRILLIANT_PROPORTIONS: CutProportions = {
  tableScale: 0.56,
  crownHeightToWidth: 0.15,
  girdleThicknessToWidth: 0.02,
  pavilionDepthToWidth: 0.43,
};

const STEP_PROPORTIONS: CutProportions = {
  tableScale: 0.7,
  crownHeightToWidth: 0.12,
  girdleThicknessToWidth: 0.02,
  pavilionDepthToWidth: 0.42,
};

export const CUT_PROPORTIONS: Record<CutStyle, CutProportions> = {
  brilliant: BRILLIANT_PROPORTIONS,
  step: STEP_PROPORTIONS,
};

const CUSHION_SQUARENESS_EXPONENT = 4;

// The teardrop x = sin(u)·sin(u/2) peaks at 4/(3√3); dividing by it fits the pear into the unit square.
const TEARDROP_MAX_HALF_WIDTH = 4 / (3 * Math.sqrt(3));

// Emerald cut: a rectangle with its corners cut at 45°, listed counter-clockwise from the north edge.
const EMERALD_CORNER_CUT = 0.32;
const EMERALD_VERTICES: readonly Point2[] = [
  { x: EMERALD_CORNER_CUT - 1, y: 1 },
  { x: 1 - EMERALD_CORNER_CUT, y: 1 },
  { x: 1, y: 1 - EMERALD_CORNER_CUT },
  { x: 1, y: EMERALD_CORNER_CUT - 1 },
  { x: 1 - EMERALD_CORNER_CUT, y: -1 },
  { x: EMERALD_CORNER_CUT - 1, y: -1 },
  { x: -1, y: EMERALD_CORNER_CUT - 1 },
  { x: -1, y: 1 - EMERALD_CORNER_CUT },
];

function ellipseOutline(t: number): Point2 {
  const angle = t * FULL_TURN;
  return { x: Math.sin(angle), y: Math.cos(angle) };
}

function cushionOutline(t: number): Point2 {
  const angle = t * FULL_TURN;
  const exponent = 2 / CUSHION_SQUARENESS_EXPONENT;
  return { x: signedPower(Math.sin(angle), exponent), y: signedPower(Math.cos(angle), exponent) };
}

function pearOutline(t: number): Point2 {
  const angle = t * FULL_TURN;
  return { x: (Math.sin(angle) * Math.sin(angle / 2)) / TEARDROP_MAX_HALF_WIDTH, y: Math.cos(angle) };
}

/** Walks the octagon so t = k/8 lands exactly on vertex k, which keeps step facets planar. */
function emeraldOutline(t: number): Point2 {
  const vertexCount = EMERALD_VERTICES.length;
  const position = (((t % 1) + 1) % 1) * vertexCount;
  const startIndex = Math.floor(position);
  const blend = position - startIndex;
  const start = EMERALD_VERTICES[startIndex % vertexCount] ?? EMERALD_VERTICES[0]!;
  const end = EMERALD_VERTICES[(startIndex + 1) % vertexCount] ?? EMERALD_VERTICES[0]!;
  return { x: start.x + (end.x - start.x) * blend, y: start.y + (end.y - start.y) * blend };
}

export const STONE_SHAPE_SPECS: Record<StoneShape, StoneShapeSpec> = {
  round: {
    label: 'Round',
    cutStyle: 'brilliant',
    lengthToWidthRatio: 1,
    girdleSegments: 16,
    prongPhase: QUARTER_TURN_FRACTION,
    outlineAt: ellipseOutline,
  },
  oval: {
    label: 'Oval',
    cutStyle: 'brilliant',
    lengthToWidthRatio: 1.4,
    girdleSegments: 24,
    prongPhase: QUARTER_TURN_FRACTION,
    outlineAt: ellipseOutline,
  },
  pear: {
    label: 'Pear',
    cutStyle: 'brilliant',
    lengthToWidthRatio: 1.6,
    girdleSegments: 24,
    prongPhase: 0,
    outlineAt: pearOutline,
  },
  emerald: {
    label: 'Emerald cut',
    cutStyle: 'step',
    lengthToWidthRatio: 1.4,
    girdleSegments: EMERALD_VERTICES.length,
    // Midpoint of the first cut corner, so four prongs guard the four corners.
    prongPhase: 1 / (EMERALD_VERTICES.length * 2) + 1 / EMERALD_VERTICES.length,
    outlineAt: emeraldOutline,
  },
  cushion: {
    label: 'Cushion',
    cutStyle: 'brilliant',
    lengthToWidthRatio: 1.05,
    girdleSegments: 16,
    prongPhase: QUARTER_TURN_FRACTION,
    outlineAt: cushionOutline,
  },
};

const OUTLINE_AREA_SAMPLES = 256;
const UNIT_SQUARE_AREA = 4;

/** Fraction of the unit square the outline covers (π/4 for a circle). */
export function outlineFillRatio(shape: StoneShape): number {
  const outline = sampleClosedCurve(STONE_SHAPE_SPECS[shape].outlineAt, OUTLINE_AREA_SAMPLES);
  return polygonArea(outline) / UNIT_SQUARE_AREA;
}
