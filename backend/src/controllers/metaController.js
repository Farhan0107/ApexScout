const ScoutAthleteMeta = require('../models/ScoutAthleteMeta');

exports.getMeta = async (req, res, next) => {
    try {
        const meta = await ScoutAthleteMeta.findOne({ scoutId: req.user._id, athleteId: req.params.athleteId });
        if (!meta) {
            return res.status(200).json({ success: true, data: { rating: 1, status: 'None', notes: '' } });
        }
        res.status(200).json({ success: true, data: meta });
    } catch (err) {
        next(err);
    }
};

exports.updateMeta = async (req, res, next) => {
    try {
        const { rating, status, notes } = req.body;
        let meta = await ScoutAthleteMeta.findOne({ scoutId: req.user._id, athleteId: req.params.athleteId });

        if (meta) {
            meta.rating = rating !== undefined ? rating : meta.rating;
            meta.status = status !== undefined ? status : meta.status;
            meta.notes = notes !== undefined ? notes : meta.notes;
            await meta.save();
        } else {
            meta = await ScoutAthleteMeta.create({
                scoutId: req.user._id,
                athleteId: req.params.athleteId,
                rating: rating || 1,
                status: status || 'None',
                notes: notes || ''
            });
        }
        res.status(200).json({ success: true, data: meta });
    } catch (err) {
        next(err);
    }
};
