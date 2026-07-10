const mongoose = require("mongoose");
const dns = require("dns");

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MONGO_URI is not configured.");
    }

    // Some Windows/network DNS resolvers reject MongoDB Atlas SRV lookups.
    // Only use public resolvers for mongodb+srv connections, and allow an
    // environment override when a deployment requires a specific resolver.
    if (mongoUri.startsWith("mongodb+srv://")) {
      const servers = (process.env.MONGO_DNS_SERVERS || "1.1.1.1,8.8.8.8")
        .split(",")
        .map((server) => server.trim())
        .filter(Boolean);

      if (servers.length > 0) {
        dns.setServers(servers);
      }
    }

    const conn = await mongoose.connect(mongoUri);

    console.log(`✅ MongoDB Connected: ${conn.connection.name}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Failed");
    console.error(error.message);

    process.exit(1);
  }
};

module.exports = connectDB;
