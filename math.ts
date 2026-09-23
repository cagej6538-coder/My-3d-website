import * as THREE from 'three'

export type Keyframe = {
  at: number
  position: [number, number, number]
  rotation: [number, number, number]
  scale: number
  camera: [number, number, number]
  target: [number, number, number]
}

export const keyframes: Keyframe[] = [
  { at: 0.00, position: [0.25, -0.22, 0], rotation: [-0.10, -0.58, -0.10], scale: 1.02, camera: [0.0, 0.5, 6.3], target: [0, 0, 0] },
  { at: 0.16, position: [-0.30, -0.12, 0.15], rotation: [-0.18, 0.18, -0.05], scale: 1.20, camera: [2.5, 0.95, 4.4], target: [-0.15, 0.0, 0] },
  { at: 0.33, position: [0.10, 0.02, -0.10], rotation: [0.22, -1.18, 0.05], scale: 1.54, camera: [-2.8, 0.35, 3.45], target: [0.1, 0.05, 0] },
  { at: 0.50, position: [-0.18, 0.14, 0.10], rotation: [-0.40, 2.15, 0.18], scale: 1.48, camera: [0.0, -1.35, 3.2], target: [0, -0.12, 0] },
  { at: 0.66, position: [0.20, -0.18, 0.0], rotation: [0.12, 2.95, -0.08], scale: 1.28, camera: [3.0, 1.7, 4.0], target: [0.1, 0.0, 0] },
  { at: 0.83, position: [-0.04, -0.08, 0], rotation: [-0.10, 4.05, 0], scale: 1.12, camera: [-3.2, 0.75, 4.3], target: [0, 0, 0] },
  { at: 1.00, position: [0, -0.08, 0], rotation: [-0.08, Math.PI * 2 + 0.24, 0], scale: 1.08, camera: [0, 0.45, 6.0], target: [0, 0, 0] },
]

const ease = (t: number) => t * t * (3 - 2 * t)

export function sampleKeyframes(progress: number) {
  const p = THREE.MathUtils.clamp(progress, 0, 1)
  let i = 0
  while (i < keyframes.length - 2 && p > keyframes[i + 1].at) i++
  const a = keyframes[i]
  const b = keyframes[i + 1]
  const raw = (p - a.at) / Math.max(0.0001, b.at - a.at)
  const t = ease(THREE.MathUtils.clamp(raw, 0, 1))
  const lerp3 = (x: [number, number, number], y: [number, number, number]) => [
    THREE.MathUtils.lerp(x[0], y[0], t),
    THREE.MathUtils.lerp(x[1], y[1], t),
    THREE.MathUtils.lerp(x[2], y[2], t),
  ] as [number, number, number]
  return {
    position: lerp3(a.position, b.position),
    rotation: lerp3(a.rotation, b.rotation),
    scale: THREE.MathUtils.lerp(a.scale, b.scale, t),
    camera: lerp3(a.camera, b.camera),
    target: lerp3(a.target, b.target),
  }
}
