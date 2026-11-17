import { useEffect, useRef, useState } from 'react'
import './App.css'
import PhotoGallery from './PhotoGallery'

const startingPoint = '25888 SW 139th Path, Homestead, FL 33032'

function directionsUrl(destination) {
  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(startingPoint)}&destination=${encodeURIComponent(destination)}&travelmode=driving`
}

const places = [
  {
    "name": "Coral Castle",
    "drive": "10–15 min",
    "ToDo": "Explore a remarkable garden of hand-carved limestone sculptures and discover the story of the man who built them. A fascinating local stop filled with unusual shapes and history.",
    "destination": "Coral Castle, 28655 S Dixie Highway, Homestead FL",
    "website": "https://coralcastle.com/visit/"
  },
  {
    "name": "Fruit & Spice Park",
    "drive": "15–20 min",
    "ToDo": "Slow down and wander among tropical fruit trees, fragrant spices, and lush greenery. This peaceful garden offers a taste of South Florida’s agricultural heritage.",
    "destination": "Fruit and Spice Park, 24801 SW 187th Avenue, Homestead FL",
    "website": "https://www.miamidade.gov/fruitandspicepark/plan-your-visit.page"
  },
  {
    "name": "Black Point Park & Marina",
    "drive": "15–25 min",
    "ToDo": "Enjoy a waterfront stroll, watch boats come and go, and settle in for a meal by the marina. An easy spot for a relaxed afternoon near Biscayne Bay.",
    "destination": "Black Point Park and Marina, 24775 SW 87th Avenue, Homestead FL",
    "website": "https://www.miamidade.gov/parks/black-point-marina.asp"
  },
  {
    "name": "Robert Is Here",
    "drive": "20–30 min",
    "ToDo": "Treat yourself to a tropical fruit milkshake at this beloved local fruit stand. Browse fresh produce and bring home something delicious after a day of exploring.",
    "destination": "Robert Is Here, 19200 SW 344th Street, Homestead FL",
    "website": "https://www.robertishere.com/"
  },
  {
    "name": "Schnebly Redland’s Winery",
    "drive": "20–30 min",
    "ToDo": "Sip wines made from tropical fruits while relaxing among gardens and waterfalls. A lovely choice for a laid-back afternoon or a couples’ outing.",
    "note": "Check tasting reservations and arrange a designated driver. Wine tastings are for guests 21 and over.",
    "destination": "Schnebly Redlands Winery, 30205 SW 217th Avenue, Homestead FL",
    "website": "https://www.schneblywinery.com/"
  },
  {
    "name": "R. F. Orchids",
    "drive": "15–20 min",
    "ToDo": "Step into a colorful world of orchids and tropical plants at this specialty nursery. Browse the blooms, find a unique gift, or ask about reserving a garden tour.",
    "destination": "R F Orchids, 28100 SW 182nd Avenue, Homestead FL",
    "website": "https://rforchids.com/faq/"
  },
  {
    "name": "Homestead Bayfront Park",
    "drive": "20–30 min",
    "ToDo": "Pack a picnic and unwind beside Biscayne Bay. The park’s atoll beach and waterfront setting make it a pleasant place to enjoy the South Florida sunshine.",
    "note": "Check park hours and swimming advisories before visiting.",
    "destination": "Homestead Bayfront Park, 9698 SW 328th Street, Homestead FL",
    "website": "https://www.miamidade.gov/global/recreation/park/homestead-bayfront-park.page"
  },
  {
    "name": "Zoo Miami",
    "drive": "30–40 min",
    "ToDo": "Spend the day discovering animals from around the world in spacious outdoor habitats. Bring comfortable shoes and take your time exploring this family-friendly destination.",
    "destination": "Zoo Miami, 12400 SW 152nd Street, Miami FL",
    "website": "https://www.zoomiami.org/know-before-you-visit"
  },
  {
    "name": "Everglades Alligator Farm",
    "drive": "25–35 min",
    "ToDo": "Add some adventure to your stay with an airboat ride and a closer look at Florida’s famous reptiles. Wildlife presentations and animal exhibits round out the visit.",
    "destination": "Everglades Alligator Farm, 40351 SW 192nd Avenue, Homestead FL",
    "website": "https://www.everglades.com/plan-your-visit"
  },
  {
    "name": "Anhinga Trail — Everglades National Park",
    "drive": "40–45 min",
    "ToDo": "Follow a short boardwalk through the marsh and watch for alligators, turtles, and wading birds. A memorable introduction to the wild beauty of the Everglades.",
    "destination": "Anhinga Trail, Royal Palm Visitor Center, Everglades National Park, Florida",
    "website": "https://www.nps.gov/ever/planyourvisit/anhinga-trail.htm"
  },
  {
    "name": "Boca Chita Key — Biscayne National Park",
    "drive": "20–25 min to the dock",
    "ToDo": "Leave the mainland behind on a boat excursion across Biscayne Bay. Explore an island known for its picturesque lighthouse and sweeping waterfront views.",
    "note": "This drive estimate ends at the Dante Fascell Visitor Center dock. Boat travel is additional; reserve a tour and confirm its departure location.",
    "destination": "Dante Fascell Visitor Center, 9700 SW 328th Street, Homestead FL",
    "website": "https://www.biscaynenationalparkinstitute.org/"
  },
  {
    "name": "Deering Estate",
    "drive": "35–45 min",
    "ToDo": "Discover a quieter side of South Florida where historic grounds meet the bay. Enjoy coastal scenery and check the calendar for guided walks and special experiences.",
    "destination": "Deering Estate, 16701 SW 72nd Avenue, Palmetto Bay FL",
    "website": "https://deeringestate.org/visit/plan-your-visit/"
  },
  {
    "name": "Vizcaya Museum & Gardens",
    "drive": "75–90 min with traffic",
    "ToDo": "Explore an elegant waterfront mansion surrounded by formal gardens and ornate stonework. This scenic Miami escape is a lovely choice for architecture lovers and photographers.",
    "note": "This range reflects crashes and slowdowns when checked on November 17, 2026, not a typical everyday drive. Check live directions before leaving.",
    "destination": "Vizcaya Museum and Gardens, 3251 South Miami Avenue, Miami FL",
    "website": "https://vizcaya.org/visit-2/planning-your-visit/"
  },
  {
    "name": "John Pennekamp Coral Reef State Park",
    "drive": "45–55 min",
    "ToDo": "Make a day trip to Key Largo and discover the underwater side of the Florida Keys. Book a snorkeling excursion or glass-bottom boat tour to experience the reef.",
    "note": "Check current park conditions and reserve boat excursions ahead.",
    "destination": "John Pennekamp Coral Reef State Park, 102601 Overseas Highway, Key Largo FL",
    "website": "https://www.floridastateparks.org/parks-and-trails/john-pennekamp-coral-reef-state-park"
  }
]

function Place({ place, number }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
        } else {
          setVisible(false)
        }
      },
      { threshold: 0.15 },
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className={`place ${visible ? 'visible' : ''}`}
    >
      <div className="spot-heading"><span>STOP {number}</span>
      <h2>{place.name}</h2>
      <p>Estimated drive from your stay: {place.drive}</p>
      </div>
      <PhotoGallery name={place.name} />
      <div className="spot-details">
      <p>{place.ToDo}</p>
      {place.note && <p>{place.note}</p>}
      {place.destination && <p><a href={directionsUrl(place.destination)} target="_blank" rel="noopener noreferrer">Directions from your stay ↗</a></p>}
      {place.website && <p><a href={place.website} target="_blank" rel="noopener noreferrer">Visit Website ↗</a></p>}
      </div>
    </section>
  )
}

export default function App() {
  return (
    <main>
      <header className="intro">
        <h1>Explore Homestead</h1>
        <p>Explore 14 places near your stay. Scroll down to discover your next stop ↓</p>
        <p>Drive estimates start at {startingPoint}.</p>
        <p>Planning ranges based on Google Maps routes checked November 17, 2026. Traffic varies; some routes include tolls. Open directions for current travel times.</p>
      </header>

      {places.map((place, index) => (
        <Place key={place.name} place={place} number={index + 1} />
      ))}

    </main>
  )
}