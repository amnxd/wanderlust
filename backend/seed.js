const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://nancypandit25_db_user:TnLqQ3FamuDfREkn@ac-polnbjd-shard-00-00.ukj1dqx.mongodb.net:27017,ac-polnbjd-shard-00-01.ukj1dqx.mongodb.net:27017,ac-polnbjd-shard-00-02.ukj1dqx.mongodb.net:27017/wanderlust?ssl=true&replicaSet=atlas-f56pxl-shard-0&authSource=admin&retryWrites=true&w=majority';

const userSchema = new mongoose.Schema({
  name: String, email: { type: String, unique: true }, password: String,
  role: { type: String, enum: ['traveler', 'host'], default: 'traveler' },
  avatar: { type: String, default: '' }, wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],
  createdAt: { type: Date, default: Date.now }
});
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12); next();
});
userSchema.methods.matchPassword = async function(p) { return bcrypt.compare(p, this.password); };
const User = mongoose.models.User || mongoose.model('User', userSchema);

const listingSchema = new mongoose.Schema({
  title: String, description: String, price: Number, location: String,
  images: [String], amenities: [String],
  category: { type: String, enum: ['Beach', 'Mountains', 'Cities', 'Villas'], default: 'Cities' },
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  averageRating: { type: Number, default: 0 }, numReviews: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});
const Listing = mongoose.models.Listing || mongoose.model('Listing', listingSchema);

const BEACH_IMAGES = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&fit=crop',
  'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800&fit=crop',
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&fit=crop',
  'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&fit=crop',
  'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&fit=crop',
];
const MOUNTAIN_IMAGES = [
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&fit=crop',
  'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=800&fit=crop',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&fit=crop',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&fit=crop',
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&fit=crop',
];
const CITY_IMAGES = [
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&fit=crop',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&fit=crop',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&fit=crop',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&fit=crop',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&fit=crop',
];
const VILLA_IMAGES = [
  'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&fit=crop',
  'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&fit=crop',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&fit=crop',
  'https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=800&fit=crop',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&fit=crop',
];

