import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Event from './models/eventModel.js';
import User from './models/userModel.js';

dotenv.config();

const today = new Date();

const events = [
  {
    title: "Neon Beats: EDM Extravaganza",
    description: "Experience the ultimate electronic dance music festival with world-class DJs, stunning visuals, and an electric atmosphere. Join thousands of music lovers for a night of pure euphoria and non-stop dancing under the neon lights.",
    category: "Music Concert",
    eventLocation: "Jio World Garden, BKC, Mumbai",
    eventDate: new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 15 days in future
    eventArtistName: "DJ Zephyr & Friends",
    totalSeats: 5000,
    ticketPrice: 1499,
    duration: "6 Hours",
    status: "upcoming",
    eventImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "AI Horizons Summit 2025",
    description: "The premier technology conference exploring the future of Artificial Intelligence. Connect with industry leaders, researchers, and innovators for keynote speeches, panel discussions, and hands-on workshops on LLMs, Computer Vision, and AI Ethics.",
    category: "Tech Conference",
    eventLocation: "NESCO Center, Goregaon, Mumbai",
    eventDate: new Date(today.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 45 days in future
    eventArtistName: "Dr. Sarah Chen (Google AI)",
    totalSeats: 1200,
    ticketPrice: 4999,
    duration: "8 Hours",
    status: "upcoming",
    eventImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "The Laughter Riot: Stand-up Night",
    description: "Get ready for a night of side-splitting humor and witty observations with India's top stand-up comedians. A perfect evening to unwind, laugh your heart out, and enjoy some great company and snacks.",
    category: "Stand-up Comedy",
    eventLocation: "Canvas Laugh Club, Lower Parel",
    eventDate: today.toISOString().split('T')[0], // Today (Live)
    eventArtistName: "Rahul Dua & Samay Raina",
    totalSeats: 450,
    ticketPrice: 799,
    duration: "2.5 Hours",
    status: "live",
    eventImage: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?q=80&w=2071&auto=format&fit=crop"
  },
  {
    title: "Esports Velocity Pro Invitational",
    description: "Witness the most intense Valorant and BGMI tournament of the year. The top 16 teams battle it out for a massive prize pool and the championship trophy. High-octane action, live commentary, and fan meetups.",
    category: "Gaming",
    eventLocation: "Dome, NSCI, Worli",
    eventDate: new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 60 days in future
    eventArtistName: "Team Mortal vs Team Soul",
    totalSeats: 3000,
    ticketPrice: 599,
    duration: "10 Hours",
    status: "upcoming",
    eventImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Founder's Circle: Startup Meetup",
    description: "An exclusive networking event for entrepreneurs, investors, and early-stage startup enthusiasts. Pitch your ideas, find co-founders, and learn from successful founders who have scaled to unicorns.",
    category: "Startup Meetup",
    eventLocation: "WeWork Galaxy, Bengaluru",
    eventDate: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 10 days in future
    eventArtistName: "Kunal Shah (CRED)",
    totalSeats: 250,
    ticketPrice: 199,
    duration: "4 Hours",
    status: "upcoming",
    eventImage: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Spice Route: Global Food Fest",
    description: "A culinary journey across the globe. Taste authentic cuisines from 30+ countries, enjoy live cooking demonstrations by celebrity chefs, and explore the vibrant food stalls with family and friends.",
    category: "Food Festival",
    eventLocation: "MMRDA Grounds, Mumbai",
    eventDate: new Date(today.getTime() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 120 days in future
    eventArtistName: "Chef Vikas Khanna",
    totalSeats: 10000,
    ticketPrice: 299,
    duration: "2 Days",
    status: "upcoming",
    eventImage: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1974&auto=format&fit=crop"
  },
  {
    title: "Eclipse: Midnight DJ Night",
    description: "The most exclusive rooftop party in the city. Deep house, techno, and melodic beats played by international DJs. Enjoy panoramic city views, premium cocktails, and an elite crowd.",
    category: "DJ Night",
    eventLocation: "AER, Four Seasons, Worli",
    eventDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days in future
    eventArtistName: "DJ Boris Brejcha Style",
    totalSeats: 300,
    ticketPrice: 3500,
    duration: "5 Hours",
    status: "upcoming",
    eventImage: "https://images.unsplash.com/photo-1514525253361-bee8718a7439?q=80&w=2073&auto=format&fit=crop"
  },
  {
    title: "Lenscraft: Photography Workshop",
    description: "Master the art of visual storytelling. Learn advanced lighting techniques, composition secrets, and post-processing workflows from a National Geographic photographer. Perfect for intermediate photographers.",
    category: "Workshop",
    eventLocation: "Jehangir Art Gallery, Fort",
    eventDate: new Date(today.getTime() + 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 25 days in future
    eventArtistName: "Steve McCurry Inspired",
    totalSeats: 50,
    ticketPrice: 2500,
    duration: "6 Hours",
    status: "upcoming",
    eventImage: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=2074&auto=format&fit=crop"
  },
  {
    title: "Vibrant India: Cultural Art Expo",
    description: "A celebration of India's rich heritage through traditional dance, folk music, and indigenous art forms. Explore the diverse cultures of different states under one roof.",
    category: "Cultural Event",
    eventLocation: "Prithvi Theatre, Juhu",
    eventDate: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 10 days in past
    eventArtistName: "Pt. Birju Maharaj Academy",
    totalSeats: 800,
    ticketPrice: 499,
    duration: "4 Hours",
    status: "completed",
    eventImage: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Nexus 2025: The Grand Tech Fest",
    description: "The biggest inter-college technical festival featuring robotics, coding marathons, drone racing, and laser tag. Show off your skills and win prizes worth millions.",
    category: "College Fest",
    eventLocation: "IIT Bombay, Powai",
    eventDate: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days in past
    eventArtistName: "Technical Committee",
    totalSeats: 15000,
    ticketPrice: 150,
    duration: "3 Days",
    status: "completed",
    eventImage: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop"
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    // Find or Create an Admin User to associate with events
    let adminUser = await User.findOne({ isAdmin: true });
    
    if (!adminUser) {
      console.log("No admin user found. Creating a temporary seed-admin...");
      adminUser = await User.create({
        name: "Seed Admin",
        email: "admin@festiq.com",
        phone: "0000000000",
        password: "password123", // Note: In a real app, this should be hashed
        isAdmin: true,
        isActive: true
      });
    }

    // Prepare events with user ID
    const eventsWithUser = events.map(event => ({
      ...event,
      user: adminUser._id
    }));

    // Clear existing events to fix broken images from previous runs
    await Event.deleteMany({});
    console.log("Cleared existing events...");
    
    await Event.insertMany(eventsWithUser);
    console.log("Demo events with verified high-quality images successfully seeded!");
    
    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDB();
