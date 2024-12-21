const mongoose = require('mongoose');


async function connectMongoDB() {
  const result = await mongoose.connect('mongodb://localhost:27017/blog-app');
  result?console.log("Connected to MongoDB"):console.log("Failed to connect to MongoDB");
}

module.exports = connectMongoDB;
