const mongoose = require('mongoose');
async function connectMongoDB() {
  const result = await mongoose.connect(process.env.MongoDB_URL);
  result?console.log("Connected to MongoDB"):console.log("Failed to connect to MongoDB");
}

module.exports = connectMongoDB;
