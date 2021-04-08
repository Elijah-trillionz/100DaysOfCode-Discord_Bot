const mongoose = require('mongoose');

const BotTrackerSchema = new mongoose.Schema({
  bot: {
    type: String,
    default: 'bot-tracker',
  },
  submittedReportsIds: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model('BotTracker', BotTrackerSchema);
