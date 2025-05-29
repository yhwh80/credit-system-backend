const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bids: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      message: String,
      accepted: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  maxBids: { type: Number, default: 3 },
  status: {
    type: String,
    enum: ['open', 'in progress', 'completed'],
    default: 'open'
  },
  ratings: [ // ✅ NEW
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      score: { type: Number, min: 1, max: 5 },
      comment: String
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('Job', jobSchema);
