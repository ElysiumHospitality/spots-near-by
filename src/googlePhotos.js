let libraryPromise

export function loadPlaces() {
  if (libraryPromise) return libraryPromise
  libraryPromise = new Promise((resolve, reject) => {
    const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    if (!key) { reject(new Error('Google photo key is not configured.')); return }
    const timeout = window.setTimeout(() => reject(new Error('Google photos timed out.')), 20000)
    window.gm_authFailure = () => { clearTimeout(timeout); reject(new Error('Google Maps authorization failed.')) }
    window.initGuestPhotos = async () => {
      try { const library = await window.google.maps.importLibrary('places'); clearTimeout(timeout); resolve(library) }
      catch { clearTimeout(timeout); reject(new Error('Google Places could not be loaded.')) }
    }
    const script = document.createElement('script')
    const params = new URLSearchParams({ key, loading: 'async', callback: 'initGuestPhotos', v: 'weekly' })
    script.src = `https://maps.googleapis.com/maps/api/js?${params}`
    script.async = true
    script.onerror = () => { clearTimeout(timeout); reject(new Error('Google photos could not connect.')) }
    document.head.appendChild(script)
  })
  return libraryPromise
}

export async function getPlacePhotos(query) {
  const { Place } = await loadPlaces()
  // Search for the attraction only; never send the guest property's address.
  const { places } = await Place.searchByText({ textQuery: query, fields: ['id'], maxResultCount: 1 })
  if (!places.length) throw new Error('No matching attraction found.')
  const place = new Place({ id: places[0].id })
  await place.fetchFields({ fields: ['photos'] })
  const photos = place.photos || []
  if (!photos.length) throw new Error('No Google photos available.')
  // Prefer landscape images that fit the wide gallery, retaining Google's order otherwise.
  return [...photos].sort((a, b) => Number(b.widthPx >= b.heightPx) - Number(a.widthPx >= a.heightPx)).slice(0, 4)
}
