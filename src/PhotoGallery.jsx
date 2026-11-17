import { useRef, useState } from 'react'
import galleries from './galleries.json'
import credits from './photo-credits.json'
import './PhotoGallery.css'

export default function PhotoGallery({ name }) {
  const photos = galleries[name] || []
  const track = useRef(null)
  const [active, setActive] = useState(0)
  function go(index) {
    const el = track.current
    el.scrollTo({ left: Math.max(0, Math.min(photos.length - 1, index)) * el.clientWidth, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }
  return <div className="photo-gallery" role="region" aria-label={`${name} photos`}>
    <div className="photo-window">
    <div className="photo-track" ref={track} tabIndex={0} aria-label="Swipe or use arrow keys to browse photos"
      onScroll={() => { const el = track.current; setActive(Math.round(el.scrollLeft / el.clientWidth)) }}
      onKeyDown={event => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
          event.preventDefault()
          go(Math.max(0, Math.min(photos.length - 1, active + (event.key === 'ArrowRight' ? 1 : -1))))
        }
      }}>
      {photos.map((photo, index) => {
        return <figure key={photo.src} className="photo-slide" role="group" aria-label={`Photo ${index + 1} of ${photos.length}`}>
          <img src={`${import.meta.env.BASE_URL}${photo.src}`} alt={photo.alt} loading="lazy" decoding="async" />
        </figure>
      })}
    </div>
    <div className="photo-controls">
      <button type="button" onClick={() => go(active - 1)} disabled={active === 0} aria-label={`Previous photo of ${name}`}>←</button>

      <button type="button" onClick={() => go(active + 1)} disabled={active >= photos.length - 1} aria-label={`Next photo of ${name}`}>→</button>
    </div>
    </div>
    <details className="photo-credits"><summary>Photo credits</summary>
      {photos.map((photo, index) => {
        const credit = credits.find(c => c.file === photo.src && c.place === name)
        return credit && <p key={photo.src}>{index + 1}. {photo.caption} — <a href={credit.source} target="_blank" rel="noopener noreferrer">{credit.author}</a> · {credit.licenseUrl ? <a href={credit.licenseUrl} target="_blank" rel="noopener noreferrer">{credit.license}</a> : credit.license} · Cropped to fit</p>
      })}
    </details>
    <p className="photo-counter" aria-live="polite">{active + 1} / {photos.length} · Swipe for more photos</p>
  </div>
}
