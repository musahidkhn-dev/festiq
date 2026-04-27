export const currentUser = {
  id: "u001",
  name: "Arjun Sharma",
  email: "arjun@moodgo.in",
  city: "Mumbai",
  avatar: "https://i.pravatar.cc/150?img=8",
  role: "user",
  joinedDate: "January 2024",
  eventsAttended: 12,
  ticketsBooked: 18,
  reviews: 5
}

export const events = [
  {
    id: "e001",
    title: "Sunburn Festival 2025",
    category: "Music",
    date: "April 12, 2025",
    time: "6:00 PM",
    venue: "Vagator Beach, Goa",
    price: 1499,
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800",
    trending: true,
    badge: "Trending 🔥",
    rating: 4.8,
    totalTickets: 5000,
    soldTickets: 4200,
    description: "Asia's largest electronic music festival returns to Goa with an incredible lineup of international and homegrown DJs. Experience three days of non-stop music, art installations, and beachside vibes.",
    performers: ["Martin Garrix", "Hardwell", "KSHMR"],
    tags: ["EDM", "Festival", "Outdoor"]
  },
  {
    id: "e002",
    title: "Canvas Laugh Club — Stand Up Night",
    category: "Comedy",
    date: "March 28, 2025",
    time: "8:00 PM",
    venue: "Canvas Laugh Club, Mumbai",
    price: 499,
    image: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800",
    trending: false,
    badge: "Selling Fast ⚡",
    rating: 4.5,
    totalTickets: 200,
    soldTickets: 180,
    description: "Mumbai's best stand-up comedians on one stage. An evening of non-stop laughter with some of India's most beloved comics.",
    performers: ["Zakir Khan", "Biswa Kalyan Rath"],
    tags: ["Comedy", "Indoor", "Adults"]
  },
  {
    id: "e003",
    title: "IPL: MI vs CSK",
    category: "Sports",
    date: "April 5, 2025",
    time: "7:30 PM",
    venue: "Wankhede Stadium, Mumbai",
    price: 999,
    image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800",
    trending: true,
    badge: "Trending 🔥",
    rating: 4.9,
    totalTickets: 33000,
    soldTickets: 30000,
    description: "The ultimate cricket rivalry — Mumbai Indians take on Chennai Super Kings in what promises to be the match of the season.",
    performers: ["Rohit Sharma", "MS Dhoni"],
    tags: ["Cricket", "IPL", "Sports"]
  },
  {
    id: "e004",
    title: "Kiran Nadar Art Exhibition",
    category: "Art",
    date: "April 20, 2025",
    time: "10:00 AM",
    venue: "KNMA, New Delhi",
    price: 299,
    image: "https://images.unsplash.com/photo-1531913764164-f85c52e6e654?w=800",
    trending: false,
    badge: "",
    rating: 4.3,
    totalTickets: 500,
    soldTickets: 210,
    description: "A curated exhibition of modern Indian art featuring works from established and emerging artists.",
    performers: [],
    tags: ["Art", "Exhibition", "Culture"]
  },
  {
    id: "e005",
    title: "Delhi Food & Music Fest",
    category: "Food",
    date: "May 3, 2025",
    time: "12:00 PM",
    venue: "JLN Stadium, Delhi",
    price: 799,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
    trending: false,
    badge: "New 🎉",
    rating: 4.6,
    totalTickets: 3000,
    soldTickets: 1200,
    description: "200+ food stalls, live music, celebrity chefs — the ultimate food carnival experience in the heart of Delhi.",
    performers: ["Ranveer Brar"],
    tags: ["Food", "Music", "Family"]
  },
  {
    id: "e006",
    title: "Nucleya Live — Bass Drop",
    category: "Music",
    date: "May 15, 2025",
    time: "9:00 PM",
    venue: "NSCI Dome, Mumbai",
    price: 1299,
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
    trending: true,
    badge: "Trending 🔥",
    rating: 4.7,
    totalTickets: 8000,
    soldTickets: 6500,
    description: "India's bass king returns with his biggest show yet. Featuring mind-blowing visuals, heavy drops, and surprise collaborations.",
    performers: ["Nucleya", "Seedhe Maut"],
    tags: ["Bass", "Electronic", "Live"]
  }
]

export const myTickets = {
  upcoming: [
    {
      id: "t001",
      eventTitle: "Sunburn Festival 2025",
      date: "April 12, 2025",
      venue: "Vagator Beach, Goa",
      seat: "GA - Section B",
      ticketCode: "MOODGO-SUB-2025-001",
      type: "VIP",
      price: 2999,
      status: "confirmed",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400"
    },
    {
      id: "t002",
      eventTitle: "IPL: MI vs CSK",
      date: "April 5, 2025",
      venue: "Wankhede Stadium, Mumbai",
      seat: "Stand C - Row 12 - Seat 45",
      ticketCode: "MOODGO-IPL-2025-002",
      type: "General",
      price: 999,
      status: "confirmed",
      image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400"
    }
  ],
  past: [
    {
      id: "t003",
      eventTitle: "Coldplay World Tour — Mumbai",
      date: "January 18, 2025",
      venue: "DY Patil Stadium, Mumbai",
      seat: "Pit - Zone A",
      ticketCode: "MOODGO-COLD-2025-003",
      type: "VVIP",
      price: 12999,
      status: "attended",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400"
    }
  ],
  cancelled: [
    {
      id: "t004",
      eventTitle: "Comedy Night — Bangalore",
      date: "February 10, 2025",
      venue: "Phoenix Marketcity, Bangalore",
      ticketCode: "MOODGO-COM-2025-004",
      type: "General",
      price: 399,
      status: "cancelled",
      image: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=400"
    }
  ]
}

