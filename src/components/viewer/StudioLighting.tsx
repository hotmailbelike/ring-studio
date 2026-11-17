import { Environment, Lightformer } from '@react-three/drei';

// The studio is built from emissive cards rendered into a cube map once,
// so lighting never depends on downloading an HDR file.
const ENVIRONMENT_RESOLUTION = 256;
const RENDER_ENVIRONMENT_ONCE = 1;
const STUDIO_BACKDROP = '#2a2a2a';

type Vector3Tuple = [number, number, number];

interface StudioLight {
  name: string;
  form: 'rect' | 'ring' | 'circle';
  intensity: number;
  position: Vector3Tuple;
  scale: number | Vector3Tuple;
}

const STUDIO_LIGHTS: readonly StudioLight[] = [
  { name: 'overhead softbox', form: 'rect', intensity: 4, position: [0, 6, 0], scale: [12, 4, 1] },
  // The two long strips draw the bright lines that run along a polished band.
  { name: 'left strip', form: 'rect', intensity: 3, position: [-6, 1.5, 1], scale: [12, 1.2, 1] },
  { name: 'right strip', form: 'rect', intensity: 3, position: [6, 1.5, -1], scale: [12, 1.2, 1] },
  { name: 'front fill', form: 'rect', intensity: 1.4, position: [0, 0.5, 7], scale: [9, 1.5, 1] },
  // Small, bright sources give the crisp glints that make facets sparkle.
  { name: 'back ring', form: 'ring', intensity: 3, position: [0, 3, -6], scale: 3 },
  { name: 'key glint', form: 'circle', intensity: 8, position: [3, 5, 4], scale: 1.2 },
  { name: 'table bounce', form: 'rect', intensity: 0.6, position: [0, -6, 0], scale: [14, 14, 1] },
];

const KEY_LIGHT_POSITION: Vector3Tuple = [4, 6, 5];
const KEY_LIGHT_INTENSITY = 1.6;
const RIM_LIGHT_POSITION: Vector3Tuple = [-5, 3, -4];
const RIM_LIGHT_INTENSITY = 0.8;

export function StudioLighting() {
  return (
    <>
      <Environment resolution={ENVIRONMENT_RESOLUTION} frames={RENDER_ENVIRONMENT_ONCE}>
        <color attach="background" args={[STUDIO_BACKDROP]} />
        {STUDIO_LIGHTS.map((light) => (
          <Lightformer
            key={light.name}
            form={light.form}
            intensity={light.intensity}
            position={light.position}
            scale={light.scale}
          />
        ))}
      </Environment>
      <directionalLight position={KEY_LIGHT_POSITION} intensity={KEY_LIGHT_INTENSITY} />
      <directionalLight position={RIM_LIGHT_POSITION} intensity={RIM_LIGHT_INTENSITY} />
    </>
  );
}
