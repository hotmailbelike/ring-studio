export const METAL_IDS = [
  'yellowGold18k',
  'roseGold18k',
  'whiteGold18k',
  'platinum',
  'sterlingSilver',
] as const;
export type MetalId = (typeof METAL_IDS)[number];

export const STONE_SHAPES = ['round', 'oval', 'pear', 'emerald', 'cushion'] as const;
export type StoneShape = (typeof STONE_SHAPES)[number];

export const STONE_TYPES = ['diamond', 'sapphire', 'ruby', 'emerald'] as const;
export type StoneType = (typeof STONE_TYPES)[number];

export const SETTING_STYLES = ['fourProng', 'sixProng', 'bezel'] as const;
export type SettingStyle = (typeof SETTING_STYLES)[number];

export const BAND_PROFILES = ['flat', 'court'] as const;
export type BandProfile = (typeof BAND_PROFILES)[number];

export const SETTING_LABELS: Record<SettingStyle, string> = {
  fourProng: '4-prong',
  sixProng: '6-prong',
  bezel: 'Bezel',
};

export const BAND_PROFILE_LABELS: Record<BandProfile, string> = {
  flat: 'Flat',
  court: 'Court (comfort)',
};
