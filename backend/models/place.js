const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  image_url: String,
  coordinates: {
    type: { type: String, default: 'Point' },
    coordinates: [Number],  // [longitude, latitude]
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Place', placeSchema);
