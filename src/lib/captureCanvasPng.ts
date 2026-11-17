import type { Camera, Scene, WebGLRenderer } from 'three';

interface CaptureOptions {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: Camera;
}

/**
 * Renders a fresh frame and copies it to a 2D canvas in the same task,
 * so the WebGL drawing buffer can be read without preserveDrawingBuffer.
 */
export function captureCanvasPng({ renderer, scene, camera }: CaptureOptions): Promise<Blob> {
  renderer.render(scene, camera);
  const source = renderer.domElement;

  const output = document.createElement('canvas');
  output.width = source.width;
  output.height = source.height;
  const context = output.getContext('2d');
  if (!context) return Promise.reject(new Error('Canvas 2D is not available.'));
  context.drawImage(source, 0, 0);

  return new Promise((resolve, reject) => {
    output.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('PNG encoding failed.'))), 'image/png');
  });
}
