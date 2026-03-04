const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema(
    {
        scoutId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        athleteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index to ensure uniqueness (a scout can follow an athlete only once)
watchlistSchema.index({ scoutId: 1, athleteId: 1 }, { unique: true });

module.exports = mongoose.model('Watchlist', watchlistSchema);
