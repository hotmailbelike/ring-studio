import type { BufferGeometry, Vector3 } from 'three';
import type { RingDimensions } from '../ringDimensions';
import type { StoneShape } from '../ringOptions';
import { computeHeadBase } from './headLayout';
import { MeshBuilder } from './meshBuilder';
import { outlineRing, type OutlineExtent } from './outlineRing';
import { STONE_SHAPE_SPECS } from './stoneShapes';

const MIN_BEZEL_WALL_MM = 0.5;
const BEZEL_WALL_TO_HALF_WIDTH = 0.16;
// The rim's inner edge overlaps the girdle by this share so it visibly holds the stone.
const BEZEL_LIP_TO_HALF_WIDTH = 0.06;
// The rim rises this share of the crown height above the girdle.
const BEZEL_RIM_CROWN_SHARE = 0.3;
// The straight collar ends this far down the pavilion before tapering to the band.
const BEZEL_COLLAR_PAVILION_SHARE = 0.35;
const MIN_BASE_OPENING_MM = 0.1;
const CURVED_OUTLINE_SEGMENTS = 96;

interface ProfilePoint {
  extent: OutlineExtent;
  height: number;
}

function insetExtent(extent: OutlineExtent, inset: number): OutlineExtent {
  return {
    halfWidth: Math.max(extent.halfWidth - inset, MIN_BASE_OPENING_MM),
    halfLength: Math.max(extent.halfLength - inset, MIN_BASE_OPENING_MM),
  };
}

/**
 * The bezel's cross-section as a closed loop: down the outside, across the
 * base, up the inside, and over the rim. Sweeping it around the stone's
 * outline gives the cup.
 */
function bezelProfile(dimensions: RingDimensions): ProfilePoint[] {
  const { stone } = dimensions;
  const halfWidth = stone.widthMm / 2;
  const wallMm = Math.max(MIN_BEZEL_WALL_MM, halfWidth * BEZEL_WALL_TO_HALF_WIDTH);
  const lipMm = halfWidth * BEZEL_LIP_TO_HALF_WIDTH;

  const girdle: OutlineExtent = { halfWidth, halfLength: stone.lengthMm / 2 };
  const outerWall: OutlineExtent = { halfWidth: girdle.halfWidth + wallMm, halfLength: girdle.halfLength + wallMm };
  const innerWall = insetExtent(girdle, lipMm);
  const base = computeHeadBase(dimensions);

  const rimHeight = stone.girdleCenterHeightMm + stone.girdleThicknessMm / 2 + stone.crownHeightMm * BEZEL_RIM_CROWN_SHARE;
  const collarHeight =
    stone.girdleCenterHeightMm - stone.girdleThicknessMm / 2 - stone.pavilionDepthMm * BEZEL_COLLAR_PAVILION_SHARE;

  return [
    { extent: outerWall, height: rimHeight },
    { extent: outerWall, height: collarHeight },
    { extent: base.extent, height: base.height },
    { extent: insetExtent(base.extent, wallMm), height: base.height },
    { extent: innerWall, height: collarHeight },
    { extent: innerWall, height: rimHeight },
  ];
}

/** Each profile edge gets its own strip so profile corners stay crisp while curves stay smooth. */
function addSmoothStrip(builder: MeshBuilder, upper: Vector3[], lower: Vector3[]): void {
  const upperIndices = upper.map((point) => builder.addVertex(point));
  const lowerIndices = lower.map((point) => builder.addVertex(point));
  const count = upper.length;
  for (let index = 0; index < count; index += 1) {
    const nextIndex = (index + 1) % count;
    builder.addTriangle(upperIndices[index]!, lowerIndices[index]!, lowerIndices[nextIndex]!);
    builder.addTriangle(upperIndices[index]!, lowerIndices[nextIndex]!, upperIndices[nextIndex]!);
  }
}

function addFlatStrip(builder: MeshBuilder, upper: Vector3[], lower: Vector3[]): void {
  const count = upper.length;
  for (let index = 0; index < count; index += 1) {
    const nextIndex = (index + 1) % count;
    builder.addFacet(upper[index]!, lower[index]!, lower[nextIndex]!);
    builder.addFacet(upper[index]!, lower[nextIndex]!, upper[nextIndex]!);
  }
}

export function buildBezelCupGeometry(shape: StoneShape, dimensions: RingDimensions): BufferGeometry {
  const shapeSpec = STONE_SHAPE_SPECS[shape];
  // Step cuts have straight sides and sharp corners, so they keep one flat panel per side.
  const isStraightSided = shapeSpec.cutStyle === 'step';
  const segmentCount = isStraightSided ? shapeSpec.girdleSegments : CURVED_OUTLINE_SEGMENTS;
  const addStrip = isStraightSided ? addFlatStrip : addSmoothStrip;

  const profile = bezelProfile(dimensions);
  const rings = profile.map((point) => outlineRing(shapeSpec.outlineAt, segmentCount, point.extent, point.height));

  const builder = new MeshBuilder();
  rings.forEach((ring, index) => {
    addStrip(builder, ring, rings[(index + 1) % rings.length]!);
  });
  return builder.build();
}
