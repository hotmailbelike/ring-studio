/** The model is built in millimeters; the scene works in centimeters so camera numbers stay readable. */
export const SCENE_UNITS_PER_MM = 0.1;

export const CAMERA_FIELD_OF_VIEW_DEG = 32;
export const INITIAL_CAMERA_POSITION: [number, number, number] = [3.4, 1.9, 5.6];
export const CAMERA_NEAR = 0.1;
export const CAMERA_FAR = 100;

export const MIN_ORBIT_DISTANCE = 3.2;
export const MAX_ORBIT_DISTANCE = 11;
// Stop just below the horizon so the camera never ends up under the shadow plane.
export const MAX_ORBIT_POLAR_ANGLE = Math.PI * 0.56;
export const ORBIT_DAMPING_FACTOR = 0.08;
export const AUTO_ROTATE_SPEED = 0.6;

export const DEVICE_PIXEL_RATIO_RANGE: [number, number] = [1, 2];

/**
 * The canvas is opaque and painted this color (kept in sync with .viewer in global.css).
 * An opaque backdrop matters: with a transparent canvas, three.js clears the transmission
 * buffer to half-white, so gems would refract a pale grey instead of the dark studio.
 */
export const VIEWER_BACKGROUND = '#141414';
