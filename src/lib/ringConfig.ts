import {
  BAND_PROFILES,
  METAL_IDS,
  SETTING_STYLES,
  STONE_SHAPES,
  STONE_TYPES,
  type BandProfile,
  type MetalId,
  type SettingStyle,
  type StoneShape,
  type StoneType,
} from './ringOptions';

export interface RingConfig {
  metal: MetalId;
  stoneShape: StoneShape;
  stoneType: StoneType;
  caratWeight: number;
  setting: SettingStyle;
  bandWidthMm: number;
  bandProfile: BandProfile;
  ringSizeUs: number;
}

export interface NumericRange {
  min: number;
  max: number;
  step: number;
}

// These ranges are mirrored in firestore.rules; change both together.
export const CARAT_RANGE: NumericRange = { min: 0.25, max: 3, step: 0.05 };
export const BAND_WIDTH_RANGE_MM: NumericRange = { min: 1.5, max: 4, step: 0.1 };
export const RING_SIZE_RANGE_US: NumericRange = { min: 4, max: 12, step: 0.5 };

const RING_CONFIG_KEYS = [
  'metal',
  'stoneShape',
  'stoneType',
  'caratWeight',
  'setting',
  'bandWidthMm',
  'bandProfile',
  'ringSizeUs',
] as const satisfies readonly (keyof RingConfig)[];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isOneOf<T extends string>(options: readonly T[], value: unknown): value is T {
  return typeof value === 'string' && (options as readonly string[]).includes(value);
}

function isInRange(range: NumericRange, value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= range.min && value <= range.max;
}

/** Returns a clean RingConfig when every field is present and valid, otherwise null. */
export function parseRingConfig(value: unknown): RingConfig | null {
  if (!isRecord(value)) return null;

  const { metal, stoneShape, stoneType, caratWeight, setting, bandWidthMm, bandProfile, ringSizeUs } = value;

  const isValid =
    isOneOf(METAL_IDS, metal) &&
    isOneOf(STONE_SHAPES, stoneShape) &&
    isOneOf(STONE_TYPES, stoneType) &&
    isInRange(CARAT_RANGE, caratWeight) &&
    isOneOf(SETTING_STYLES, setting) &&
    isInRange(BAND_WIDTH_RANGE_MM, bandWidthMm) &&
    isOneOf(BAND_PROFILES, bandProfile) &&
    isInRange(RING_SIZE_RANGE_US, ringSizeUs);

  if (!isValid) return null;

  return { metal, stoneShape, stoneType, caratWeight, setting, bandWidthMm, bandProfile, ringSizeUs };
}

export function areRingConfigsEqual(first: RingConfig, second: RingConfig): boolean {
  return RING_CONFIG_KEYS.every((key) => first[key] === second[key]);
}
