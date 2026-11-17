import { useEffect, useRef, useState } from 'react'
import PhotoGallery from './PhotoGallery'
import { getPlacePhotos } from './googlePhotos'
import './GooglePhotoGallery.css'

function GooglePhoto({ photo, name, enabled }) {
  const [src, setSrc] = useState('')
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    if (enabled && !src) {
      try { setSrc(photo.getURI({ maxWidth: 1400, maxHeight: 1000 })) }
      catch { setFailed(true) }
    }
  }, [enabled, photo, src])
  return <>
    {failed ? <div className="google-photo-placeholder">This photo is unavailable.</div> : src ? <img src={src} alt={name} decoding="async" onError={() => setFailed(true)} /> : <div className="google-photo-placeholder">Loading photo…</div>}
    <figcaption className="google-photo-attribution">
      <span className="google-brand" translate="no">Google Maps</span>
      {(photo.authorAttributions || []).map((author, index) => author.uri ? <a key={index} href={author.uri} target="_blank" rel="noopener noreferrer">{author.displayName}</a> : <span key={index}>{author.displayName}</span>)}
      {photo.googleMapsURI && <a href={photo.googleMapsURI} target="_blank" rel="noopener noreferrer">View photo</a>}
      {photo.flagContentURI && <a href={photo.flagContentURI} target="_blank" rel="noopener noreferrer">Report</a>}
    </figcaption>
  </>
}

export default function GooglePhotoGallery({ name, destination }) {
  const root = useRef(null)
  const track = useRef(null)
  const [photos, setPhotos] = useState(null)
  const [status, setStatus] = useState('idle')
  const [active, setActive] = useState(0)
  const query = name.startsWith('Boca Chita') ? 'Boca Chita Key lighthouse Biscayne National Park Florida' : destination
  useEffect(() => {
    let cancelled = false
    async function load() {
      setStatus('loading')
      try { const result = await getPlacePhotos(query); if (!cancelled) { setPhotos(result); setStatus('ready') } }
      catch (error) {
        console.warn('Guest photo service:', String(error.message || error).replace(/AIza[\w-]+/g, '[redacted key]').replace(/key=[^&\s]+/g, 'key=[redacted]'))
        if (!cancelled) setStatus('error')
      }
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { observer.disconnect(); load() }
    }, { threshold: .1 })
    observer.observe(root.current)
    return () => { cancelled = true; observer.disconnect() }
  }, [query])
  useEffect(() => {
    if (!track.current) return
    const el = track.current
    let width = el.clientWidth
    const observer = new ResizeObserver(() => {
      if (width !== el.clientWidth) {
        const index = Math.round(el.scrollLeft / width)
        width = el.clientWidth
        el.scrollTo({ left: index * width, behavior: 'instant' })
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [photos])
  function go(index) {
    track.current.scrollTo({ left: Math.max(0, Math.min(photos.length - 1, index)) * track.current.clientWidth, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }
  return <div ref={root} className="google-gallery-shell">
    {photos ? <div className="photo-gallery" role="region" aria-label={`${name} Google Maps photos`}>
      <div className="photo-window">
        <div className="photo-track" ref={track} tabIndex={0} aria-label="Swipe or use arrow keys to browse Google photos"
          onScroll={() => setActive(Math.max(0, Math.min(photos.length - 1, Math.round(track.current.scrollLeft / track.current.clientWidth))))}
          onKeyDown={event => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); go(active + (event.key === 'ArrowRight' ? 1 : -1)) } }}>
          {photos.map((photo, index) => <figure key={index} className="photo-slide google-photo-slide" role="group" aria-label={`Photo ${index + 1} of ${photos.length}`}>
            <GooglePhoto photo={photo} name={name} enabled={index === active} />
          </figure>)}
        </div>
        <div className="photo-controls">
          <button onClick={() => go(active - 1)} disabled={active === 0} aria-label={`Previous photo of ${name}`}>←</button>
          <button onClick={() => go(active + 1)} disabled={active === photos.length - 1} aria-label={`Next photo of ${name}`}>→</button>
        </div>
      </div>
      <p className="photo-counter" aria-live="polite">{active + 1} / {photos.length} · Swipe for more photos</p>
    </div> : <>
      <PhotoGallery name={name} />
      <p className="google-photo-status" role="status">{status === 'error' ? 'Google photos are unavailable. Showing our backup gallery.' : status === 'loading' ? 'Loading Google Maps photos…' : ''}</p>
    </>}
  </div>
}
