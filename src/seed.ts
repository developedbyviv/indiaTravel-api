/**
 * Seed script — populates MongoDB with all static tour and blog data from the frontend.
 * Run with: npm run seed
 *
 * ⚠️  Make sure MONGODB_URI is set in your .env before running.
 */
import 'dotenv/config';
import connectDB from './config/db';
import Tour from './models/Tour';
import Blog from './models/Blog';

// ── Tours data (mirrored from frontend src/data/tours.ts + tourDetails.ts) ──

const handpickedTours = [
  { id: 1, image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80', location: 'Rajasthan', title: 'Rajasthan Crown Route', description: 'A balanced getaway through Jaipur, Jodhpur, and Udaipur—perfect for travellers seeking culture, comfort, and stunning views.', rating: 4.8, reviews: 124, price: 0, category: 'handpicked' },
  { id: 2, image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80', location: 'Agra Heritage', title: 'Agra Heritage Escape', description: 'A quick cultural getaway featuring the Taj Mahal, Agra Fort, local markets, and Mughal heritage.', rating: 4.9, reviews: 85, price: 0, category: 'handpicked' },
  { id: 3, image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80', location: 'Delhi', title: 'Delhi Essentials Explorer', description: "A balanced mix of culture, markets, modern sights, and local flavours.", rating: 4.7, reviews: 92, price: 0, category: 'handpicked' },
  { id: 14, image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80', location: 'Jaipur', title: "Jaipur Royal Splendour", description: "Immerse yourself in the Pink City's royal heritage and vibrant markets.", rating: 4.9, reviews: 150, price: 0, category: 'handpicked' },
  { id: 15, image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80', location: 'Kerala', title: 'Kerala Backwaters Bliss', description: "Relax on a houseboat and explore the lush green landscapes of God's Own Country.", rating: 4.9, reviews: 200, price: 0, category: 'handpicked' },
  { id: 16, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80', location: 'Paris', title: 'Paris Romantic Getaway', description: 'Experience the City of Love with its iconic landmarks and charming streets.', rating: 4.8, reviews: 180, price: 0, category: 'handpicked' },
];

const goldenTriangleTours = [
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    location: 'Golden Triangle', title: 'Classic Golden Triangle', rating: 4.5, reviews: 210, price: 450, category: 'golden-triangle',
    description: 'Experience the classic Golden Triangle Tour of North India, covering Delhi, Agra, and Jaipur in a perfectly planned itinerary.',
    inclusions: ['Arrival Assistance / Departure assistance', 'Tour Manager available on phone/WhatsApp', 'Travel by comfortable A/C Car/Coach', 'All sightseeing places to be visited from inside', 'Accommodation in best hotels on Double/twin sharing basis', 'Driver expenses'],
    exclusions: ['Porterage, laundry, telephone charges, shopping, wines & alcoholic beverages', 'Any extra cost due to illness, accident, hospitalization', 'Anything not mentioned in the itinerary', 'Tolls and Taxes'],
    itinerary: [
      { day: 1, title: 'Half-Day Delhi Tour', startTime: '10:00 AM', sightseeing: ['India Gate', "Humayun's Tomb", 'Qutub Minar', 'Gurudwara Bangla Sahib'], activities: ['Short walk + photo stops at each location'], foodStop: 'Saravana Bhavan', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80' },
      { day: 2, title: 'Full-Day Delhi Tour', startTime: '10:00 AM', sightseeing: ['Red Fort (exterior visit)', 'Jama Masjid', 'Akshardham Temple', 'Jantar mantar'], activities: ['Local market browsing + photo stops'], departure: 'Leave Delhi in the evening for Agra', image: 'https://images.unsplash.com/photo-1585128719715-46776b56a0d1?auto=format&fit=crop&w=800&q=80' },
      { day: 3, title: 'Full-Day Agra Tour', startTime: '8:00 AM', sightseeing: ['Taj Mahal (morning visit)', 'Agra Fort', 'Mehtab Bagh / Sunset Point', 'Marble Craft Workshops & Local Markets'], activities: ['Photo stops at Taj Mahal & Agra Fort', 'Walk along Mehtab Bagh riverside'], departure: 'Depart from Agra', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80' },
      { day: 4, title: 'Discover Jaipur - The Pink City', startTime: '9:00 AM', sightseeing: ['Amer Fort (Elephant/Jeep ride)', 'Hawa Mahal (Palace of Winds)', 'Jal Mahal (Water Palace)', 'Nahargarh Fort (Sunset view)'], activities: ['Scenic fort explorations', 'Photo stops at Hawa Mahal & Jal Mahal'], foodStop: 'Tapri Central (Chai with a view)', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80' },
      { day: 5, title: 'City Palace & Local Bazaars', startTime: '10:00 AM', sightseeing: ['City Palace & Museum', 'Jantar Mantar (UNESCO Observatory)', 'Johari Bazaar (Jewellery & Textiles)', 'Bapu Bazaar (Jaipur Footwear)'], activities: ['Royal heritage tour', 'Shopping at traditional markets'], departure: 'Evening flight/drive back to Delhi', image: 'https://images.unsplash.com/photo-1524230507669-5ff97982bb5b?auto=format&fit=crop&w=800&q=80' },
    ],
    reviewsList: [
      { author: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', rating: 5, date: 'October 15, 2025', content: 'An absolutely magical experience! The guide was knowledgeable and the hotels were top-notch.' },
      { author: 'Michael Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', rating: 4, date: 'September 28, 2025', content: 'Great itinerary covering all the main spots. The driver was very professional.' },
      { author: 'Emma Wilson', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80', rating: 5, date: 'September 10, 2025', content: 'Perfectly organized tour. Highly recommend this package for the seamless experience.' },
    ],
  },
  { id: 5, image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80', location: 'Amritsar Extension', title: 'Golden Triangle with Amritsar', description: 'Extend your journey to the spiritual heart of Punjab with the Golden Temple.', rating: 4.8, reviews: 156, price: 0, category: 'golden-triangle' },
  { id: 6, image: 'https://images.unsplash.com/photo-1598324789736-4861f89564a0?auto=format&fit=crop&w=800&q=80', location: 'Pushkar Extension', title: 'Golden Triangle with Pushkar', description: 'Add a spiritual twist with the sacred lake and Brahma temple of Pushkar.', rating: 4.7, reviews: 112, price: 0, category: 'golden-triangle' },
  { id: 10, image: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=800&q=80', location: 'Udaipur Extension', title: 'Golden Triangle with Udaipur', description: 'Experience the City of Lakes and its royal palaces.', rating: 4.9, reviews: 130, price: 0, category: 'golden-triangle' },
  { id: 11, image: 'https://images.unsplash.com/photo-1582510003544-4d00b7853894?auto=format&fit=crop&w=800&q=80', location: 'Varanasi Extension', title: 'Golden Triangle with Varanasi', description: 'Witness the spiritual capital of India on the banks of the Ganges.', rating: 4.8, reviews: 145, price: 0, category: 'golden-triangle' },
  { id: 12, image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80', location: 'Ranthambore', title: 'Golden Triangle with Ranthambore', description: 'Add a wildlife adventure to your cultural tour with tigers in Ranthambore.', rating: 4.9, reviews: 180, price: 0, category: 'golden-triangle' },
  { id: 13, image: 'https://images.unsplash.com/photo-1519955266818-0231b63402bc?auto=format&fit=crop&w=800&q=80', location: 'Rishikesh', title: 'Golden Triangle with Rishikesh', description: 'Find peace and adventure in the Yoga Capital of the World.', rating: 4.8, reviews: 160, price: 0, category: 'golden-triangle' },
];

const sameDayTours = [
  { id: 7, image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80', location: 'Delhi', title: 'Delhi Tour', description: "A quick dive into Delhi's must-see monuments, markets, and culture—wrapped in one day.", rating: 4.6, reviews: 78, price: 0, category: 'same-day' },
  { id: 8, image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80', location: 'Agra', title: 'Agra Tour', description: 'A quick cultural getaway featuring the Taj Mahal, Agra Fort, and local markets.', rating: 4.9, reviews: 320, price: 0, category: 'same-day' },
  { id: 9, image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80', location: 'Jaipur', title: 'Jaipur Tour', description: 'A quick cultural getaway through the Pink City and its iconic forts.', rating: 4.8, reviews: 145, price: 0, category: 'same-day' },
  { id: 20, image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80', location: 'Mathura', title: 'Mathura & Vrindavan', description: 'Experience the spiritual vibrations of the birthplace of Lord Krishna.', rating: 4.7, reviews: 110, price: 0, category: 'same-day' },
  { id: 21, image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80', location: 'Haridwar', title: 'Haridwar & Rishikesh', description: 'Witness the evening Ganga Aarti and explore the yoga capital of the world in a single day.', rating: 4.8, reviews: 95, price: 0, category: 'same-day' },
  { id: 22, image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80', location: 'Neemrana', title: 'Neemrana Fort Palace', description: 'A royal day trip to the 15th-century fort palace.', rating: 4.6, reviews: 65, price: 0, category: 'same-day' },
];

// ── Blogs data (mirrored from frontend src/data/blogs.ts) ──────────────

const blogData = [
  { slug: 'ranthambore-where-royal-history-meets-the-wild', title: 'Ranthambore: Where Royal History Meets The Wild', image: 'https://images.unsplash.com/photo-1549144464-6992d9f9453c?auto=format&fit=crop&w=1200&q=80', date: '10-Oct-2025', readTime: '6 min read', location: 'Ranthambore, Rajasthan', description: 'Plan the perfect Ranthambore adventure with insights on zones, timings, and local secrets.', category: 'Wildlife', content: ["Ranthambore is one of India's most iconic tiger reserves where ruined forts, ancient temples, and dense forests meet in a dramatic landscape.", "Once the private hunting ground of Jaipur's royals, the park today is a protected sanctuary that offers travellers a rare chance to see tigers in the wild.", 'Beyond safaris, Ranthambore is also about slow mornings, village walks, and evenings spent swapping stories around a bonfire.', 'From choosing the right zone to picking the best season, a little planning makes your Ranthambore visit unforgettable.'] },
  { slug: 'wildlife-experiences-in-ranthambore', title: 'Wildlife Experiences In Ranthambore', image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=80', date: '18-Oct-2025', readTime: '5 min read', location: 'Ranthambore, Rajasthan', description: 'From elusive tigers to rare birds, explore the many wild residents of Ranthambore.', category: 'Wildlife', content: ['Ranthambore is home to tigers, leopards, sloth bears, and over 270 bird species.', 'Each safari zone has its own character – from lakes framed by palaces to rocky plateaus and thick forest corridors.', 'A good naturalist guide can completely transform your experience with stories, tracks, and behaviour cues.'] },
  { slug: 'best-time-to-visit-ranthambore', title: 'Best Time To Visit Ranthambore', image: 'https://images.unsplash.com/photo-1511300636408-a63a89df3482?auto=format&fit=crop&w=1200&q=80', date: '25-Oct-2025', readTime: '4 min read', location: 'Ranthambore, Rajasthan', description: "Season-by-season guide to help you plan your Ranthambore safari just right.", category: 'Travel Tips', content: ['October to June is safari season in Ranthambore, with each month offering a different mood.', 'Winter months bring pleasant days and misty mornings, ideal for photographers and families.', 'Summer can be hot but often offers higher chances of tiger sightings around water bodies.'] },
];

// ── Runner ─────────────────────────────────────────────────────────────────

const seed = async () => {
  try {
    await connectDB();

    // Clear existing
    await Tour.deleteMany({});
    await Blog.deleteMany({});
    console.log('🗑️  Cleared existing tours and blogs');

    // Insert all tours
    const allTours = [...handpickedTours, ...goldenTriangleTours, ...sameDayTours];
    await Tour.insertMany(allTours);
    console.log(`✅ Inserted ${allTours.length} tours`);

    // Insert blogs
    await Blog.insertMany(blogData);
    console.log(`✅ Inserted ${blogData.length} blogs`);

    console.log('🌱 Seed complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seed();
