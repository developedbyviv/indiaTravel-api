/**
 * Seed script — populates MongoDB with all static data.
 * Run with: npm run seed
 *
 * ⚠️  Make sure MONGODB_URI is set in your .env before running.
 */
import 'dotenv/config';
import connectDB from './config/db';
import Tour from './models/Tour';
import Blog from './models/Blog';
import Destination from './models/Destination';
import Activity from './models/Activity';
import Eat from './models/Eat';
import Policy from './models/Policy';

// ── Tours ──────────────────────────────────────────────────────────────────

const handpickedTours = [
  { id: 1, image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80', location: 'Rajasthan', region: 'Rajasthan', title: 'Rajasthan Crown Route', description: 'A balanced getaway through Jaipur, Jodhpur, and Udaipur—perfect for travellers seeking culture, comfort, and stunning views.', rating: 4.8, reviews: 124, price: 0, category: 'handpicked' },
  { id: 2, image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80', location: 'Agra Heritage', region: 'Uttar Pradesh', title: 'Agra Heritage Escape', description: 'A quick cultural getaway featuring the Taj Mahal, Agra Fort, local markets, and Mughal heritage.', rating: 4.9, reviews: 85, price: 0, category: 'handpicked' },
  { id: 3, image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80', location: 'Delhi', region: 'Delhi', title: 'Delhi Essentials Explorer', description: 'A balanced mix of culture, markets, modern sights, and local flavours.', rating: 4.7, reviews: 92, price: 0, category: 'handpicked' },
  { id: 14, image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80', location: 'Jaipur', region: 'Rajasthan', title: 'Jaipur Royal Splendour', description: "Immerse yourself in the Pink City's royal heritage and vibrant markets.", rating: 4.9, reviews: 150, price: 0, category: 'handpicked' },
  { id: 15, image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80', location: 'Kerala', region: 'Kerala', title: 'Kerala Backwaters Bliss', description: "Relax on a houseboat and explore the lush green landscapes of God's Own Country.", rating: 4.9, reviews: 200, price: 0, category: 'handpicked' },
];

const goldenTriangleTours = [
  {
    id: 4, image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    location: 'Golden Triangle', region: 'Delhi / Agra / Jaipur', title: 'Classic Golden Triangle', rating: 4.5, reviews: 210, price: 450, category: 'golden-triangle',
    description: 'Experience the classic Golden Triangle Tour of North India, covering Delhi, Agra, and Jaipur in a perfectly planned itinerary.',
    inclusions: ['Arrival & Departure Assistance', 'Tour Manager on WhatsApp', 'A/C Car/Coach transport', 'All sightseeing inside', 'Hotel on twin-sharing basis', 'Driver expenses'],
    exclusions: ['Porterage, laundry, shopping, alcohol', 'Extra costs due to illness/accident', 'Anything outside the itinerary', 'Tolls and Taxes'],
    itinerary: [
      { day: 1, title: 'Half-Day Delhi Tour', startTime: '10:00 AM', sightseeing: ['India Gate', "Humayun's Tomb", 'Qutub Minar', 'Gurudwara Bangla Sahib'], activities: ['Short walk + photo stops at each location'], foodStop: 'Saravana Bhavan', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80' },
      { day: 2, title: 'Full-Day Delhi Tour', startTime: '10:00 AM', sightseeing: ['Red Fort', 'Jama Masjid', 'Akshardham Temple', 'Jantar Mantar'], activities: ['Local market browsing + photo stops'], departure: 'Leave Delhi in the evening for Agra', image: 'https://images.unsplash.com/photo-1585128719715-46776b56a0d1?auto=format&fit=crop&w=800&q=80' },
      { day: 3, title: 'Full-Day Agra Tour', startTime: '8:00 AM', sightseeing: ['Taj Mahal', 'Agra Fort', 'Mehtab Bagh'], activities: ['Photo stops at Taj Mahal', 'Walk along riverside'], departure: 'Depart from Agra', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80' },
      { day: 4, title: 'Discover Jaipur', startTime: '9:00 AM', sightseeing: ['Amer Fort', 'Hawa Mahal', 'Jal Mahal', 'Nahargarh Fort'], activities: ['Scenic fort explorations', 'Photo stops'], foodStop: 'Tapri Central', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80' },
      { day: 5, title: 'City Palace & Bazaars', startTime: '10:00 AM', sightseeing: ['City Palace', 'Jantar Mantar', 'Johari Bazaar', 'Bapu Bazaar'], activities: ['Royal heritage tour', 'Shopping'], departure: 'Evening drive back to Delhi', image: 'https://images.unsplash.com/photo-1524230507669-5ff97982bb5b?auto=format&fit=crop&w=800&q=80' },
    ],
    reviewsList: [
      { author: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', rating: 5, date: 'October 15, 2025', content: 'An absolutely magical experience! The guide was knowledgeable and the hotels were top-notch.' },
      { author: 'Michael Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', rating: 4, date: 'September 28, 2025', content: 'Great itinerary covering all the main spots. The driver was very professional.' },
    ],
  },
  { id: 5, image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80', location: 'Amritsar Extension', region: 'Punjab', title: 'Golden Triangle with Amritsar', description: 'Extend your journey to the spiritual heart of Punjab with the Golden Temple.', rating: 4.8, reviews: 156, price: 0, category: 'golden-triangle' },
  { id: 6, image: 'https://images.unsplash.com/photo-1598324789736-4861f89564a0?auto=format&fit=crop&w=800&q=80', location: 'Pushkar Extension', region: 'Rajasthan', title: 'Golden Triangle with Pushkar', description: 'Add a spiritual twist with the sacred lake and Brahma temple of Pushkar.', rating: 4.7, reviews: 112, price: 0, category: 'golden-triangle' },
  { id: 10, image: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=800&q=80', location: 'Udaipur Extension', region: 'Rajasthan', title: 'Golden Triangle with Udaipur', description: 'Experience the City of Lakes and its royal palaces.', rating: 4.9, reviews: 130, price: 0, category: 'golden-triangle' },
  { id: 11, image: 'https://images.unsplash.com/photo-1582510003544-4d00b7853894?auto=format&fit=crop&w=800&q=80', location: 'Varanasi Extension', region: 'Uttar Pradesh', title: 'Golden Triangle with Varanasi', description: 'Witness the spiritual capital of India on the banks of the Ganges.', rating: 4.8, reviews: 145, price: 0, category: 'golden-triangle' },
  { id: 12, image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80', location: 'Ranthambore', region: 'Rajasthan', title: 'Golden Triangle with Ranthambore', description: 'Add a wildlife adventure to your cultural tour with tigers in Ranthambore.', rating: 4.9, reviews: 180, price: 0, category: 'golden-triangle' },
];

const sameDayTours = [
  { id: 7, image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80', location: 'Delhi', region: 'Delhi', title: 'Delhi Same Day Tour', description: "A quick dive into Delhi's must-see monuments, markets, and culture—wrapped in one day.", rating: 4.6, reviews: 78, price: 0, category: 'same-day' },
  { id: 8, image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80', location: 'Agra', region: 'Uttar Pradesh', title: 'Agra Same Day Tour', description: 'A quick cultural getaway featuring the Taj Mahal, Agra Fort, and local markets.', rating: 4.9, reviews: 320, price: 0, category: 'same-day' },
  { id: 9, image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80', location: 'Jaipur', region: 'Rajasthan', title: 'Jaipur Same Day Tour', description: 'A quick cultural getaway through the Pink City and its iconic forts.', rating: 4.8, reviews: 145, price: 0, category: 'same-day' },
  { id: 20, image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80', location: 'Mathura', region: 'Uttar Pradesh', title: 'Mathura & Vrindavan', description: 'Experience the spiritual vibrations of the birthplace of Lord Krishna.', rating: 4.7, reviews: 110, price: 0, category: 'same-day' },
  { id: 21, image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80', location: 'Haridwar', region: 'Uttarakhand', title: 'Haridwar & Rishikesh', description: 'Witness the evening Ganga Aarti and explore the yoga capital of the world.', rating: 4.8, reviews: 95, price: 0, category: 'same-day' },
];

// ── Blogs ──────────────────────────────────────────────────────────────────

const blogData = [
  { slug: 'ranthambore-where-royal-history-meets-the-wild', title: 'Ranthambore: Where Royal History Meets The Wild', image: 'https://images.unsplash.com/photo-1549144464-6992d9f9453c?auto=format&fit=crop&w=1200&q=80', date: '10-Oct-2025', readTime: '6 min read', location: 'Ranthambore, Rajasthan', description: 'Plan the perfect Ranthambore adventure with insights on zones, timings, and local secrets.', category: 'Wildlife', content: ["Ranthambore is one of India's most iconic tiger reserves where ruined forts, ancient temples, and dense forests meet in a dramatic landscape.", "Once the private hunting ground of Jaipur's royals, the park today is a protected sanctuary that offers travellers a rare chance to see tigers in the wild.", 'Beyond safaris, Ranthambore is also about slow mornings, village walks, and evenings spent swapping stories around a bonfire.'] },
  { slug: 'wildlife-experiences-in-ranthambore', title: 'Wildlife Experiences In Ranthambore', image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=80', date: '18-Oct-2025', readTime: '5 min read', location: 'Ranthambore, Rajasthan', description: 'From elusive tigers to rare birds, explore the many wild residents of Ranthambore.', category: 'Wildlife', content: ['Ranthambore is home to tigers, leopards, sloth bears, and over 270 bird species.', 'A good naturalist guide can completely transform your experience with stories, tracks, and behaviour cues.'] },
  { slug: 'best-time-to-visit-ranthambore', title: 'Best Time To Visit Ranthambore', image: 'https://images.unsplash.com/photo-1511300636408-a63a89df3482?auto=format&fit=crop&w=1200&q=80', date: '25-Oct-2025', readTime: '4 min read', location: 'Ranthambore, Rajasthan', description: "Season-by-season guide to help you plan your Ranthambore safari just right.", category: 'Travel Tips', content: ['October to June is safari season in Ranthambore, with each month offering a different mood.', 'Winter months bring pleasant days and misty mornings, ideal for photographers and families.'] },
  { slug: 'golden-triangle-complete-guide', title: 'The Complete Golden Triangle Guide', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80', date: '05-Nov-2025', readTime: '8 min read', location: 'Delhi / Agra / Jaipur', description: 'Everything you need to know about India\'s most popular tourist circuit.', category: 'Travel Tips', content: ['The Golden Triangle connects three of India\'s most historically significant cities: Delhi, Agra, and Jaipur.', 'Most travellers cover this circuit in 5–7 days, but you can adjust based on your interests and pace.', 'Each city has its own distinct personality — Delhi\'s urban energy, Agra\'s Mughal grandeur, and Jaipur\'s royal pink heritage.'] },
  { slug: 'jaipur-pink-city-guide', title: 'Jaipur: A Complete City Guide', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80', date: '12-Nov-2025', readTime: '7 min read', location: 'Jaipur, Rajasthan', description: 'Forts, palaces, bazaars, and the best food Jaipur has to offer.', category: 'Destination', content: ['Jaipur, the Pink City, is the gateway to Rajasthan and one of India\'s most photogenic cities.', 'From the grandeur of Amer Fort to the bustling Johari Bazaar, every corner has a story.', 'Try Dal Baati Churma at a local dhaba for the most authentic Rajasthani experience.'] },
];

// ── Destinations ───────────────────────────────────────────────────────────

const destinationData = [
  { slug: 'jaipur', name: 'Jaipur', region: 'Rajasthan', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80', description: 'The Pink City of India, known for its stunning palaces, vibrant bazaars, and rich Rajput history. Jaipur forms one vertex of India\'s famous Golden Triangle.', highlights: ['Amer Fort', 'Hawa Mahal', 'City Palace', 'Jantar Mantar', 'Nahargarh Fort', 'Jal Mahal'], bestTimeToVisit: 'October to March', language: 'Hindi, Rajasthani', currency: 'INR' },
  { slug: 'agra', name: 'Agra', region: 'Uttar Pradesh', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80', description: 'Home to the iconic Taj Mahal, a UNESCO World Heritage Site and one of the Seven Wonders of the World. Agra\'s Mughal architecture is unmatched in grandeur.', highlights: ['Taj Mahal', 'Agra Fort', 'Mehtab Bagh', 'Fatehpur Sikri', 'Itimad-ud-Daulah', 'Kinari Bazaar'], bestTimeToVisit: 'October to March', language: 'Hindi', currency: 'INR' },
  { slug: 'delhi', name: 'Delhi', region: 'Delhi', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80', description: 'India\'s vibrant capital is a fusion of ancient history and modern life. From Mughal monuments to street food paradise, Delhi offers everything in one city.', highlights: ['Red Fort', 'Qutub Minar', "India Gate", "Humayun's Tomb", 'Chandni Chowk', 'Akshardham Temple'], bestTimeToVisit: 'October to February', language: 'Hindi, English', currency: 'INR' },
  { slug: 'ranthambore', name: 'Ranthambore', region: 'Rajasthan', image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80', description: "One of India's best places to spot Bengal tigers in the wild. Set in the Aravalli and Vindhya hills, Ranthambore's dramatic landscape makes every safari memorable.", highlights: ['Tiger Safari', 'Ranthambore Fort', 'Padam Lake', 'Jogi Mahal', 'Wildlife Photography', 'Bird Watching'], bestTimeToVisit: 'October to June', language: 'Hindi, Rajasthani', currency: 'INR' },
  { slug: 'varanasi', name: 'Varanasi', region: 'Uttar Pradesh', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7853894?auto=format&fit=crop&w=800&q=80', description: "One of the world's oldest living cities and the spiritual capital of India. Varanasi's ghats along the Ganges offer a profound, unforgettable experience.", highlights: ['Dashashwamedh Ghat', 'Ganga Aarti', 'Kashi Vishwanath Temple', 'Boat Ride at Sunrise', 'Sarnath', 'Manikarnika Ghat'], bestTimeToVisit: 'October to March', language: 'Hindi, Bhojpuri', currency: 'INR' },
  { slug: 'kerala', name: 'Kerala', region: 'Kerala', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80', description: "God's Own Country offers everything — serene backwaters, hill stations, Ayurveda retreats, and beautiful beaches. Kerala is nature at its most breathtaking.", highlights: ['Alleppey Backwaters', 'Munnar Tea Gardens', 'Kovalam Beach', 'Periyar Wildlife Sanctuary', 'Kathakali Dance', 'Ayurveda Spa'], bestTimeToVisit: 'September to March', language: 'Malayalam', currency: 'INR' },
  { slug: 'udaipur', name: 'Udaipur', region: 'Rajasthan', image: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=800&q=80', description: "The City of Lakes enchants visitors with its romantic lake palaces, intricate temples, and colourful bazaars. Udaipur is often called the Venice of the East.", highlights: ['City Palace', 'Lake Pichola', 'Jagdish Temple', 'Saheliyon ki Bari', 'Boat Ride', 'Bagore ki Haveli'], bestTimeToVisit: 'September to March', language: 'Hindi, Rajasthani', currency: 'INR' },
];

// ── Activities ─────────────────────────────────────────────────────────────

const activityData = [
  { title: 'Tiger Safari', description: 'Jeep and canter safaris through Ranthambore National Park with expert naturalists tracking Bengal tigers and leopards.', tag: 'Safari', destination: 'Ranthambore', image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80', difficulty: 'easy', duration: '3 hours', price: 1200 },
  { title: 'Taj Mahal Sunrise Visit', description: 'Experience the Taj Mahal at its most magical during golden hour — misty, uncrowded, and unforgettable.', tag: 'Heritage', destination: 'Agra', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80', difficulty: 'easy', duration: '2 hours', price: 500 },
  { title: 'Ganga Aarti Ceremony', description: 'Witness the mesmerising evening fire ritual on the banks of the Ganges at Dashashwamedh Ghat.', tag: 'Spiritual', destination: 'Varanasi', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7853894?auto=format&fit=crop&w=800&q=80', difficulty: 'easy', duration: '1 hour', price: 0 },
  { title: 'Houseboat Stay', description: 'Glide through Kerala\'s tranquil backwaters on a traditional Kerala kettuvallam houseboat overnight.', tag: 'Nature', destination: 'Kerala', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80', difficulty: 'easy', duration: '24 hours', price: 8000 },
  { title: 'Amer Fort Jeep Ride', description: 'Take a jeep up to the iconic Amer Fort overlooking Maota Lake with panoramic views of Jaipur.', tag: 'Heritage', destination: 'Jaipur', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80', difficulty: 'easy', duration: '3 hours', price: 800 },
  { title: 'Old Delhi Food Walk', description: 'Explore Chandni Chowk\'s legendary street food scene — parathas, jalebis, chaat, and kebabs with a local guide.', tag: 'Food', destination: 'Delhi', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80', difficulty: 'easy', duration: '3 hours', price: 1500 },
  { title: 'White Water Rafting', description: 'Raft down the mighty Ganges through Grade 3–4 rapids in Rishikesh — India\'s adventure capital.', tag: 'Adventure', destination: 'Rishikesh', image: 'https://images.unsplash.com/photo-1519955266818-0231b63402bc?auto=format&fit=crop&w=800&q=80', difficulty: 'moderate', duration: '2 hours', price: 1000 },
  { title: 'Cooking Class — Rajasthani Cuisine', description: 'Learn to cook Dal Baati Churma, Ker Sangri, and Gatte ki Sabzi in a Jaipur family home.', tag: 'Culinary', destination: 'Jaipur', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80', difficulty: 'easy', duration: '3 hours', price: 2500 },
];

// ── Eat ────────────────────────────────────────────────────────────────────

const eatData = [
  { name: 'Laxmi Mishtan Bhandar (LMB)', city: 'Jaipur', cuisine: 'Rajasthani', description: 'A legendary Jaipur institution since 1954. Famous for Daal Baati Churma, Mawa Kachori, and traditional sweets.', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80', rating: 4.8, priceRange: '₹200–₹500', tags: ['Vegetarian', 'Sweet Shop', 'Iconic', 'Family'] },
  { name: 'Peshawri — ITC Maurya', city: 'Delhi', cuisine: 'North Indian / Frontier', description: 'Legendary for its Dal Bukhara and Murgh Makhani. A must-visit for North-West Frontier cuisine perfected over 30+ years.', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80', rating: 4.9, priceRange: '₹3,000–₹6,000', tags: ['Fine Dining', 'Non-Vegetarian', 'Heritage', 'Tandoor'] },
  { name: 'Dasaprakash', city: 'Agra', cuisine: 'South Indian', description: 'A beloved chain serving pure vegetarian South Indian food. The ideal contrast to North India\'s heavy flavours after days of Mughal cuisine.', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80', rating: 4.5, priceRange: '₹150–₹400', tags: ['Vegetarian', 'South Indian', 'Budget-friendly'] },
  { name: 'Aaheli — Peerless Inn', city: 'Varanasi', cuisine: 'Bengali / Awadhi', description: 'Award-winning Bengali restaurant featuring rare regional dishes in an elegant heritage setting alongside the Ganges.', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7853894?auto=format&fit=crop&w=800&q=80', rating: 4.7, priceRange: '₹800–₹2,000', tags: ['Fine Dining', 'Bengali', 'Heritage', 'River View'] },
  { name: 'Dhe Puttar', city: 'Jaipur', cuisine: 'Rajasthani', description: 'A rooftop restaurant with a view of Amer Fort. Specialises in traditional Rajasthani thalis served with live folk music.', image: 'https://images.unsplash.com/photo-1524230507669-5ff97982bb5b?auto=format&fit=crop&w=800&q=80', rating: 4.6, priceRange: '₹500–₹1,200', tags: ['Rooftop', 'Thali', 'Folk Music', 'Fort View'] },
  { name: 'Karim\'s', city: 'Delhi', cuisine: 'Mughlai', description: 'A 100-year-old Delhi institution near Jama Masjid. The mutton korma and nihari are legendary — a must for meat lovers.', image: 'https://images.unsplash.com/photo-1585128719715-46776b56a0d1?auto=format&fit=crop&w=800&q=80', rating: 4.7, priceRange: '₹200–₹600', tags: ['Mughlai', 'Non-Vegetarian', 'Iconic', 'Old Delhi'] },
  { name: 'Saravana Bhavan', city: 'Delhi', cuisine: 'South Indian', description: 'Global South Indian chain, beloved for its consistent masala dosas, filter coffee, and unlimited meal thalis.', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80', rating: 4.4, priceRange: '₹150–₹400', tags: ['Vegetarian', 'South Indian', 'Budget-friendly', 'Chain'] },
  { name: 'Ginger House Museum Café', city: 'Kerala', cuisine: 'Keralan / Coastal', description: 'Nestled inside a museum in Fort Kochi. Serves fresh seafood, appam with stew, and toddy-pairing platters.', image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80', rating: 4.6, priceRange: '₹400–₹900', tags: ['Coastal', 'Seafood', 'Café', 'Heritage'] },
];

// ── Policies ───────────────────────────────────────────────────────────────

const policyData = [
  {
    key: 'privacy',
    title: 'Privacy Policy',
    content: `**Last updated: July 2025**

At IndiaTravels, we are committed to protecting your personal information and your right to privacy.

## Information We Collect
- **Personal information** you provide: name, email, phone, and payment details when you book a tour or submit an enquiry.
- **Usage data**: pages visited, time spent, device type, and IP address via cookies and analytics.

## How We Use Your Information
- To process bookings and enquiries
- To send confirmation emails and trip reminders
- To personalise your experience on our platform
- To improve our services and website

## Data Sharing
We do not sell your personal information. We may share data with trusted third-party service providers (payment processors, email delivery) under strict confidentiality agreements.

## Data Retention
We retain your information for as long as necessary to fulfil the purposes outlined above or as required by law.

## Your Rights
You have the right to access, correct, or delete your personal data. Contact us at privacy@indiatravels.net.

## Contact
For privacy concerns, email us at **privacy@indiatravels.net**.`,
  },
  {
    key: 'refund',
    title: 'Refund Policy',
    content: `**Last updated: July 2025**

We want you to travel with complete confidence. Here is our refund policy:

## Refund Schedule (from date of departure)

| Notice Period | Refund |
|---|---|
| 30+ days before | 100% refund |
| 15–29 days before | 75% refund |
| 7–14 days before | 50% refund |
| Less than 7 days | No refund |

## How to Request a Refund
1. Email **refunds@indiatravels.net** with your booking reference
2. Provide reason for cancellation
3. Refunds are processed within **7–10 working days** to the original payment method

## Non-Refundable Items
- Visa fees
- Travel insurance premiums
- Third-party hotel and flight bookings made separately

## Force Majeure
In events beyond our control (natural disasters, government restrictions), we will offer a full credit note valid for 12 months.`,
  },
  {
    key: 'cancellation',
    title: 'Cancellation Policy',
    content: `**Last updated: July 2025**

## Cancellation by the Traveller
You may cancel your booking at any time. Cancellation charges apply based on how far in advance you cancel:

- **30+ days before departure**: No cancellation fee
- **15–29 days before departure**: 25% of tour cost
- **7–14 days before departure**: 50% of tour cost
- **Less than 7 days**: 100% of tour cost (no refund)

## Cancellation by IndiaTravels
We reserve the right to cancel a tour if:
- Minimum group size is not met
- Safety concerns arise
- Force majeure events occur

In such cases, you will receive a **full refund or alternative tour offer**.

## How to Cancel
Email **support@indiatravels.net** with your booking ID and we will process it within 24 hours.`,
  },
  {
    key: 'payment',
    title: 'Payment Policy',
    content: `**Last updated: July 2025**

## Accepted Payment Methods
- Credit / Debit Cards (Visa, Mastercard, Amex)
- Net Banking (all major Indian banks)
- UPI (GPay, PhonePe, Paytm)
- International Wire Transfer (for bookings over ₹50,000)

## Payment Schedule
- **Booking deposit**: 25% at time of booking confirmation
- **Balance**: Remaining 75% due 14 days before departure

## Security
All payments are processed through PCI-DSS compliant payment gateways. We do not store your card details.

## Currency
All prices are displayed and charged in **Indian Rupees (INR)** unless stated otherwise. International card holders may be subject to foreign transaction fees from their bank.

## Invoices
A GST-compliant invoice will be emailed to you within 24 hours of payment.`,
  },
];

// ── Runner ─────────────────────────────────────────────────────────────────

const seed = async () => {
  try {
    await connectDB();

    // ── Clear all collections ────────────────────────────────────────
    await Promise.all([
      Tour.deleteMany({}),
      Blog.deleteMany({}),
      Destination.deleteMany({}),
      Activity.deleteMany({}),
      Eat.deleteMany({}),
      Policy.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data from all collections\n');

    // ── Insert data ──────────────────────────────────────────────────
    const allTours = [...handpickedTours, ...goldenTriangleTours, ...sameDayTours];
    await Tour.insertMany(allTours);
    console.log(`✅ Tours       → ${allTours.length} inserted`);

    await Blog.insertMany(blogData);
    console.log(`✅ Blogs       → ${blogData.length} inserted`);

    await Destination.insertMany(destinationData);
    console.log(`✅ Destinations → ${destinationData.length} inserted`);

    await Activity.insertMany(activityData);
    console.log(`✅ Activities  → ${activityData.length} inserted`);

    await Eat.insertMany(eatData);
    console.log(`✅ Eat places  → ${eatData.length} inserted`);

    await Policy.insertMany(policyData);
    console.log(`✅ Policies    → ${policyData.length} inserted`);

    console.log('\n🌱 Seed complete! All collections populated.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seed();
