import { BufferGeometry, Float32BufferAttribute, Vector3 } from 'three';

/** Accumulates vertices and triangles, then emits a BufferGeometry with computed normals. */
export class MeshBuilder {
  private readonly positions: number[] = [];
  private readonly indices: number[] = [];

  addVertex(point: Vector3): number {
    this.positions.push(point.x, point.y, point.z);
    return this.positions.length / 3 - 1;
  }

  addTriangle(first: number, second: number, third: number): void {
    this.indices.push(first, second, third);
  }

  /** Gives the triangle its own vertices so it shades as a single flat facet. */
  addFacet(first: Vector3, second: Vector3, third: Vector3): void {
    this.addTriangle(this.addVertex(first), this.addVertex(second), this.addVertex(third));
  }

  build(): BufferGeometry {
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(this.positions, 3));
    geometry.setIndex(this.indices);
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();
    return geometry;
  }
}
