const mongoose = require('mongoose');

const metaSchema = new mongoose.Schema({
    scoutId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    athleteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 1
    },
    status: {
        type: String,
        enum: ['Prospect', 'Shortlisted', 'Contacted', 'Signed', 'Pass'],
        default: 'Prospect'
    },
    notes: {
        type: String,
        default: ''
    }
}, { timestamps: true });

metaSchema.index({ scoutId: 1, athleteId: 1 }, { unique: true });

module.exports = mongoose.model('ScoutAthleteMeta', metaSchema);
