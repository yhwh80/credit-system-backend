const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['client', 'professional'], default: 'professional' },
  credits: { type: Number, default: 0 },

  // ✅ Add these fields for directory functionality
  category: { type: String },         // e.g., "Boiler Engineer"
  location: { type: String },         // e.g., "London"
  rating: { type: Number },           // e.g., 4.8
  isFeatured: { type: Boolean, default: false },
  isRecommended: { type: Boolean, default: false },
  recommendationsCount: { type: Number, default: 0 },
  bio: { type: String },
  reviews: [
    {
      rating: Number,
      comment: String,
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