export const ticketTiers = [
  {
    id: "general",
    name: "General",
    price: 1499,
    perks: ["Entry to main stage", "Food court access"],
    available: 800,
    color: "border-white/10"
  },
  {
    id: "vip",
    name: "VIP",
    price: 2999,
    perks: ["Front row access", "Backstage pass", "Free drinks", "Merch kit"],
    available: 120,
    color: "border-violet-500"
  },
  {
    id: "vvip",
    name: "VVIP",
    price: 6999,
    perks: ["Artist meet & greet", "Luxury lounge", "Premium bar", "Exclusive merch"],
    available: 20,
    color: "border-amber-500"
  }
]

export const adminStats = {
  totalEvents: 248,
  totalRevenue: "₹18.4L",
  totalUsers: 15420,
  ticketsSold: 32180
}

export const adminUsers = [
  { id: "u001", name: "Arjun Sharma", email: "arjun@moodgo.in", role: "user", status: "active", tickets: 18, joined: "Jan 2024", avatar: "https://i.pravatar.cc/32?img=8" },
  { id: "u002", name: "Priya Mehta", email: "priya@moodgo.in", role: "organizer", status: "active", tickets: 5, joined: "Mar 2024", avatar: "https://i.pravatar.cc/32?img=5" },
  { id: "u003", name: "Rohan Das", email: "rohan@moodgo.in", role: "user", status: "banned", tickets: 2, joined: "Feb 2024", avatar: "https://i.pravatar.cc/32?img=12" },
  { id: "u004", name: "Sneha Iyer", email: "sneha@moodgo.in", role: "admin", status: "active", tickets: 0, joined: "Dec 2023", avatar: "https://i.pravatar.cc/32?img=16" }
]

export const adminOrders = [
  { id: "o001", user: "Arjun Sharma", event: "Sunburn Festival", amount: "₹2,999", status: "confirmed", date: "Mar 10, 2025" },
  { id: "o002", user: "Priya Mehta", event: "IPL: MI vs CSK", amount: "₹999", status: "confirmed", date: "Mar 11, 2025" },
  { id: "o003", user: "Rohan Das", event: "Comedy Night", amount: "₹399", status: "cancelled", date: "Mar 8, 2025" },
  { id: "o004", user: "Sneha Iyer", event: "Delhi Food Fest", amount: "₹799", status: "pending", date: "Mar 12, 2025" }
]

export const coupons = [
  { id: "c001", code: "MOODGO20", discount: "20%", type: "percent", active: true, used: 142, expires: "Apr 30, 2025" },
  { id: "c002", code: "FIRST500", discount: "₹500", type: "flat", active: true, used: 89, expires: "May 15, 2025" },
  { id: "c003", code: "SUNBURN10", discount: "10%", type: "percent", active: false, used: 312, expires: "Mar 1, 2025" }
]

export const revenueChart = [
  { month: "Oct", value: 65 },
  { month: "Nov", value: 80 },
  { month: "Dec", value: 95 },
  { month: "Jan", value: 70 },
  { month: "Feb", value: 85 },
  { month: "Mar", value: 100 }
]

export const comments = [
  { id: "cm001", user: "Priya M.", avatar: "https://i.pravatar.cc/40?img=5", rating: 5, text: "Absolutely mind-blowing experience! Best festival ever.", date: "Mar 5, 2025", likes: 24 },
  { id: "cm002", user: "Karan S.", avatar: "https://i.pravatar.cc/40?img=12", rating: 4, text: "Amazing lineup, crowd was electric. Logistics could be better.", date: "Mar 4, 2025", likes: 18 },
  { id: "cm003", user: "Ananya R.", avatar: "https://i.pravatar.cc/40?img=16", rating: 5, text: "Zakir Khan was absolutely hilarious, cried laughing!", date: "Mar 6, 2025", likes: 31 }
]

export const chatMessages = [
  {
    id: "cm001",
    role: "bot",
    message: "Hey! I'm MoodBot 🎉 Tell me your mood and I'll find the perfect events for you!",
    time: "10:00 AM",
    suggestions: ["I'm feeling energetic 🔥", "I want to chill 😌", "Surprise me! 🎲"]
  },
  {
    id: "cm002",
    role: "user",
    message: "I'm feeling energetic, looking for music events this weekend",
    time: "10:01 AM"
  },
  {
    id: "cm003",
    role: "bot",
    message: "🎵 Perfect! Based on your vibe, here are some fire events for you:",
    time: "10:01 AM",
    eventCards: ["e001", "e006"]
  }
]

export const chatHistory = [
  { id: "h1", title: "Music events in Mumbai", date: "Mar 12" },
  { id: "h2", title: "Comedy shows this weekend", date: "Mar 10" },
  { id: "h3", title: "Outdoor events for families", date: "Mar 8" }
]
