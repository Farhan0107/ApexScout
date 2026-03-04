const mongoose = require('mongoose');

// RAW METRICS (real world constraints)
const rawMetricsSchema = new mongoose.Schema(
    {
        speed: { type: Number, default: 0, min: 0, max: 100 },
        verticalLeap: { type: Number, default: 0, min: 0, max: 60 },
        wingspan: { type: Number, default: 0, min: 0, max: 120 },
        pointsPerGame: { type: Number, default: 0, min: 0, max: 150 },
        assists: { type: Number, default: 0, min: 0, max: 50 },
        stamina: { type: Number, default: 0, min: 0, max: 100 },
    },
    { _id: false }
);

// NORMALIZED METRICS (percentage scale)
const normalizedMetricsSchema = new mongoose.Schema(
    {
        speed: { type: Number, default: 0, min: 0, max: 100 },
        verticalLeap: { type: Number, default: 0, min: 0, max: 100 },
        wingspan: { type: Number, default: 0, min: 0, max: 100 },
        pointsPerGame: { type: Number, default: 0, min: 0, max: 100 },
        assists: { type: Number, default: 0, min: 0, max: 100 },
        stamina: { type: Number, default: 0, min: 0, max: 100 },
    },
    { _id: false }
);

const athleteProfileSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        sportType: {
            type: String,
            required: [true, 'Please specify the sport type'],
            index: true,
        },
        rawMetrics: rawMetricsSchema,
        normalizedMetrics: normalizedMetricsSchema,
        isVerified: {
            type: Boolean,
            default: false,
            index: true,
        },
        verifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
athleteProfileSchema.index({ "rawMetrics.verticalLeap": 1 });
athleteProfileSchema.index({ "rawMetrics.speed": 1 });
athleteProfileSchema.index({ "rawMetrics.pointsPerGame": 1 });
athleteProfileSchema.index({ sportType: 1, "rawMetrics.verticalLeap": -1 });

module.exports = mongoose.model('AthleteProfile', athleteProfileSchema);