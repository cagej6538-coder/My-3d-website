import { useEffect, useMemo, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { sampleKeyframes } from '../lib/math'

type Props = { progressRef: React.MutableRefObject<number>; reducedMotion: boolean }

export function ProductModel({ progressRef, reducedMotion }: Props) {
  const group = useRef<THREE.Group>(null)
  const gltf = useGLTF(`${import.meta.env.BASE_URL}model/sneaker-optimized.glb`)
  const scene = useMemo(() => {
    const clone = gltf.scene.clone(true)
    const bounds = new THREE.Box3().setFromObject(clone)
    const size = bounds.getSize(new THREE.Vector3())
    const center = bounds.getCenter(new THREE.Vector3())
    const maxAxis = Math.max(size.x, size.y, size.z)
    if (Number.isFinite(maxAxis) && maxAxis > 0) {
      clone.position.sub(center)
      clone.scale.setScalar(3.0 / maxAxis)
    }
    return clone
  }, [gltf.scene])

  useEffect(() => {
    scene.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return
      obj.castShadow = true
      obj.receiveShadow = true
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
      mats.forEach((mat) => {
        if ('envMapIntensity' in mat) (mat as THREE.MeshStandardMaterial).envMapIntensity = 1.35
        if ('roughness' in mat) (mat as THREE.MeshStandardMaterial).roughness = Math.max(0.22, (mat as THREE.MeshStandardMaterial).roughness ?? 0.5)
      })
    })
  }, [scene])

  useFrame((_, dt) => {
    if (!group.current) return
    const s = sampleKeyframes(reducedMotion ? Math.round(progressRef.current * 6) / 6 : progressRef.current)
    const speed = 1 - Math.exp(-dt * 7.5)
    group.current.position.lerp(new THREE.Vector3(...s.position), speed)
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, s.rotation[0], speed)
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, s.rotation[1], speed)
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, s.rotation[2], speed)
    const targetScale = new THREE.Vector3(s.scale, s.scale, s.scale)
    group.current.scale.lerp(targetScale, speed)
  })

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  )
}

