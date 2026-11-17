// One arrow-key press turns the view by 10 degrees; one +/- press zooms by 15%.
const KEYBOARD_ROTATE_STEP_RAD = Math.PI / 18;
const KEYBOARD_ZOOM_FACTOR = 1.15;

export type OrbitKeyAction =
  | { kind: 'rotate'; azimuthDeltaRad: number; polarDeltaRad: number }
  | { kind: 'zoom'; dollyScale: number; direction: 'in' | 'out' };

const ORBIT_KEY_ACTIONS: Readonly<Record<string, OrbitKeyAction>> = {
  ArrowLeft: { kind: 'rotate', azimuthDeltaRad: -KEYBOARD_ROTATE_STEP_RAD, polarDeltaRad: 0 },
  ArrowRight: { kind: 'rotate', azimuthDeltaRad: KEYBOARD_ROTATE_STEP_RAD, polarDeltaRad: 0 },
  ArrowUp: { kind: 'rotate', azimuthDeltaRad: 0, polarDeltaRad: -KEYBOARD_ROTATE_STEP_RAD },
  ArrowDown: { kind: 'rotate', azimuthDeltaRad: 0, polarDeltaRad: KEYBOARD_ROTATE_STEP_RAD },
  '+': { kind: 'zoom', dollyScale: KEYBOARD_ZOOM_FACTOR, direction: 'in' },
  '=': { kind: 'zoom', dollyScale: KEYBOARD_ZOOM_FACTOR, direction: 'in' },
  '-': { kind: 'zoom', dollyScale: KEYBOARD_ZOOM_FACTOR, direction: 'out' },
  _: { kind: 'zoom', dollyScale: KEYBOARD_ZOOM_FACTOR, direction: 'out' },
};

/** Maps a key on the focused 3D stage to an orbit action, or null when the key isn't an orbit control. */
export function orbitActionForKey(key: string): OrbitKeyAction | null {
  return ORBIT_KEY_ACTIONS[key] ?? null;
}
