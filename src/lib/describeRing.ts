import { formatCarat, formatRingSize } from './formatters';
import { STONE_SHAPE_SPECS } from './geometry/stoneShapes';
import { METALS } from './metals';
import type { RingConfig } from './ringConfig';
import { BAND_PROFILE_LABELS, SETTING_LABELS } from './ringOptions';
import { STONES } from './stones';

/** Plain-language summary used for the 3D view's accessible name and file names. */
export function describeRing(config: RingConfig): string {
  const shape = STONE_SHAPE_SPECS[config.stoneShape].label.toLowerCase();
  const stone = STONES[config.stoneType].label.toLowerCase();
  const metal = METALS[config.metal].label;
  const setting = SETTING_LABELS[config.setting].toLowerCase();
  const profile = BAND_PROFILE_LABELS[config.bandProfile].toLowerCase();

  return `${formatCarat(config.caratWeight)} ${shape} ${stone} in a ${setting} setting, ${metal} ${profile} band, ${formatRingSize(config.ringSizeUs)}`;
}

export function ringFileName(config: RingConfig, extension: string): string {
  return `ring-studio-${config.stoneShape}-${config.stoneType}-${config.metal}.${extension}`;
}
