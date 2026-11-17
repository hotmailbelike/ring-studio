import { STONE_SHAPE_SPECS } from './geometry/stoneShapes';
import { METALS } from './metals';
import {
  BAND_PROFILES,
  BAND_PROFILE_LABELS,
  METAL_IDS,
  SETTING_LABELS,
  SETTING_STYLES,
  STONE_SHAPES,
  STONE_TYPES,
  type BandProfile,
  type MetalId,
  type SettingStyle,
  type StoneShape,
  type StoneType,
} from './ringOptions';
import { STONES } from './stones';

export interface ChoiceOption<T extends string> {
  value: T;
  label: string;
  swatchColor?: string;
}

export const METAL_OPTIONS: readonly ChoiceOption<MetalId>[] = METAL_IDS.map((id) => ({
  value: id,
  label: METALS[id].label,
  swatchColor: METALS[id].colorHex,
}));

export const STONE_SHAPE_OPTIONS: readonly ChoiceOption<StoneShape>[] = STONE_SHAPES.map((shape) => ({
  value: shape,
  label: STONE_SHAPE_SPECS[shape].label,
}));

export const STONE_TYPE_OPTIONS: readonly ChoiceOption<StoneType>[] = STONE_TYPES.map((type) => ({
  value: type,
  label: STONES[type].label,
  swatchColor: STONES[type].colorHex,
}));

export const SETTING_OPTIONS: readonly ChoiceOption<SettingStyle>[] = SETTING_STYLES.map((style) => ({
  value: style,
  label: SETTING_LABELS[style],
}));

export const BAND_PROFILE_OPTIONS: readonly ChoiceOption<BandProfile>[] = BAND_PROFILES.map((profile) => ({
  value: profile,
  label: BAND_PROFILE_LABELS[profile],
}));
