const listings = [
  {
    title: "Cozy Mountain Cabin",
    description: "A beautiful cabin in the heart of the mountains, perfect for a weekend getaway.",
    image: [
      { url: "https://images.unsplash.com/photo-1600488999135-d8c26d3525bf", filename: "mountain1" },
      { url: "https://images.unsplash.com/photo-1510138716832-5897b50d7a7e", filename: "mountain2" }
    ],
    price: 150,
    location: "Aspen, Colorado",
    country: "USA",
    category: "Mountains",
  },
  {
    title: "Luxury Castle Stay",
    description: "Live like royalty in this grand castle with modern amenities.",
    image: [
      { url: "https://images.unsplash.com/photo-1583207424935-6a4dbfcbc93d", filename: "castle1" }
    ],
    price: 500,
    location: "Edinburgh, Scotland",
    country: "UK",
    category: "Castles",
  },
  {
    title: "Serene Lakefront Retreat",
    description: "Relax and unwind at this peaceful lakefront property.",
    image: [
      { url: "https://images.unsplash.com/photo-1495195129352-aeb325a55b65", filename: "lakefront1" }
    ],
    price: 200,
    location: "Lake Tahoe, California",
    country: "USA",
    category: "Amazingpools",
  },
  {
    title: "Rustic Farmhouse Experience",
    description: "Enjoy a quiet and rustic farmhouse with fresh produce.",
    image: [
      { url: "https://images.unsplash.com/photo-1575320181282-3e5f5caed0c1", filename: "farmhouse1" }
    ],
    price: 120,
    location: "Nashville, Tennessee",
    country: "USA",
    category: "Farms",
  },
  {
    title: "Arctic Igloo Adventure",
    description: "Sleep under the northern lights in a glass igloo.",
    image: [
      { url: "https://images.unsplash.com/photo-1568133277529-169cb61878b2", filename: "igloo1" }
    ],
    price: 300,
    location: "Tromsø, Norway",
    country: "Norway",
    category: "Arctic",
  },
  {
    title: "Bohemian Camping Experience",
    description: "Glamping tents in a scenic desert setting.",
    image: [
      { url: "https://images.unsplash.com/photo-1540574163026-643ea20ade25", filename: "camping1" }
    ],
    price: 80,
    location: "Sedona, Arizona",
    country: "USA",
    category: "Camping",
  },
  {
    title: "Floating Houseboat Stay",
    description: "A unique stay in a houseboat on the serene backwaters.",
    image: [
      { url: "https://images.unsplash.com/photo-1588600999103-e6a1a9516781", filename: "houseboat1" }
    ],
    price: 250,
    location: "Alleppey, Kerala",
    country: "India",
    category: "Boats",
  },
  {
    title: "Iconic City Apartment",
    description: "A modern apartment in the heart of an iconic city.",
    image: [
      { url: "https://images.unsplash.com/photo-1600585154340-be6161d1ad27", filename: "city1" }
    ],
    price: 220,
    location: "New York City, NY",
    country: "USA",
    category: "Iconiccities",
  },
  {
    title: "Treehouse in the Jungle",
    description: "Stay in a luxurious treehouse surrounded by nature.",
    image: [
      { url: "https://images.unsplash.com/photo-1576669805563-3f618b5f7d02", filename: "treehouse1" }
    ],
    price: 180,
    location: "Ubud, Bali",
    country: "Indonesia",
    category: "Trending",
  },
  {
    title: "Historic Tower Stay",
    description: "Experience a medieval tower with panoramic views.",
    image: [
      { url: "https://images.unsplash.com/photo-1568731996342-0201f383c952", filename: "tower1" }
    ],
    price: 400,
    location: "Siena, Italy",
    country: "Italy",
    category: "Towers",
  },
  {
    title: "Luxury Poolside Villa",
    description: "A private villa with an infinity pool and stunning views.",
    image: [
      { url: "https://images.unsplash.com/photo-1590490355622-9a3bd2dbf5c2", filename: "poolvilla1" }
    ],
    price: 700,
    location: "Santorini, Greece",
    country: "Greece",
    category: "Amazingpools",
  },
  {
    title: "Modern Urban Loft",
    description: "A chic loft in the heart of the city's art district.",
    image: [
      { url: "https://images.unsplash.com/photo-1590073242676-d38a4b9c2c50", filename: "loft1" }
    ],
    price: 300,
    location: "Berlin, Germany",
    country: "Germany",
    category: "Iconiccities",
  },
  {
    title: "Charming Cottage Escape",
    description: "A quaint cottage surrounded by beautiful gardens.",
    image: [
      { url: "https://images.unsplash.com/photo-1533577116850-9cc66cad8a9f", filename: "cottage1" }
    ],
    price: 150,
    location: "Cotswolds, England",
    country: "UK",
    category: "Trending",
  },
  {
    title: "Snowy Chalet Retreat",
    description: "A cozy chalet with a roaring fireplace and ski access.",
    image: [
      { url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267", filename: "chalet1" }
    ],
    price: 400,
    location: "Zermatt, Switzerland",
    country: "Switzerland",
    category: "Mountains",
  },
  {
    title: "Quirky Tiny House",
    description: "A minimalist tiny house with everything you need.",
    image: [
      { url: "https://images.unsplash.com/photo-1586116578405-9a806b178f5e", filename: "tinyhouse1" }
    ],
    price: 90,
    location: "Portland, Oregon",
    country: "USA",
    category: "Trending",
  },
  {
    title: "Island Paradise Bungalow",
    description: "A private beachfront bungalow on a secluded island.",
    image: [
      { url: "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba", filename: "bungalow1" }
    ],
    price: 500,
    location: "Maldives",
    country: "Maldives",
    category: "Trending",
  }
];


module.exports = { data: listings };