import type { BufferGeometry, Vector3 } from 'three';
import type { StoneDimensions } from '../ringDimensions';
import type { StoneShape } from '../ringOptions';
import { MeshBuilder } from './meshBuilder';
import { outlineRing, type OutlineExtent } from './outlineRing';
import { CUT_PROPORTIONS, STONE_SHAPE_SPECS, type CutStyle } from './stoneShapes';

interface FacetLayer {
  /** Size relative to the girdle outline. */
  scale: number;
  /** Height relative to the girdle’s center, in mm. */
  height: number;
  /** 0 aligns with the girdle samples; 0.5 interleaves between them, like star and lower-girdle facets. */
  phase: number;
}

const INTERLEAVED_PHASE = 0.5;
const STEP_CUT_KEEL_SCALE = 0.1;

function brilliantLayers(stone: StoneDimensions, tableScale: number): FacetLayer[] {
  const girdleTop = stone.girdleThicknessMm / 2;
  const girdleBottom = -girdleTop;
  return [
    { scale: tableScale, height: girdleTop + stone.crownHeightMm, phase: 0 },
    { scale: (1 + tableScale) / 2, height: girdleTop + stone.crownHeightMm / 2, phase: INTERLEAVED_PHASE },
    { scale: 1, height: girdleTop, phase: 0 },
    { scale: 1, height: girdleBottom, phase: 0 },
    { scale: 0.5, height: girdleBottom - stone.pavilionDepthMm / 2, phase: INTERLEAVED_PHASE },
  ];
}

function stepLayers(stone: StoneDimensions, tableScale: number): FacetLayer[] {
  const girdleTop = stone.girdleThicknessMm / 2;
  const girdleBottom = -girdleTop;
  return [
    { scale: tableScale, height: girdleTop + stone.crownHeightMm, phase: 0 },
    { scale: (1 + tableScale) / 2, height: girdleTop + stone.crownHeightMm / 2, phase: 0 },
    { scale: 1, height: girdleTop, phase: 0 },
    { scale: 1, height: girdleBottom, phase: 0 },
    { scale: 0.72, height: girdleBottom - stone.pavilionDepthMm * 0.3, phase: 0 },
    { scale: 0.42, height: girdleBottom - stone.pavilionDepthMm * 0.65, phase: 0 },
    { scale: STEP_CUT_KEEL_SCALE, height: girdleBottom - stone.pavilionDepthMm, phase: 0 },
  ];
}

const LAYER_BUILDERS: Record<CutStyle, (stone: StoneDimensions, tableScale: number) => FacetLayer[]> = {
  brilliant: brilliantLayers,
  step: stepLayers,
};

/**
 * Connects two rings of equal length, upper ring above lower, with outward-facing facets.
 * The phase difference decides whether facets are quads or interleaved triangles.
 */
function connectLayers(builder: MeshBuilder, upper: Vector3[], lower: Vector3[], phaseDelta: number): void {
  const count = upper.length;
  for (let index = 0; index < count; index += 1) {
    const nextIndex = (index + 1) % count;
    const upperCurrent = upper[index]!;
    const upperNext = upper[nextIndex]!;
    const lowerCurrent = lower[index]!;
    const lowerNext = lower[nextIndex]!;

    if (phaseDelta > 0) {
      // Each lower point sits between two upper points.
      builder.addFacet(upperCurrent, lowerCurrent, upperNext);
      builder.addFacet(upperNext, lowerCurrent, lowerNext);
    } else if (phaseDelta < 0) {
      // Each upper point sits between two lower points.
      builder.addFacet(lowerCurrent, lowerNext, upperCurrent);
      builder.addFacet(upperCurrent, lowerNext, upperNext);
    } else {
      builder.addFacet(upperCurrent, lowerCurrent, lowerNext);
      builder.addFacet(upperCurrent, lowerNext, upperNext);
    }
  }
}

function addCap(builder: MeshBuilder, ring: Vector3[], apex: Vector3, facesUp: boolean): void {
  ring.forEach((point, index) => {
    const next = ring[(index + 1) % ring.length]!;
    if (facesUp) builder.addFacet(apex, point, next);
    else builder.addFacet(apex, next, point);
  });
}

/**
 * Builds a faceted stone centered on its girdle: a flat table on top, crown and
 * pavilion facets lofted between scaled copies of the girdle outline.
 */
export function buildFacetedGemGeometry(shape: StoneShape, stone: StoneDimensions): BufferGeometry {
  const shapeSpec = STONE_SHAPE_SPECS[shape];
  const proportions = CUT_PROPORTIONS[shapeSpec.cutStyle];
  const layers = LAYER_BUILDERS[shapeSpec.cutStyle](stone, proportions.tableScale);

  const rings = layers.map((layer) => {
    const extent: OutlineExtent = {
      halfWidth: (stone.widthMm / 2) * layer.scale,
      halfLength: (stone.lengthMm / 2) * layer.scale,
    };
    return outlineRing(shapeSpec.outlineAt, shapeSpec.girdleSegments, extent, layer.height, layer.phase);
  });

  const builder = new MeshBuilder();
  const tableRing = rings[0]!;
  const lowestRing = rings[rings.length - 1]!;
  const tableCenter = tableRing[0]!.clone().set(0, layers[0]!.height, 0);
  const culet = tableCenter.clone().setY(-stone.girdleThicknessMm / 2 - stone.pavilionDepthMm);

  addCap(builder, tableRing, tableCenter, true);
  for (let index = 0; index < rings.length - 1; index += 1) {
    const phaseDelta = layers[index + 1]!.phase - layers[index]!.phase;
    connectLayers(builder, rings[index]!, rings[index + 1]!, phaseDelta);
  }
  addCap(builder, lowestRing, culet, false);

  return builder.build();
}
