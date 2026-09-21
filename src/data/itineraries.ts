interface Itinerary {
  id: string
  destination: string
  duration: string
  price: number
  description: string
  highlights: string[]
  imageUrl: string
}

export const itineraries: Itinerary[] = [
  {
    id: 'thailand',
    destination: 'Thailand',
    duration: '6 Nights / 7 Days',
    price: 34999,
    description: 'Explore the tropical paradise of Thailand with our comprehensive tour covering Bangkok, Phuket, and Coral Island.',
    highlights: [
      'Bangkok temple tours',
      'Phuket beaches',
      'Coral Island speedboat ride',
      'Thai cultural show',
      'Elephant sanctuary visit'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa'
  },
  {
    id: 'bali',
    destination: 'Bali',
    duration: '5 Nights / 6 Days',
    price: 42999,
    description: 'Experience the island of gods with stunning beaches, ancient temples, and lush rice terraces.',
    highlights: [
      'Uluwatu Temple tour',
      'Kuta Beach relaxation',
      'Tanah Lot sunset view',
      'Ubud Monkey Forest',
      'Seminyak shopping experience'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d6'
  },
  {
    id: 'vietnam',
    destination: 'Vietnam',
    duration: '7 Nights / 8 Days',
    price: 45999,
    description: 'Discover the charm of Vietnam from Hanoi to Ho Chi Minh City with our curated itinerary.',
    highlights: [
      'Ha Long Bay cruise',
      'Hanoi street food tour',
      'Hoi An ancient town',
      'Cu Chi Tunnels exploration',
      'Mekong Delta boat ride'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592'
  },
  {
    id: 'singapore',
    destination: 'Singapore',
    duration: '4 Nights / 5 Days',
    price: 47999,
    description: 'Experience the futuristic cityscapes and multicultural heritage of Singapore.',
    highlights: [
      'Marina Bay Sands SkyPark',
      'Gardens by the Bay',
      'Sentosa Island adventures',
      'Chinatown heritage tours',
      'Universal Studios Singapore'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1505761671935-60b3a7427eb9'
  },
  {
    id: 'malaysia',
    destination: 'Malaysia',
    duration: '5 Nights / 6 Days',
    price: 38999,
    description: 'Explore the vibrant mix of modernity and tradition in Kuala Lumpur and Langkawi.',
    highlights: [
      'Petronas Twin Towers',
      'Batu Caves exploration',
      'Langkawi island tours',
      'Genting Highlands cable car',
      'Malaysian cultural show'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f0a'
  },
  {
    id: 'custom',
    destination: 'Custom Package',
    duration: 'Tailored Itinerary',
    price: 0,
    description: 'Design your dream Southeast Asian adventure with our travel experts.',
    highlights: [
      'Personalized itinerary',
      'Flexible durations',
      'Multi-country options',
      'VIP experiences',
      'Customized activities'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1525935944571-4e992373d137'
  }
]