import { useEffect, useRef, useState } from 'react'

type Props = { progressRef: React.MutableRefObject<number>; reducedMotion: boolean }

export function VideoScrubber({ progressRef, reducedMotion }: Props) {
  const ref = useRef<HTMLVideoElement>(null)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let raf = 0
    let last = -1
    const tick = () => {
      const v = ref.current
      if (v && v.duration && ready) {
        const p = reducedMotion ? Math.round(progressRef.current * 6) / 6 : progressRef.current
        const target = Math.min(v.duration - 0.04, Math.max(0.01, p * (v.duration - 0.05)))
        if (Math.abs(target - last) > 0.016) {
          v.currentTime = target
          last = target
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [progressRef, ready, reducedMotion])

  if (failed) return <div className="media-fallback"><span>PRODUCT MEDIA UNAVAILABLE</span><small>Add sneaker-optimized.glb to /public/model.</small></div>

  return (
    <div className="video-stage" aria-label="Scroll-scrub sneaker film fallback">
      <video ref={ref} muted playsInline preload="auto" onLoadedMetadata={() => setReady(true)} onError={() => setFailed(true)}>
        <source src={`${import.meta.env.BASE_URL}media/sneaker-reference.mp4`} type="video/mp4" />
      </video>
      {!ready && <div className="loading-ring" aria-label="Loading product media" />}
    </div>
  )
}