const LISTINGS_DATA = [
  // BEACH (13)
  { title: 'Ocean Breeze Villa', location: 'Goa, India', price: 5200, category: 'Beach', images: BEACH_IMAGES, amenities: ['WiFi', 'Pool', 'Air Conditioning', 'Beachfront', 'Free Parking', 'Breakfast Included'], averageRating: 4.9, numReviews: 127, description: 'Wake up to the sound of waves in this stunning beachfront villa. Featuring a private infinity pool overlooking the Arabian Sea, this luxurious retreat offers the perfect blend of comfort and natural beauty. Enjoy sunset dinners on your private terrace, explore nearby water sports, and indulge in our world-class spa treatments.' },
  { title: 'Sunrise Beach Cottage', location: 'Kovalam, Kerala', price: 3200, category: 'Beach', images: BEACH_IMAGES.slice(1), amenities: ['WiFi', 'Air Conditioning', 'Beachfront', 'Breakfast Included'], averageRating: 4.7, numReviews: 89, description: 'A charming cottage steps from the famous Kovalam lighthouse beach. Whitewashed walls, vibrant Kerala murals, and the gentle sound of the sea make this the perfect romantic getaway. Fresh seafood served daily, Ayurvedic massages available on request.' },
  { title: 'Turquoise Bay Resort', location: 'Andaman Islands', price: 8500, category: 'Beach', images: BEACH_IMAGES, amenities: ['WiFi', 'Pool', 'Air Conditioning', 'Beachfront', 'Scuba Diving', 'Snorkeling', 'Restaurant'], averageRating: 4.8, numReviews: 203, description: 'Nestled in one of India\'s most pristine island paradises, Turquoise Bay offers crystal-clear waters and vibrant coral reefs. Our eco-luxury resort blends seamlessly with the surrounding rainforest, offering over-water bungalows and private beach cabanas.' },
  { title: 'Seashell Hideaway', location: 'Tarkarli, Maharashtra', price: 2800, category: 'Beach', images: BEACH_IMAGES.slice(2), amenities: ['WiFi', 'Beachfront', 'Free Parking', 'Kitchen'], averageRating: 4.5, numReviews: 56, description: 'A hidden gem on the Konkan coast where the Karli river meets the sea. Perfect for snorkeling in clear blue waters, this cozy hideaway offers authentic Malvani cuisine and unforgettable sunsets from the private deck.' },
  { title: 'Palm Paradise Resort', location: 'Varkala, Kerala', price: 4100, category: 'Beach', images: BEACH_IMAGES, amenities: ['WiFi', 'Pool', 'Yoga Classes', 'Restaurant', 'Beachfront'], averageRating: 4.6, numReviews: 94, description: 'Perched dramatically on the red laterite cliffs above Varkala\'s natural beach, Palm Paradise offers breathtaking panoramic views. Our resort specializes in yoga retreats and Ayurvedic wellness programs.' },
  { title: 'Golden Sands Bungalow', location: 'Puri, Odisha', price: 2200, category: 'Beach', images: BEACH_IMAGES.slice(1), amenities: ['WiFi', 'Air Conditioning', 'Temple Tours', 'Free Parking'], averageRating: 4.3, numReviews: 41, description: 'Experience the sacred city of Puri from this comfortable beachside bungalow. Steps from the famous Jagannath Temple and the endless golden beach, perfect for spiritual journeys and peaceful beach walks.' },
  { title: 'Coral Cove Beach House', location: 'Havelock Island, Andaman', price: 6800, category: 'Beach', images: BEACH_IMAGES, amenities: ['WiFi', 'Beachfront', 'Snorkeling', 'Kayaking', 'Breakfast Included', 'Air Conditioning'], averageRating: 4.9, numReviews: 178, description: 'An exclusive beach house on Radhanagar Beach, consistently rated one of Asia\'s best beaches. Our private stretch of white sand and turquoise water is yours to explore, with expert guides for underwater adventures.' },
  { title: 'Malabar Coast Manor', location: 'Kannur, Kerala', price: 3600, category: 'Beach', images: BEACH_IMAGES.slice(2), amenities: ['WiFi', 'Pool', 'Spice Garden Tour', 'Restaurant', 'Free Parking'], averageRating: 4.4, numReviews: 63, description: 'A heritage manor house surrounded by spice gardens and coconut groves, with private access to a pristine beach. Explore the ancient Theyyam traditions, sample Malabar seafood specialties, and stroll through fragrant spice plantations.' },
  { title: 'Lakshadweep Dream Villa', location: 'Bangaram Island, Lakshadweep', price: 12000, category: 'Beach', images: BEACH_IMAGES, amenities: ['WiFi', 'Private Beach', 'Diving', 'Snorkeling', 'All Meals Included', 'Water Sports'], averageRating: 5.0, numReviews: 45, description: 'The ultimate Indian island escape on a pristine coral atoll with no motor vehicles. Swim in lagoon waters so clear you\'ll feel like you\'re floating in the sky. This exclusive villa is the pinnacle of Indian island luxury.' },
  { title: 'Diu Seafront Retreat', location: 'Diu, Gujarat', price: 2900, category: 'Beach', images: BEACH_IMAGES.slice(1), amenities: ['WiFi', 'Beachfront', 'Cycling', 'Free Parking', 'Air Conditioning'], averageRating: 4.2, numReviews: 38, description: 'Discover the quiet charm of this former Portuguese territory. Sun-bleached churches, peaceful beaches, and delicious Gujarati-Portuguese fusion cuisine await at this lovely seafront retreat.' },
  { title: 'Pondicherry Beach Villa', location: 'Pondicherry', price: 4500, category: 'Beach', images: BEACH_IMAGES, amenities: ['WiFi', 'Pool', 'French Cuisine', 'Yoga', 'Beachfront', 'Air Conditioning'], averageRating: 4.7, numReviews: 112, description: 'A beautifully restored French colonial villa in the White Town of Pondicherry. The cobblestone streets, vibrant bougainvilleas, and the nearby promenade beach create a magical French Riviera atmosphere in South India.' },
  { title: 'Rann Utsav Beach Camp', location: 'Daman, Daman & Diu', price: 1800, category: 'Beach', images: BEACH_IMAGES.slice(2), amenities: ['WiFi', 'Beach Access', 'Free Parking'], averageRating: 4.0, numReviews: 27, description: 'Affordable beachside bliss in the quiet coastal town of Daman. Perfect for budget travelers seeking clean beaches, fresh fish markets, and a relaxed atmosphere away from the crowds.' },
  { title: 'Anjuna Cliffside Retreat', location: 'Anjuna, Goa', price: 5800, category: 'Beach', images: BEACH_IMAGES, amenities: ['WiFi', 'Pool', 'Beachfront', 'Restaurant', 'Bar', 'Air Conditioning', 'Live Music'], averageRating: 4.8, numReviews: 156, description: 'A bohemian luxury retreat above the iconic Anjuna beach. This property marries Goan architecture with contemporary design, offering a rooftop pool, beach access, and the legendary Anjuna flea market at your doorstep.' },
  
  // MOUNTAINS (13)
  { title: 'Himalayan Cloud Retreat', location: 'Manali, Himachal Pradesh', price: 4800, category: 'Mountains', images: MOUNTAIN_IMAGES, amenities: ['WiFi', 'Fireplace', 'Mountain View', 'Trekking Guides', 'Hot Spring Access', 'Breakfast Included'], averageRating: 4.9, numReviews: 198, description: 'Perched at 7,000 feet with panoramic Himalayan views, this luxury retreat offers cozy apple wood-paneled rooms, crackling fireplaces, and guided treks to ancient Buddhist monasteries. The Beas river gurgles below while snow-capped peaks stretch to the horizon.' },
  { title: 'Shimla Heritage Bungalow', location: 'Shimla, Himachal Pradesh', price: 6200, category: 'Mountains', images: MOUNTAIN_IMAGES.slice(1), amenities: ['WiFi', 'Fireplace', 'Garden', 'Mountain View', 'Colonial Architecture', 'Breakfast Included'], averageRating: 4.7, numReviews: 134, description: 'A magnificent Victorian-era bungalow from the British Raj, lovingly preserved with original teak floors, antique furniture, and wraparound verandas. The Mall Road, Christ Church, and Jakhu Temple are all a pleasant walk away.' },
  { title: 'Mussoorie Valley Lodge', location: 'Mussoorie, Uttarakhand', price: 3400, category: 'Mountains', images: MOUNTAIN_IMAGES, amenities: ['WiFi', 'Mountain View', 'Bonfire', 'Trekking', 'Free Parking'], averageRating: 4.5, numReviews: 87, description: 'The "Queen of Hills" at its finest. This cozy lodge offers sweeping Doon Valley views, misty morning walks to Kempty Falls, and cable car rides to Gun Hill. The George Everest estate is a short hike away.' },
  { title: 'Darjeeling Tea Plantation Estate', location: 'Darjeeling, West Bengal', price: 5500, category: 'Mountains', images: MOUNTAIN_IMAGES.slice(2), amenities: ['WiFi', 'Tea Tasting', 'Mountain View', 'Sunrise Trek', 'Breakfast Included', 'Fireplace'], averageRating: 4.8, numReviews: 167, description: 'Stay in a restored colonial planter\'s bungalow surrounded by emerald tea gardens with Kanchenjunga as your backdrop. Wake before dawn to see the world\'s third-highest peak turn golden at sunrise from Tiger Hill.' },
  { title: 'Ooty Nilgiri Cottage', location: 'Ooty, Tamil Nadu', price: 2900, category: 'Mountains', images: MOUNTAIN_IMAGES, amenities: ['WiFi', 'Garden', 'Mountain View', 'Fireplace', 'Lake Nearby'], averageRating: 4.4, numReviews: 72, description: 'A charming stone cottage in the Blue Mountains, surrounded by eucalyptus forests and rose gardens. Ride the historic Nilgiri Mountain Railway, explore the Government Botanical Gardens, and sip fresh Nilgiri tea by the fireplace.' },
  { title: 'Kasauli Pine Forest Cabin', location: 'Kasauli, Himachal Pradesh', price: 3800, category: 'Mountains', images: MOUNTAIN_IMAGES.slice(1), amenities: ['WiFi', 'Fireplace', 'Pine Forest View', 'Hiking Trails', 'Quiet & Peaceful'], averageRating: 4.6, numReviews: 93, description: 'A secluded log cabin deep in the silver oak and pine forests of Kasauli. This former British cantonment offers the most peaceful Himalayan escape - no traffic, no noise, just birdsong and mountain air.' },
  { title: 'Spiti Valley Star Camp', location: 'Kaza, Spiti Valley', price: 2400, category: 'Mountains', images: MOUNTAIN_IMAGES, amenities: ['WiFi', 'Mountain View', 'Monastery Tours', 'Stargazing', 'Local Cuisine'], averageRating: 4.7, numReviews: 61, description: 'Experience the rugged, otherworldly beauty of Spiti Valley at 12,500 feet. Whitewashed Buddhist monasteries cling to dramatic cliffs, yaks roam free, and the night sky offers some of India\'s best stargazing away from light pollution.' },
  { title: 'Coorg Coffee Estate Villa', location: 'Coorg, Karnataka', price: 5100, category: 'Mountains', images: MOUNTAIN_IMAGES.slice(2), amenities: ['WiFi', 'Pool', 'Coffee Plantation Tour', 'Waterfall Hike', 'All Meals Included'], averageRating: 4.8, numReviews: 189, description: 'Immerse yourself in the fragrant coffee and cardamom plantations of Kodagu. This 150-acre estate offers plantation walks, waterfall treks, river rafting on the Cauvery, and the most aromatic wake-up call imaginable.' },
  { title: 'Munnar Misty Valley Resort', location: 'Munnar, Kerala', price: 4200, category: 'Mountains', images: MOUNTAIN_IMAGES, amenities: ['WiFi', 'Mountain View', 'Tea Garden', 'Trekking', 'Breakfast Included', 'Spa'], averageRating: 4.6, numReviews: 145, description: 'Drift through clouds in this misty paradise where rolling tea gardens meet the sky. Spot Nilgiri Tahr on guided treks, watch tea being processed at century-old factories, and enjoy Ayurvedic treatments as clouds swirl around your hilltop cottage.' },
  { title: 'Auli Ski Resort Chalet', location: 'Auli, Uttarakhand', price: 6500, category: 'Mountains', images: MOUNTAIN_IMAGES.slice(1), amenities: ['WiFi', 'Ski-in Ski-out', 'Mountain View', 'Cable Car Access', 'Hot Tub', 'Fireplace'], averageRating: 4.9, numReviews: 78, description: 'India\'s premier ski destination offers world-class slopes with Nanda Devi as your backdrop. This ski-in ski-out chalet provides direct access to Asia\'s longest cable car and some of the best powder snow in the subcontinent.' },
  { title: 'Tawang Monastery View Hotel', location: 'Tawang, Arunachal Pradesh', price: 3100, category: 'Mountains', images: MOUNTAIN_IMAGES, amenities: ['WiFi', 'Monastery View', 'Local Cuisine', 'Mountain View', 'Guided Tours'], averageRating: 4.5, numReviews: 44, description: 'One of the most remote and breathtaking destinations in India. Wake up to views of Asia\'s largest Buddhist monastery, explore ancient Tibetan culture, and trek through pristine forests where rare orchids bloom.' },
  { title: 'Kodaikanal Lake Cottage', location: 'Kodaikanal, Tamil Nadu', price: 3300, category: 'Mountains', images: MOUNTAIN_IMAGES.slice(2), amenities: ['WiFi', 'Lake View', 'Cycling', 'Boating', 'Fireplace'], averageRating: 4.4, numReviews: 82, description: 'A romantic lakeside cottage in the "Princess of Hill Stations." Row across the star-shaped lake, cycle through silent silver oak forests, explore the magnificent Pillar Rocks, and savor homemade chocolate from local confectioneries.' },
  { title: 'Pelling Kanchenjunga View Suite', location: 'Pelling, Sikkim', price: 4700, category: 'Mountains', images: MOUNTAIN_IMAGES, amenities: ['WiFi', 'Mountain View', 'Monastery Visits', 'Breakfast Included', 'Hot Spring', 'Trekking'], averageRating: 4.8, numReviews: 103, description: 'Arguably India\'s most stunning mountain view from a hotel window - Kanchenjunga, the world\'s third-highest peak, fills your entire field of vision. Buddhist monasteries, hidden waterfalls, and natural hot springs complete this Himalayan paradise.' },

  // CITIES (13)
  { title: 'Mumbai Skyline Penthouse', location: 'Mumbai, Maharashtra', price: 9500, category: 'Cities', images: CITY_IMAGES, amenities: ['WiFi', 'Rooftop Pool', 'Concierge', 'Sea View', 'Gym', 'Air Conditioning', 'City View'], averageRating: 4.9, numReviews: 234, description: 'A breathtaking penthouse perched above the glittering Mumbai skyline with 360-degree views of the Arabian Sea and the city. Minutes from the Gateway of India, Marine Drive, and the finest restaurants in India\'s culinary capital.' },
  { title: 'Delhi Heritage Haveli', location: 'Old Delhi, Delhi', price: 4800, category: 'Cities', images: CITY_IMAGES.slice(1), amenities: ['WiFi', 'Rooftop Terrace', 'Heritage Architecture', 'Mughal Cuisine', 'Walking Tours', 'Air Conditioning'], averageRating: 4.7, numReviews: 156, description: 'Step inside a 200-year-old haveli in the heart of Old Delhi\'s labyrinthine lanes. Hand-carved jali screens, frescoed ceilings, and a fragrant rose garden transport you to the Mughal era, while Chandni Chowk\'s legendary street food awaits steps away.' },
  { title: 'Bangalore Tech Hub Suite', location: 'Koramangala, Bangalore', price: 3200, category: 'Cities', images: CITY_IMAGES, amenities: ['WiFi', 'Co-working Space', 'Gym', 'Rooftop Bar', 'Air Conditioning', 'Smart Home'], averageRating: 4.5, numReviews: 189, description: 'A sleek, tech-forward apartment in Bangalore\'s vibrant startup hub. Ultra-fast internet, smart home controls, standing desks, and a rooftop bar with city views make this the perfect base for digital nomads and business travelers.' },
  { title: 'Jaipur Pink City Palace', location: 'Jaipur, Rajasthan', price: 7200, category: 'Cities', images: CITY_IMAGES.slice(2), amenities: ['WiFi', 'Pool', 'Elephant Rides', 'Rajasthani Cuisine', 'Heritage Décor', 'City Tours', 'Air Conditioning'], averageRating: 4.9, numReviews: 312, description: 'A boutique heritage hotel in a restored 18th-century merchant\'s mansion within the Pink City walls. Ornate Rajput architecture, a courtyard pool, folk music performances, and a location minutes from Hawa Mahal and the City Palace.' },
  { title: 'Varanasi Ganga View Guesthouse', location: 'Varanasi, Uttar Pradesh', price: 2800, category: 'Cities', images: CITY_IMAGES, amenities: ['WiFi', 'Ganga View', 'Boat Rides', 'Yoga', 'Meditation', 'Breakfast Included'], averageRating: 4.6, numReviews: 178, description: 'Witness the eternal city of Varanasi from a private rooftop terrace overlooking the sacred Ganges. Watch morning aarti ceremonies, take sunrise boat rides past ancient ghats, and experience the profound spiritual heart of India.' },
  { title: 'Hyderabad Nizam Palace Suite', location: 'Hyderabad, Telangana', price: 6100, category: 'Cities', images: CITY_IMAGES.slice(1), amenities: ['WiFi', 'Pool', 'Hyderabadi Biryani', 'Heritage Tours', 'Concierge', 'Air Conditioning'], averageRating: 4.7, numReviews: 143, description: 'Experience the opulence of the Nizam era in this lavishly restored palace hotel. Eat the finest Hyderabadi biryani, visit Charminar and Golconda Fort, and lose yourself in the pearl bazaars of the City of Pearls.' },
  { title: 'Chennai Marina Apartment', location: 'Chennai, Tamil Nadu', price: 3600, category: 'Cities', images: CITY_IMAGES, amenities: ['WiFi', 'Beach Proximity', 'Air Conditioning', 'Temple Tours', 'Gym'], averageRating: 4.3, numReviews: 97, description: 'Modern apartment a short stroll from the world\'s second-longest urban beach. Explore thousand-year-old Dravidian temples, authentic Chettinad cuisine, and the thriving arts scene of Tamil Nadu\'s capital.' },
  { title: 'Ahmedabad Heritage Home', location: 'Ahmedabad, Gujarat', price: 3900, category: 'Cities', images: CITY_IMAGES.slice(2), amenities: ['WiFi', 'Heritage Architecture', 'Street Food Tours', 'Air Conditioning', 'Courtyard'], averageRating: 4.5, numReviews: 88, description: 'Stay in a beautifully restored pol house in Ahmedabad\'s UNESCO World Heritage old city. The intricate wooden facades, secret passageways, and neighborhood temples offer an authentic window into 600-year-old Gujarati urban life.' },
  { title: 'Kolkata Art Deco Apartment', location: 'Kolkata, West Bengal', price: 2600, category: 'Cities', images: CITY_IMAGES, amenities: ['WiFi', 'Art Deco Architecture', 'Cultural Tours', 'Air Conditioning', 'Library'], averageRating: 4.4, numReviews: 76, description: 'A stunning Art Deco apartment in the City of Joy, where British colonial grandeur meets Bengali intellectual culture. Visit Victoria Memorial, the Howrah Bridge, and sample mishti doi and kathi rolls from legendary street vendors.' },
  { title: 'Udaipur Lake Palace View Hotel', location: 'Udaipur, Rajasthan', price: 8800, category: 'Cities', images: CITY_IMAGES.slice(1), amenities: ['WiFi', 'Lake View', 'Pool', 'Sunset Boat Ride', 'Rajasthani Cuisine', 'Air Conditioning'], averageRating: 4.9, numReviews: 267, description: 'The "Venice of the East" from the most romantic vantage point possible - a heritage hotel with unobstructed views of the Lake Palace floating on Pichola Lake. Rajput architecture, meenakari jewelry workshops, and sunset boat cruises.' },
  { title: 'Amritsar Golden Temple Retreat', location: 'Amritsar, Punjab', price: 2400, category: 'Cities', images: CITY_IMAGES, amenities: ['WiFi', 'Temple Views', 'Punjabi Cuisine', 'Air Conditioning', 'Langar Access'], averageRating: 4.6, numReviews: 134, description: 'A peaceful retreat steps from the magnificent Golden Temple, the spiritual home of the Sikh faith. The glittering Harmandir Sahib at sunrise is an experience that transforms visitors. Witness the emotional Wagah Border ceremony at sunset.' },
  { title: 'Kochi Fort Dutch Bungalow', location: 'Fort Kochi, Kerala', price: 4100, category: 'Cities', images: CITY_IMAGES.slice(2), amenities: ['WiFi', 'Heritage Architecture', 'Chinese Fishing Nets', 'Kathakali Shows', 'Breakfast Included', 'Cycling'], averageRating: 4.7, numReviews: 121, description: 'A colonial-era Dutch bungalow in the atmospheric Fort Kochi heritage district. Giant Chinese fishing nets cast silhouettes against golden sunsets, spice warehouses perfume the air, and Kathakali dancers perform by torchlight.' },
  { title: 'Mysore Royal City Hotel', location: 'Mysore, Karnataka', price: 4400, category: 'Cities', images: CITY_IMAGES, amenities: ['WiFi', 'Palace Views', 'Pool', 'Silk Shopping', 'Yoga', 'Air Conditioning'], averageRating: 4.6, numReviews: 108, description: 'Elegant hotel in the Cultural Capital of Karnataka, with views of the illuminated Mysore Palace. Explore sandalwood workshops, silk weaving units, and the fragrant Devaraja Market. The Dasara festival transforms the city into a fairytale.' },

  // VILLAS (11)
  { title: 'Royal Rajputana Villa', location: 'Jodhpur, Rajasthan', price: 11000, category: 'Villas', images: VILLA_IMAGES, amenities: ['Private Pool', 'Chef', 'Concierge', 'Heritage Architecture', 'Desert Safari', 'WiFi', 'Air Conditioning'], averageRating: 5.0, numReviews: 89, description: 'An exclusive 14th-century fort converted into a private villa with 6 suites, a private chef specializing in royal Rajput cuisine, and panoramic views of the blue city of Jodhpur. The Mehrangarh Fort looms magnificently above.' },
  { title: 'Kerala Backwater Houseboat Villa', location: 'Alleppey, Kerala', price: 7800, category: 'Villas', images: VILLA_IMAGES.slice(1), amenities: ['Private Pool', 'Chef', 'Backwater Cruise', 'Fishing', 'All Meals Included', 'WiFi'], averageRating: 4.9, numReviews: 134, description: 'A premium traditional kettuvallam (rice boat) converted into a luxury floating villa. Drift through emerald backwaters flanked by coconut palms, watch traditional canoe snake boat races, and feast on freshly caught prawns prepared by your personal chef.' },
  { title: 'Goa Portuguese Villa Azul', location: 'Panjim, Goa', price: 9200, category: 'Villas', images: VILLA_IMAGES, amenities: ['Private Pool', 'Garden', 'Beach Access', 'Breakfast Included', 'Heritage Architecture', 'WiFi', 'Chef'], averageRating: 4.8, numReviews: 156, description: 'A magnificent 18th-century Indo-Portuguese mansion with original azulejo tiles, four-poster beds, and a private tropical garden leading to a secluded beach. Fontainhas, Goa\'s Latin Quarter, is at your doorstep.' },
  { title: 'Tamil Nadu Chettinad Mansion', location: 'Karaikudi, Tamil Nadu', price: 8100, category: 'Villas', images: VILLA_IMAGES.slice(2), amenities: ['Private Pool', 'Chef', 'Cooking Classes', 'Antique Décor', 'Heritage Architecture', 'WiFi'], averageRating: 4.9, numReviews: 67, description: 'One of the finest Chettinad mansions open for private stays. Built with Burmese teak, Italian marble, and Athangudi tiles by a wealthy 19th-century spice merchant, it houses 2,000 antiques and an in-house culinary expert teaching Chettinad cooking.' },
  { title: 'Himachal Apple Orchard Villa', location: 'Sangla Valley, Himachal', price: 6400, category: 'Villas', images: VILLA_IMAGES, amenities: ['Private Garden', 'Apple Orchard', 'River View', 'Mountain View', 'Fireplace', 'WiFi', 'Breakfast Included'], averageRating: 4.7, numReviews: 54, description: 'A private villa nestled in a 50-acre apple and cherry orchard in the stunning Baspa Valley. Harvest fresh fruit from the trees, trek to ancient Kinnauri villages, and watch shepherds migrate with their flocks through ancient mountain passes.' },
  { title: 'Pondicherry French Villa Rosa', location: 'White Town, Pondicherry', price: 7500, category: 'Villas', images: VILLA_IMAGES.slice(1), amenities: ['Private Pool', 'Garden', 'Heritage Architecture', 'French Cuisine', 'WiFi', 'Air Conditioning', 'Yoga'], averageRating: 4.8, numReviews: 112, description: 'A beautifully restored 200-year-old French colonial villa in Pondicherry\'s charming White Town, with a private courtyard pool, fragrant jasmine garden, and a Michelin-trained chef specializing in French-Tamil fusion cuisine.' },
  { title: 'Madhya Pradesh Wildlife Villa', location: 'Bandhavgarh, Madhya Pradesh', price: 13500, category: 'Villas', images: VILLA_IMAGES, amenities: ['Private Pool', 'Safari', 'Chef', 'Wildlife Guides', 'Naturalist', 'WiFi', 'All Meals'], averageRating: 5.0, numReviews: 43, description: 'India\'s finest wildlife villa adjacent to Bandhavgarh National Park, home to the highest density of Bengal tigers in the world. Your personal naturalist arranges exclusive morning and evening safaris, while evenings are spent by a bonfire under a canopy of stars.' },
  { title: 'Karnataka Coffee Estate Villa', location: 'Chikmagalur, Karnataka', price: 8900, category: 'Villas', images: VILLA_IMAGES.slice(2), amenities: ['Private Pool', 'Chef', 'Coffee Tour', 'Trekking', 'Bird Watching', 'WiFi', 'All Meals'], averageRating: 4.8, numReviews: 78, description: 'An extraordinary private villa on a working 200-acre coffee and pepper estate in the Western Ghats. The Mullayanagiri peak looms above, rare Malabar giant squirrels play in ancient trees, and your coffee journey from cherry to cup is intimate and educational.' },
  { title: 'Rajasthan Desert Luxury Camp', location: 'Jaisalmer, Rajasthan', price: 9800, category: 'Villas', images: VILLA_IMAGES, amenities: ['Private Tent', 'Camel Safari', 'Folk Music', 'Star Gazing', 'All Meals', 'WiFi'], averageRating: 4.9, numReviews: 167, description: 'The ultimate Thar Desert experience in a luxuriously appointed private camp. Swiss-style tented suites with plush bedding, private sit-outs, and an unobstructed view of the Milky Way. Camel safaris to ancient ruins and evenings with live folk musicians.' },
  { title: 'Uttarakhand Organic Farm Villa', location: 'Kumaon Hills, Uttarakhand', price: 5900, category: 'Villas', images: VILLA_IMAGES.slice(1), amenities: ['Organic Farm', 'Mountain View', 'Cooking Classes', 'Trekking', 'Fireplace', 'WiFi', 'All Meals'], averageRating: 4.7, numReviews: 56, description: 'A 50-acre organic farm villa at 6,500 feet in the Kumaon Himalayas with commanding views of Nanda Devi. Farm to table takes on new meaning when you harvest your own vegetables, gather freshly laid eggs, and cook alongside our local chef.' },
  { title: 'Andhra Pradesh Palatial Mansion', location: 'Visakhapatnam, Andhra Pradesh', price: 7100, category: 'Villas', images: VILLA_IMAGES, amenities: ['Private Pool', 'Sea View', 'Chef', 'Beach Access', 'Heritage Architecture', 'WiFi', 'Air Conditioning'], averageRating: 4.6, numReviews: 61, description: 'A palatial 1920s mansion perched on a hillock above the Bay of Bengal with sweeping sea views and private beach access. Ornate Kalinga architecture, handpainted ceilings, and authentic Andhra cuisine make this an extraordinary cultural retreat.' },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, family: 4 });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Listing.deleteMany({});
    console.log('🗑️  Cleared existing listings');

    // Create or find a host user
    let host = await User.findOne({ email: 'admin@wanderlust.com' });
    if (!host) {
      host = new User({ name: 'Wanderlust Admin', email: 'admin@wanderlust.com', password: 'admin123', role: 'host' });
      await host.save();
      console.log('👤 Created admin host user');
    }

    // Create listings
    const listings = LISTINGS_DATA.map(l => ({ ...l, host: host._id }));
    await Listing.insertMany(listings);
    console.log(`🏠 Created ${listings.length} listings`);

    // Create sample traveler
    let traveler = await User.findOne({ email: 'traveler@wanderlust.com' });
    if (!traveler) {
      traveler = new User({ name: 'Emily Chen', email: 'traveler@wanderlust.com', password: 'traveler123', role: 'traveler' });
      await traveler.save();
      console.log('👤 Created sample traveler user');
    }

    console.log('\n✅ Seed complete!');
    console.log('📧 Host login: admin@wanderlust.com / admin123');
    console.log('📧 Traveler login: traveler@wanderlust.com / traveler123');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();