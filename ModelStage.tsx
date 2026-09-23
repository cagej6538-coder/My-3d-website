import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Float } from '@react-three/drei'
import { Suspense, useRef } from 'react'
import * as THREE from 'three'
import { ProductModel } from './ProductModel'
import { sampleKeyframes } from '../lib/math'

type Props = { progressRef: React.MutableRefObject<number>; reducedMotion: boolean }

function CameraRig({ progressRef, reducedMotion }: Props) {
  const { camera } = useThree()
  const lookAt = useRef(new THREE.Vector3())
  useFrame((_, dt) => {
    const s = sampleKeyframes(reducedMotion ? Math.round(progressRef.current * 6) / 6 : progressRef.current)
    const k = 1 - Math.exp(-dt * 5.5)
    camera.position.lerp(new THREE.Vector3(...s.camera), k)
    lookAt.current.lerp(new THREE.Vector3(...s.target), k)
    camera.lookAt(lookAt.current)
  })
  return null
}

function Lights({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const red = useRef<THREE.SpotLight>(null)
  const key = useRef<THREE.SpotLight>(null)
  useFrame(() => {
    const p = progressRef.current
    if (red.current) red.current.intensity = 32 + Math.sin(p * Math.PI * 5) * 10
    if (key.current) key.current.intensity = 62 + Math.cos(p * Math.PI * 3) * 14
  })
  return <>
    <ambientLight intensity={0.13} />
    <hemisphereLight intensity={0.5} color="#dbe9f1" groundColor="#170908" />
    <spotLight ref={key} position={[4, 6, 4]} intensity={65} angle={0.28} penumbra={0.9} castShadow color="#f5fbff" />
    <spotLight ref={red} position={[-4, 1, 2]} intensity={38} angle={0.36} penumbra={1} color="#ff4f44" />
    <pointLight position={[0, -2, -3]} intensity={11} color="#ff3b30" />
  </>
}

export function ModelStage(props: Props) {
  return (
    <div className="model-stage" aria-label="Interactive 3D sneaker">
      <Canvas shadows dpr={[1, 1.75]} camera={{ fov: 32, near: 0.1, far: 100, position: [0, .5, 6.3] }} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>
        <fog attach="fog" args={['#07090b', 7, 16]} />
        <Suspense fallback={null}>
          <CameraRig {...props} />
          <Lights progressRef={props.progressRef} />
          <Float speed={props.reducedMotion ? 0 : 0.65} rotationIntensity={0.04} floatIntensity={0.10}>
            <ProductModel {...props} />
          </Float>
          <ContactShadows position={[0, -1.2, 0]} scale={7} opacity={0.72} blur={2.4} far={3.5} />
        </Suspense>
      </Canvas>
    </div>
  )
}
