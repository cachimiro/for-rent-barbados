export interface SeasonalPrice {
  season: string;
  label: string;
  dateRange: string;
  pricePerNight: number;
}

export interface Review {
  author: string;
  property: string;
  date: string;
  body: string;
  rating: number;
  source?: "airbnb" | "google" | "direct";
}

export interface Property {
  slug: string;
  name: string;
  location: string;
  guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  description: string;
  welcomePack?: string;
  pricing: SeasonalPrice[];
  images: string[];
  coverImage: string;
  reviews: Review[];
  featured?: boolean;
}

export const reviews: Review[] = [
  {
    author: "Lizzie",
    property: "Westmoreland Hills 35",
    date: "2025",
    rating: 5,
    source: "airbnb",
    body: "Spent 3 weeks in this beautiful villa. It exceeded our expectations to the full. Felt at home from start to finish. It was immaculate, peaceful, the beds so comfortable, great kitchen and gorgeous pool and outdoor space fantastic!! A big thank you to Maisha, Marium and all the team for making our stay exceptional from the cleaners, car rental and for organising a great chef — Jamal who cooked the most amazing food for us and all our family and friends. All in all fabulous and can't wait to return.",
  },
  {
    author: "Lola",
    property: "Azzurro 03",
    date: "2025",
    rating: 5,
    source: "airbnb",
    body: "We enjoyed our stay! Thank you for all the proactive responses, and assistance with whatever we needed. The house is as described and we would definitely recommend. Thank you Maisha for the snack basket, hospitality and the excellent communication and service.",
  },
  {
    author: "Teri",
    property: "Coral Beach 105",
    date: "2025",
    rating: 5,
    source: "airbnb",
    body: "Really enjoyed our stay. The place is nice and spacious and worth every penny. We especially enjoyed the pool area. No complaints 🙂",
  },
  {
    author: "Regine",
    property: "Azzurro 03",
    date: "March 2025",
    rating: 5,
    source: "airbnb",
    body: "Maisha was an amazing host with a very quick response time. The property was beautiful — just like the pictures — and located in a quiet, peaceful neighborhood. The only small hiccup was that, since it's such a new property, some drivers had trouble finding it. I definitely recommend getting a rental car for convenience.",
  },
  {
    author: "Laura",
    property: "Azzurro 03",
    date: "March 2025",
    rating: 5,
    source: "airbnb",
    body: "Wow! Everything was perfect, and our host was so helpful from the moment we booked to the moment we arrived on the island to the moment we left. It was very apparent that a lot of thought went into every detail of this property to make the whole experience amazing. I highly recommend to anyone looking for a relaxing vacation to immediately book your stay at this wonderful and beautiful property!",
  },
];

