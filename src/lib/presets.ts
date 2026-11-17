import type { RingConfig } from './ringConfig';

export interface RingPreset {
  id: string;
  name: string;
  config: RingConfig;
}

export const RING_PRESETS: readonly RingPreset[] = [
  {
    id: 'classic-solitaire',
    name: 'Classic solitaire',
    config: {
      metal: 'platinum',
      stoneShape: 'round',
      stoneType: 'diamond',
      caratWeight: 1,
      setting: 'sixProng',
      bandWidthMm: 2,
      bandProfile: 'court',
      ringSizeUs: 6,
    },
  },
  {
    id: 'oval-sapphire',
    name: 'Oval sapphire',
    config: {
      metal: 'whiteGold18k',
      stoneShape: 'oval',
      stoneType: 'sapphire',
      caratWeight: 1.5,
      setting: 'fourProng',
      bandWidthMm: 2.2,
      bandProfile: 'court',
      ringSizeUs: 6.5,
    },
  },
  {
    id: 'rose-gold-pear',
    name: 'Rose gold pear',
    config: {
      metal: 'roseGold18k',
      stoneShape: 'pear',
      stoneType: 'diamond',
      caratWeight: 0.9,
      setting: 'sixProng',
      bandWidthMm: 1.8,
      bandProfile: 'flat',
      ringSizeUs: 5.5,
    },
  },
  {
    id: 'emerald-bezel',
    name: 'Emerald bezel',
    config: {
      metal: 'yellowGold18k',
      stoneShape: 'emerald',
      stoneType: 'emerald',
      caratWeight: 1.75,
      setting: 'bezel',
      bandWidthMm: 2.8,
      bandProfile: 'flat',
      ringSizeUs: 7,
    },
  },
];

const [defaultPreset] = RING_PRESETS;
if (!defaultPreset) throw new Error('Ring Studio needs at least one preset.');

export const DEFAULT_RING_CONFIG: RingConfig = defaultPreset.config;
