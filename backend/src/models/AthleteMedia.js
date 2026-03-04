const mongoose = require('mongoose');

const athleteMediaSchema = new mongoose.Schema({
    athleteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    videoUrl: {
        type: String,
        trim: true,
        default: ''
    },
    images: [{
        url: { type: String, required: true },
        title: { type: String, default: '' },
        createdAt: { type: Date, default: Date.now }
    }],
    performanceClipUrl: {
        type: String,
        trim: true,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('AthleteMedia', athleteMediaSchema);
