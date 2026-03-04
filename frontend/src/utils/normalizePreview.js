import { METRIC_LIMITS } from './constants';

/**
 * Normalizes raw metrics for UI preview purposes.
 * Mirrors the backend logic to provide real-time feedback.
 * @param {Object} rawMetrics 
 * @returns {Object}
 */
export const normalizePreview = (rawMetrics) => {
    const normalized = {};

    Object.keys(METRIC_LIMITS).forEach(key => {
        const val = rawMetrics[key] || 0;
        const max = METRIC_LIMITS[key];

        // Formula: (value / max) * 100
        // Capped at 100 and floored at 0
        normalized[key] = Math.min(100, Math.max(0, (val / max) * 100));
    });

    return normalized;
};