export const properties: Property[] = [
  {
    slug: "azzurro-03-3-bed",
    name: "Azzurro 03 – 3 BED",
    featured: true,
    location: "Porters, St. James",
    guests: 6,
    bedrooms: 3,
    beds: 3,
    bathrooms: 3,
    coverImage: "/assets/properties/AZZ-3-AIRBNB-COVER-605x605.png",
    images: [
      "/assets/properties/Azzurro-3-5-scaled.jpg",
      "/assets/properties/Azzurro-3-6-scaled.jpg",
      "/assets/properties/Azzurro-3-3-scaled.jpg",
      "/assets/properties/Azzurro-3-1-scaled.jpg",
      "/assets/properties/Azzurro-3-4-scaled.jpg",
      "/assets/properties/Azzurro-3-2-scaled.jpg",
      "/assets/properties/Azzurro-3-7-scaled.jpg",
      "/assets/properties/Azzurro-3-9-scaled.jpg",
      "/assets/properties/Azzurro-3-10-scaled.jpg",
    ],
    welcomePack: "Enjoy a complimentary welcome pack with snacks to make you feel right at home from the moment you arrive!",
    pricing: [
      { season: "summer",    label: "Summer Season",    dateRange: "April 15th – December 15th",          pricePerNight: 438 },
      { season: "winter",    label: "Winter Season",    dateRange: "Dec 15th–20th & Jan 10th – Apr 15th", pricePerNight: 550 },
      { season: "christmas", label: "Christmas Season", dateRange: "December 20th – January 10th",        pricePerNight: 850 },
    ],
    description: "Nestled in the heart of Barbados' prestigious West Coast, Azzurro is a stunning collection of 12 luxurious three-bedroom townhouses in Porters, St. James. Just a stone's throw from the pristine beach and crystal-clear ocean, this development epitomizes the perfect holiday retreat, where every unit boasts a private terrace and plunge pool.\n\nWelcome to Azzurro 03, an exquisite three-bedroom, three-bathroom townhouse that invites you to experience the ultimate in Caribbean luxury. Designed with meticulous attention to detail, this elegant home features recessed ceiling details, suspended lights, and expansive trifold doors that seamlessly blend indoor and outdoor living. The spacious covered patio, complete with a private pool and a serene waterfall feature, is your ideal spot for al fresco dining and unwinding amidst lush, tropical vegetation.",
    reviews: reviews.filter((r) => r.property === "Azzurro 03"),
  },
  {
    slug: "azzurro-03-2-bed",
    name: "Azzurro 03 – 2 BED",
    location: "Porters, St. James",
    guests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    coverImage: "/assets/properties/AZZ-3-AIRBNB-COVER-1.png",
    images: ["/assets/properties/AZZ-3-AIRBNB-COVER-1.png"],
    pricing: [
      { season: "summer", label: "Summer Season", dateRange: "April 15th – December 15th", pricePerNight: 394 },
    ],
    description: "A beautifully appointed two-bedroom unit within the Azzurro complex on Barbados' prestigious West Coast.",
    reviews: [],
  },
  {
    slug: "westmoreland-hill-35-4-bed",
    name: "Westmoreland Hill 35 – 4 BED",
    featured: true,
    location: "Westmoreland, St. James",
    guests: 8,
    bedrooms: 4,
    beds: 4,
    bathrooms: 4.5,
    coverImage: "/assets/properties/Westmoreland-Hills-35-26-605x605.jpg",
    images: [
      "/assets/properties/Westmoreland-Hills-35-1.jpg",
      "/assets/properties/Westmoreland-Hills-35-6.jpg",
      "/assets/properties/Westmoreland-Hills-35-8.jpg",
      "/assets/properties/Westmoreland-Hills-35-10.jpg",
      "/assets/properties/Westmoreland-Hills-35-11.jpg",
      "/assets/properties/Westmoreland-Hills-35-12.jpg",
      "/assets/properties/Westmoreland-Hills-35-13.jpg",
      "/assets/properties/Westmoreland-Hills-35-14.jpg",
    ],
    pricing: [
      { season: "summer",    label: "Summer Season",    dateRange: "April 15th – December 15th",          pricePerNight: 700 },
      { season: "winter",    label: "Winter Season",    dateRange: "Dec 15th–20th & Jan 10th – Apr 15th", pricePerNight: 900 },
      { season: "christmas", label: "Christmas Season", dateRange: "December 20th – January 10th",        pricePerNight: 1200 },
    ],
    description: "A spectacular four-bedroom villa in the exclusive Westmoreland Hills community on Barbados' Gold Coast. This stunning property offers breathtaking ocean views, a private pool, and access to world-class amenities.",
    reviews: reviews.filter((r) => r.property === "Westmoreland Hills 35"),
  },
  {
    slug: "westmoreland-hill-35-3-bed",
    name: "Westmoreland Hill 35 – 3 BED",
    location: "Westmoreland, St. James",
    guests: 6,
    bedrooms: 3,
    beds: 3,
    bathrooms: 3.5,
    coverImage: "/assets/properties/Westmoreland-Hills-35-19.jpg",
    images: ["/assets/properties/Westmoreland-Hills-35-19.jpg", "/assets/properties/Westmoreland-Hills-35-18.jpg"],
    pricing: [
      { season: "summer", label: "Summer Season", dateRange: "April 15th – December 15th", pricePerNight: 600 },
    ],
    description: "Three-bedroom configuration of the Westmoreland Hill 35 villa, offering the same stunning views and luxury finishes.",
    reviews: [],
  },
  {
    slug: "coral-beach-105",
    name: "Coral Beach 105 – 1 BED",
    location: "Coral Beach, St. James",
    guests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    coverImage: "/assets/properties/Steps-to-the-Mullins-Beach.png",
    images: ["/assets/properties/Steps-to-the-Mullins-Beach.png"],
    pricing: [
      { season: "summer", label: "Summer Season", dateRange: "April 15th – December 15th", pricePerNight: 188 },
    ],
    description: "A charming one-bedroom apartment steps from the beautiful Coral Beach on Barbados' West Coast.",
    reviews: reviews.filter((r) => r.property === "Coral Beach 105"),
  },
  {
    slug: "coral-beach-105-2",
    name: "Coral Beach 105 – 2 BED",
    location: "Coral Beach, St. James",
    guests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    coverImage: "/assets/properties/Steps-to-the-Mullins-Beach.png",
    images: ["/assets/properties/Steps-to-the-Mullins-Beach.png"],
    pricing: [
      { season: "summer", label: "Summer Season", dateRange: "April 15th – December 15th", pricePerNight: 200 },
    ],
    description: "A spacious two-bedroom apartment at Coral Beach, perfect for families or couples travelling together.",
    reviews: [],
  },
  {
    slug: "lantana-44-2-bed",
    name: "Lantana 44 – 2 BED",
    location: "St. James",
    guests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    coverImage: "/assets/properties/lantana-44-4-scaled.jpg",
    images: ["/assets/properties/lantana-44-4-scaled.jpg"],
    pricing: [
      { season: "summer", label: "Summer Season", dateRange: "April 15th – December 15th", pricePerNight: 160 },
    ],
    description: "A lovely two-bedroom villa at Lantana, offering a peaceful retreat on Barbados' West Coast.",
    reviews: [],
  },
  {
    slug: "lantana-44-3-bed",
    name: "Lantana 44 – 3 BED",
    location: "St. James",
    guests: 6,
    bedrooms: 3,
    beds: 3,
    bathrooms: 2,
    coverImage: "/assets/properties/lantana-44-4-scaled.jpg",
    images: ["/assets/properties/lantana-44-4-scaled.jpg"],
    pricing: [
      { season: "summer", label: "Summer Season", dateRange: "April 15th – December 15th", pricePerNight: 185 },
    ],
    description: "Three-bedroom configuration of the Lantana 44 villa, ideal for larger groups.",
    reviews: [],
  },
  {
    slug: "turtle-view-3-bed",
    name: "Turtle View – 3 BED",
    location: "St. James",
    guests: 6,
    bedrooms: 3,
    beds: 3,
    bathrooms: 2,
    coverImage: "/assets/properties/turtle-8-scaled.jpg",
    images: ["/assets/properties/turtle-8-scaled.jpg", "/assets/properties/turtle-26-scaled.jpg"],
    pricing: [
      { season: "summer", label: "Summer Season", dateRange: "April 15th – December 15th", pricePerNight: 263 },
    ],
    description: "Stunning three-bedroom villa with panoramic views, named for the sea turtles that frequent the nearby waters.",
    reviews: [],
  },
  {
    slug: "turtle-view-2-bed",
    name: "Turtle View – 2 BED",
    location: "St. James",
    guests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    coverImage: "/assets/properties/turtle-8-scaled.jpg",
    images: ["/assets/properties/turtle-8-scaled.jpg"],
    pricing: [
      { season: "summer", label: "Summer Season", dateRange: "April 15th – December 15th", pricePerNight: 185 },
    ],
    description: "Two-bedroom configuration of the Turtle View villa.",
    reviews: [],
  },
  {
    slug: "westmoreland-hill-13-2-bed",
    name: "Westmoreland Hill 13 – 2 BED",
    location: "Westmoreland, St. James",
    guests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    coverImage: "/assets/properties/wmh-13-19.jpg",
    images: ["/assets/properties/wmh-13-19.jpg"],
    pricing: [
      { season: "summer", label: "Summer Season", dateRange: "April 15th – December 15th", pricePerNight: 375 },
    ],
    description: "A beautifully appointed two-bedroom villa in the prestigious Westmoreland Hills community.",
    reviews: [],
  },
  {
    slug: "westmoreland-hill-13-3-bed",
    name: "Westmoreland Hill 13 – 3 BED",
    location: "Westmoreland, St. James",
    guests: 6,
    bedrooms: 3,
    beds: 3,
    bathrooms: 2,
    coverImage: "/assets/properties/wmh-13-19.jpg",
    images: ["/assets/properties/wmh-13-19.jpg"],
    pricing: [
      { season: "summer", label: "Summer Season", dateRange: "April 15th – December 15th", pricePerNight: 435 },
    ],
    description: "Three-bedroom villa in Westmoreland Hills with stunning views and luxury finishes.",
    reviews: [],
  },
  {
    slug: "westmoreland-hill-2-3-bed",
    name: "Westmoreland Hill 2 – 3 BED",
    location: "Westmoreland, St. James",
    guests: 6,
    bedrooms: 3,
    beds: 3,
    bathrooms: 2,
    coverImage: "/assets/properties/Westmoreland-Hills-2-Villa-Viewtop-5.jpg",
    images: ["/assets/properties/Westmoreland-Hills-2-Villa-Viewtop-5.jpg"],
    pricing: [
      { season: "summer", label: "Summer Season", dateRange: "April 15th – December 15th", pricePerNight: 750 },
    ],
    description: "A premium three-bedroom villa in Westmoreland Hills offering spectacular views of the Caribbean Sea.",
    reviews: [],
  },
  {
    slug: "westmoreland-hill-22-4-bed",
    name: "Westmoreland Hill 22 – 4 BED",
    location: "Westmoreland, St. James",
    guests: 8,
    bedrooms: 4,
    beds: 4,
    bathrooms: 4,
    coverImage: "/assets/properties/Westmoreland-Hills-35-1.jpg",
    images: ["/assets/properties/Westmoreland-Hills-35-1.jpg"],
    pricing: [
      { season: "summer", label: "Summer Season", dateRange: "April 15th – December 15th", pricePerNight: 810 },
    ],
    description: "A grand four-bedroom villa in the exclusive Westmoreland Hills community.",
    reviews: [],
  },
  {
    slug: "brownes-2b-1-bed",
    name: "Brownes 2B – 1 BED",
    location: "Brownes, St. Michael",
    guests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    coverImage: "/assets/properties/1-2-scaled.jpg",
    images: ["/assets/properties/1-2-scaled.jpg"],
    pricing: [
      { season: "summer", label: "Summer Season", dateRange: "April 15th – December 15th", pricePerNight: 165 },
    ],
    description: "A cosy one-bedroom apartment in Brownes, offering easy access to Bridgetown and the South Coast.",
    reviews: [],
  },
  {
    slug: "jamestown-park-1-2-bed",
    name: "Jamestown Park 1 – 2 BED",
    location: "Jamestown Park, St. James",
    guests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    coverImage: "/assets/properties/IMG_7463-scaled.jpg",
    images: ["/assets/properties/IMG_7463-scaled.jpg", "/assets/properties/IMG_7553-scaled.jpg"],
    pricing: [
      { season: "summer", label: "Summer Season", dateRange: "April 15th – December 15th", pricePerNight: 120 },
    ],
    description: "A comfortable two-bedroom apartment in the popular Jamestown Park complex.",
    reviews: [],
  },
  {
    slug: "jamestown-park-1-1-bed",
    name: "Jamestown Park 1 – 1 BED",
    location: "Jamestown Park, St. James",
    guests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    coverImage: "/assets/properties/IMG_7557-scaled.jpg",
    images: ["/assets/properties/IMG_7557-scaled.jpg"],
    pricing: [
      { season: "summer", label: "Summer Season", dateRange: "April 15th – December 15th", pricePerNight: 102 },
    ],
    description: "A well-appointed one-bedroom apartment in Jamestown Park, ideal for couples.",
    reviews: [],
  },
  {
    slug: "coconut-grove-3-sienna",
    name: "Coconut Grove 3 – Sienna",
    location: "Coconut Grove, St. James",
    guests: 6,
    bedrooms: 3,
    beds: 3,
    bathrooms: 3.5,
    coverImage: "/assets/properties/Sienna-12.jpg",
    images: ["/assets/properties/Sienna-12.jpg"],
    pricing: [
      { season: "summer", label: "Summer Season", dateRange: "April 15th – December 15th", pricePerNight: 1500 },
    ],
    description: "The crown jewel of the collection — Sienna at Coconut Grove is a breathtaking three-bedroom villa offering unparalleled luxury on Barbados' prestigious West Coast.",
    reviews: [],
  },
  {
    slug: "the-crane-resort",
    name: "Poinciana at the Crane",
    featured: true,
    location: "The Crane, St. Philip",
    guests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    coverImage: "/assets/properties/01-Balcony-1-Dining-Official-605x605.jpg",
    images: ["/assets/properties/5-2-scaled.jpg"],
    pricing: [
      { season: "summer", label: "Summer Season", dateRange: "April 15th – December 15th", pricePerNight: 490 },
    ],
    description: "Poinciana at the Crane is a stunning two-bedroom suite within the iconic Crane Resort on Barbados' South East coast, offering access to one of the island's most beautiful beaches.",
    reviews: [],
  },
  {
    slug: "mullins-reef-3-bed",
    name: "Mullins Reef – 3 BED",
    location: "Mullins, St. Peter",
    guests: 6,
    bedrooms: 3,
    beds: 3,
    bathrooms: 3,
    coverImage: "/assets/properties/Mullins-Bay-12-mins-walk.png",
    images: ["/assets/properties/Mullins-Bay-12-mins-walk.png"],
    pricing: [
      { season: "summer", label: "Summer Season", dateRange: "April 15th – December 15th", pricePerNight: 625 },
    ],
    description: "A beautiful three-bedroom villa steps from the famous Mullins Beach, one of Barbados' most beloved stretches of sand.",
    reviews: [],
  },
  {
    slug: "westmoreland-hills-1-villa-savannah",
    name: "Westmoreland Hills 1 – Villa Savannah",
    location: "Westmoreland, St. James",
    guests: 6,
    bedrooms: 3,
    beds: 3,
    bathrooms: 2,
    coverImage: "/assets/properties/Westmoreland-Hills-2-Villa-Viewtop-5.jpg",
    images: ["/assets/properties/Westmoreland-Hills-2-Villa-Viewtop-5.jpg"],
    pricing: [
      { season: "summer", label: "Summer Season", dateRange: "April 15th – December 15th", pricePerNight: 450 },
    ],
    description: "Villa Savannah is a stunning three-bedroom property in the exclusive Westmoreland Hills community, offering sweeping views and a private pool.",
    reviews: [],
  },
  {
    slug: "ixora-101",
    name: "Ixora 101",
    location: "St. James",
    guests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 1.5,
    coverImage: "/assets/properties/IMG_7572-scaled.jpg",
    images: ["/assets/properties/IMG_7572-scaled.jpg"],
    pricing: [
      { season: "summer", label: "Summer Season", dateRange: "April 15th – December 15th", pricePerNight: 150 },
    ],
    description: "A charming two-bedroom apartment at Ixora, offering comfortable accommodation at an accessible price point.",
    reviews: [],
  },
];

export const featuredProperties = properties.filter((p) => p.featured);
