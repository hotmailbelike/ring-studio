import { OrbitControls } from '@react-three/drei';
import { Canvas, type RootState } from '@react-three/fiber';
import { useCallback, useMemo, useRef, useState, type ComponentRef, type KeyboardEvent } from 'react';
import { NeutralToneMapping } from 'three';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { captureCanvasPng } from '../../lib/captureCanvasPng';
import { describeRing, ringFileName } from '../../lib/describeRing';
import { downloadBlob } from '../../lib/downloadBlob';
import { orbitActionForKey } from '../../lib/orbitKeyboard';
import type { RingConfig } from '../../lib/ringConfig';
import { computeRingDimensions, type RingDimensions } from '../../lib/ringDimensions';
import {
  AUTO_ROTATE_SPEED,
  CAMERA_FAR,
  CAMERA_FIELD_OF_VIEW_DEG,
  CAMERA_NEAR,
  DEVICE_PIXEL_RATIO_RANGE,
  INITIAL_CAMERA_POSITION,
  MAX_ORBIT_DISTANCE,
  MAX_ORBIT_POLAR_ANGLE,
  MIN_ORBIT_DISTANCE,
  ORBIT_DAMPING_FACTOR,
  VIEWER_BACKGROUND,
} from '../../lib/sceneSettings';
import { RingModel } from './RingModel';
import { StudioLighting } from './StudioLighting';
import { ViewerToolbar, type DownloadStatus } from './ViewerToolbar';

const TONE_MAPPING_EXPOSURE = 1.05;
// Defined once: the Canvas re-applies these options whenever their identity changes.
const CAMERA_OPTIONS = {
  position: INITIAL_CAMERA_POSITION,
  fov: CAMERA_FIELD_OF_VIEW_DEG,
  near: CAMERA_NEAR,
  far: CAMERA_FAR,
};
// Neutral tone mapping keeps metal and gem colors closer to their real hue than the default ACES curve.
// The canvas is opaque so transmissive gems refract the scene background (see VIEWER_BACKGROUND).
const RENDERER_OPTIONS = {
  antialias: true,
  alpha: false,
  toneMapping: NeutralToneMapping,
  toneMappingExposure: TONE_MAPPING_EXPOSURE,
};

interface RingViewerProps {
  config: RingConfig;
}

/** Shift (mm) that puts the middle of the ring, from band bottom to stone top, at the origin. */
function centeringOffsetMm(dimensions: RingDimensions): number {
  const { stone } = dimensions;
  const topMm = stone.girdleCenterHeightMm + stone.girdleThicknessMm / 2 + stone.crownHeightMm;
  const bottomMm = -dimensions.outerRadiusMm;
  return -(topMm + bottomMm) / 2;
}

export default function RingViewer({ config }: RingViewerProps) {
  const dimensions = useMemo(() => computeRingDimensions(config), [config]);
  const verticalOffsetMm = centeringOffsetMm(dimensions);

  const prefersReducedMotion = usePrefersReducedMotion();
  const [hasInteracted, setHasInteracted] = useState(false);
  const isAutoRotating = !prefersReducedMotion && !hasInteracted;

  const rootStateRef = useRef<RootState | null>(null);
  const controlsRef = useRef<ComponentRef<typeof OrbitControls>>(null);
  const [downloadStatus, setDownloadStatus] = useState<DownloadStatus>('idle');

  const handleCreated = useCallback((state: RootState) => {
    rootStateRef.current = state;
  }, []);

  const handleResetView = useCallback(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    controls.object.position.set(...INITIAL_CAMERA_POSITION);
    controls.target.set(0, 0, 0);
    controls.update();
    rootStateRef.current?.invalidate();
    setHasInteracted(false);
  }, []);

  const handleStageKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    const controls = controlsRef.current;
    const action = orbitActionForKey(event.key);
    if (!controls || !action) return;
    event.preventDefault();

    if (action.kind === 'rotate') {
      controls.setAzimuthalAngle(controls.getAzimuthalAngle() + action.azimuthDeltaRad);
      controls.setPolarAngle(controls.getPolarAngle() + action.polarDeltaRad);
    } else if (action.direction === 'in') {
      controls.dollyIn(action.dollyScale);
    } else {
      controls.dollyOut(action.dollyScale);
    }
    setHasInteracted(true);
    rootStateRef.current?.invalidate();
  }, []);

  const handleDownload = useCallback(async () => {
    const state = rootStateRef.current;
    if (!state) return;
    setDownloadStatus('working');
    try {
      const blob = await captureCanvasPng({ renderer: state.gl, scene: state.scene, camera: state.camera });
      downloadBlob(blob, ringFileName(config, 'png'));
      setDownloadStatus('idle');
    } catch (error: unknown) {
      console.error('PNG export failed', error);
      setDownloadStatus('failed');
    }
  }, [config]);

  return (
    <div className="viewer">
      <div
        className="viewer__stage"
        role="group"
        aria-roledescription="3D viewer"
        aria-label={`3D preview: ${describeRing(config)}`}
        aria-keyshortcuts="ArrowLeft ArrowRight ArrowUp ArrowDown + -"
        tabIndex={0}
        onKeyDown={handleStageKeyDown}
      >
        <Canvas
          // Render continuously only while auto-rotating; afterwards frames are drawn on demand.
          frameloop={isAutoRotating ? 'always' : 'demand'}
          dpr={DEVICE_PIXEL_RATIO_RANGE}
          camera={CAMERA_OPTIONS}
          gl={RENDERER_OPTIONS}
          onCreated={handleCreated}
          fallback={<p className="viewer__fallback">Your browser can’t show the 3D preview (WebGL is unavailable).</p>}
        >
          <color attach="background" args={[VIEWER_BACKGROUND]} />
          <StudioLighting />
          <RingModel config={config} dimensions={dimensions} verticalOffsetMm={verticalOffsetMm} />
          <OrbitControls
            ref={controlsRef}
            makeDefault
            enablePan={false}
            enableDamping
            dampingFactor={ORBIT_DAMPING_FACTOR}
            minDistance={MIN_ORBIT_DISTANCE}
            maxDistance={MAX_ORBIT_DISTANCE}
            maxPolarAngle={MAX_ORBIT_POLAR_ANGLE}
            autoRotate={isAutoRotating}
            autoRotateSpeed={AUTO_ROTATE_SPEED}
            onStart={() => setHasInteracted(true)}
          />
        </Canvas>
      </div>
      <ViewerToolbar downloadStatus={downloadStatus} onDownload={handleDownload} onResetView={handleResetView} />
    </div>
  );
}
