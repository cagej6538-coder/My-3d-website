const labels = ['ARRIVAL', 'PROFILE', 'MATERIAL', 'TRACTION', 'STRUCTURE', 'VELOCITY', '360°']

export function ProgressHUD({ progress, mode }: { progress: number; mode: 'model' | 'video' | 'checking' }) {
  const scene = Math.min(labels.length - 1, Math.floor(progress * labels.length))
  const pct = Math.round(progress * 100)
  return (
    <aside className="hud" aria-label="Scroll progress">
      <div className="hud-top"><span>01—07</span><span>{mode === 'model' ? '3D LIVE' : mode === 'video' ? 'FILM FALLBACK' : 'LOADING'}</span></div>
      <div className="hud-rail"><i style={{ transform: `scaleY(${Math.max(.015, progress)})` }} /></div>
      <div className="hud-bottom"><strong>{String(scene + 1).padStart(2, '0')}</strong><span>{labels[scene]}</span><em>{String(pct).padStart(3, '0')}%</em></div>
    </aside>
  )
}
