const mongoose = require('mongoose');
const Channel = require('./Models/Channel');
require('dotenv').config({ path: './.env' });

const initialChannels = [
  {
    name: "Stack Adda (Official)",
    description: "Our main hub for full-length web development tutorials, coding bootcamps, and developer career guidance.",
    url: "https://www.youtube.com/@stackadda",
    avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80",
    subscribers: "12K+",
    videos: "150+",
    status: "Published",
    featured: true
  },
  {
    name: "Stack Adda Shorts",
    description: "Quick coding hacks, web layout tricks, and short-form interactive coding tips in under 60 seconds.",
    url: "https://www.youtube.com/@stackadda",
    avatar: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=150&q=80",
    subscribers: "5K+",
    videos: "80+",
    status: "Coming Soon",
    featured: false
  },
  {
    name: "Stack Adda English",
    description: "Dedicated learning hub for our global community, presenting core software engineering concepts in English.",
    url: "https://www.youtube.com/@stackadda",
    avatar: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=150&q=80",
    subscribers: "3K+",
    videos: "40+",
    status: "Coming Soon",
    featured: false
  },
  {
    name: "Stack Adda Live Hub",
    description: "Replays of all our intensive live class broadcasts, Q&A bootcamps, and real-time code refactoring hackathons.",
    url: "https://www.youtube.com/@stackadda",
    avatar: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&w=150&q=80",
    subscribers: "8K+",
    videos: "120+",
    status: "Coming Soon",
    featured: false
  }
];

const seedChannels = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing to avoid duplicates in testing
    await Channel.deleteMany();
    console.log('Cleared existing channels');

    await Channel.insertMany(initialChannels);
    console.log('Successfully seeded 4 initial channels');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding channels:', error);
    process.exit(1);
  }
};

seedChannels();
