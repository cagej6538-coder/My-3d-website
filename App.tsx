import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ModelStage } from './components/ModelStage'
import { VideoScrubber } from './components/VideoScrubber'
import { ProgressHUD } from './components/ProgressHUD'
import { SceneBoundary } from './components/SceneBoundary'

gsap.registerPlugin(ScrollTrigger)

type Mode = 'checking' | 'model' | 'video'

const scenes = [
  { n: '01', kicker: 'AERO / 01', title: 'ENGINEERED\nIN MOTION', note: 'Scroll to inspect', align: 'left' },
  { n: '02', kicker: 'PROFILE', title: 'CUT THROUGH\nTHE AIR', note: 'Sculpted geometry', align: 'right' },
  { n: '03', kicker: 'UPPER', title: 'AIR WHERE\nIT MATTERS', note: 'Engineered mesh', align: 'left' },
  { n: '04', kicker: 'GROUND', title: 'GRIP WITH\nINTENT', note: 'Macro outsole study', align: 'right' },
  { n: '05', kicker: 'CHASSIS', title: 'SOFT LANDING.\nFAST EXIT.', note: 'Responsive structure', align: 'left' },
  { n: '06', kicker: 'PACE', title: 'BUILT FOR\nFORWARD', note: 'Zero wasted motion', align: 'right' },
  { n: '07', kicker: 'FULL VIEW', title: 'EVERY ANGLE.\nONE OBJECTIVE.', note: 'Complete 360°', align: 'left' },
]

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const q = matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(q.matches)
    sync(); q.addEventListener('change', sync)
    return () => q.removeEventListener('change', sync)
  }, [])
  return reduced
}

async function modelExists() {
  try {
    const r = await fetch(`${import.meta.env.BASE_URL}model/sneaker-optimized.glb`, { method: 'HEAD', cache: 'no-store' })
    const type = r.headers.get('content-type') || ''
    return r.ok && !type.includes('text/html')
  } catch { return false }
}

export default function App() {
  const root = useRef<HTMLDivElement>(null)
  const progressRef = useRef(0)
  const [progress, setProgress] = useState(0)
  const [mode, setMode] = useState<Mode>('checking')
  const reducedMotion = useReducedMotion()

  useEffect(() => { modelExists().then((ok) => setMode(ok ? 'model' : 'video')) }, [])

  useLayoutEffect(() => {
    if (!root.current) return
    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>('.scene')
      sections.forEach((section) => {
        const copy = section.querySelector('.scene-copy')
        const rule = section.querySelector('.scene-rule')
        gsap.fromTo(copy, { opacity: 0, y: 28 }, {
          opacity: 1, y: 0, duration: .6, ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 58%', end: 'top 22%', scrub: reducedMotion ? false : .6 },
        })
        gsap.fromTo(rule, { scaleX: 0 }, {
          scaleX: 1, transformOrigin: 'left', ease: 'none',
          scrollTrigger: { trigger: section, start: 'top 62%', end: 'top 35%', scrub: reducedMotion ? false : .5 },
        })
      })
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: reducedMotion ? false : 0.25,
        onUpdate: (self) => {
          progressRef.current = self.progress
          setProgress(self.progress)
          document.documentElement.style.setProperty('--p', String(self.progress))
          const targets = [11, -11, 11, -11, 11, -11, 0]
          const scaled = self.progress * (targets.length - 1)
          const a = Math.min(targets.length - 1, Math.floor(scaled))
          const b = Math.min(targets.length - 1, a + 1)
          const t = scaled - a
          const smooth = t * t * (3 - 2 * t)
          const shift = targets[a] + (targets[b] - targets[a]) * smooth
          document.documentElement.style.setProperty('--product-shift', `${shift}vw`)
        },
      })
    }, root)
    return () => ctx.revert()
  }, [reducedMotion])

  const stage = useMemo(() => {
    if (mode === 'model') return <SceneBoundary onError={() => setMode('video')}><ModelStage progressRef={progressRef} reducedMotion={reducedMotion} /></SceneBoundary>
    return <VideoScrubber progressRef={progressRef} reducedMotion={reducedMotion} />
  }, [mode, reducedMotion])

  return (
    <div className="app" ref={root}>
      <div className="stage-shell">
        <div className="ambient ambient-a" />
        <div className="ambient ambient-b" />
        {stage}
        <div className="vignette" />
        <div className="grain" />
        <div className="edge-brand"><span>AERO</span><span>PERFORMANCE SYSTEM / 01</span></div>
        <ProgressHUD progress={progress} mode={mode} />
      </div>

      <header className="topbar">
        <a className="mark" href="#scene-1" aria-label="Aero home">A<span>/</span>01</a>
        <div className="top-meta"><span>PERFORMANCE LAB</span><span>MMXXVI</span></div>
      </header>

      <main>
        {scenes.map((s, i) => (
          <section className={`scene scene-${s.align}`} id={`scene-${i + 1}`} key={s.n}>
            <div className="scene-copy">
              <div className="scene-kicker"><b>{s.n}</b><span>{s.kicker}</span></div>
              <h1>{s.title.split('\n').map((line) => <span key={line}>{line}</span>)}</h1>
              <div className="scene-rule" />
              <p>{s.note}</p>
            </div>
          </section>
        ))}
      </main>

      <footer className="footer">
        <div><span>FORM</span><strong>01</strong></div>
        <p>Designed for speed.<br/>Presented without distraction.</p>
        <button onClick={() => scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })}>REPLAY ↑</button>
      </footer>
    </div>
  )
}
