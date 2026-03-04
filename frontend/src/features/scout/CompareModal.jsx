import React, { useMemo } from 'react';
import { X, Shield, Activity } from 'lucide-react';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

const CompareModal = ({ athletes, onClose }) => {
    if (!athletes || athletes.length < 2) return null;

    const [a1, a2] = athletes;
    const name1 = a1.userId?.name || 'Athlete 1';
    const name2 = a2.userId?.name || 'Athlete 2';

    const getScore = (athlete) => {
        const metrics = athlete.normalizedMetrics || {};
        const vals = Object.values(metrics).filter(v => typeof v === 'number');
        return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
    };

    const getWinnerCount = (idx) => {
        const keys = ['speed', 'verticalLeap', 'wingspan', 'pointsPerGame', 'assists', 'stamina'];
        let w = 0;
        for (const k of keys) {
            const v1 = a1.normalizedMetrics?.[k] || 0;
            const v2 = a2.normalizedMetrics?.[k] || 0;
            if (idx === 0 && v1 > v2) w++;
            if (idx === 1 && v2 > v1) w++;
        }
        return w;
    };

    const data = useMemo(() => {
        const labels = ['Speed', 'Vertical', 'Points', 'Assists', 'Stamina', 'Wingspan'];
        const m1 = a1.normalizedMetrics || {};
        const m2 = a2.normalizedMetrics || {};

        return {
            labels,
            datasets: [
                {
                    label: name1,
                    data: [m1.speed || 0, m1.verticalLeap || 0, m1.pointsPerGame || 0, m1.assists || 0, m1.stamina || 0, m1.wingspan || 0],
                    backgroundColor: 'rgba(226, 255, 102, 0.2)', // primary
                    borderColor: '#E2FF66',
                    borderWidth: 2,
                    pointBackgroundColor: '#E2FF66',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#E2FF66',
                    tension: 0.1,
                },
                {
                    label: name2,
                    data: [m2.speed || 0, m2.verticalLeap || 0, m2.pointsPerGame || 0, m2.assists || 0, m2.stamina || 0, m2.wingspan || 0],
                    backgroundColor: 'rgba(34, 211, 238, 0.2)', // accent
                    borderColor: '#22D3EE',
                    borderWidth: 2,
                    pointBackgroundColor: '#22D3EE',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#22D3EE',
                    tension: 0.1,
                }
            ]
        };
    }, [a1, a2, name1, name2]);

    const options = {
        scales: {
            r: {
                angleLines: { color: 'rgba(255, 255, 255, 0.05)' },
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                pointLabels: {
                    color: '#888',
                    font: { family: 'Inter', size: 10, weight: 'bold' }
                },
                ticks: { display: false, max: 100, stepSize: 20 },
                suggestedMin: 0,
                suggestedMax: 100
            }
        },
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#fff',
                    font: { family: 'Inter', size: 12, weight: 'bold' },
                    padding: 20,
                    usePointStyle: true
                }
            },
            tooltip: {
                backgroundColor: '#1C1C21',
                titleFont: { family: 'Inter', size: 12, weight: 'bold' },
                bodyFont: { family: 'Inter', size: 12 },
                padding: 12,
                cornerRadius: 12,
            }
        },
        maintainAspectRatio: false
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

            {/* Modal */}
            <div
                className="relative bg-neutral-900 border border-white/10 rounded-[32px] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-neutral-900/95 backdrop-blur-xl border-b border-white/5 p-6 flex items-center justify-between z-10 shrink-0">
                    <div>
                        <div className="flex items-center gap-2 text-primary mb-1">
                            <Activity size={14} />
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-neutral-400">Intelligence Overlay</span>
                        </div>
                        <h2 className="text-xl font-black text-white uppercase tracking-tight">
                            Head to <span className="text-primary italic">Head</span>
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-all"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col items-center justify-center min-h-[400px]">
                    <div className="w-full max-w-2xl h-[400px] md:h-[500px] relative">
                        <Radar data={data} options={options} />
                    </div>
                </div>

                {/* Summary Footer */}
                <div className="border-t border-white/5 p-6 grid grid-cols-2 gap-4 shrink-0 bg-neutral-900">
                    {[a1, a2].map((athlete, idx) => {
                        return (
                            <div key={idx} className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center justify-between md:text-left text-center gap-4 ${idx === 0
                                ? 'bg-primary/5 border-primary/10'
                                : 'bg-accent/5 border-accent/10'
                                }`}>
                                <div>
                                    <h3 className="text-white font-bold text-sm flex items-center justify-center md:justify-start gap-1.5">
                                        {athlete.userId?.name || 'Unknown'}
                                        {athlete.isVerified && <Shield size={12} className={idx === 0 ? 'text-primary' : 'text-accent'} fill="currentColor" />}
                                    </h3>
                                    <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">
                                        {athlete.sportType}
                                    </p>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-center">
                                        <div className={`text-2xl font-black ${idx === 0 ? 'text-primary' : 'text-accent'}`}>
                                            {getWinnerCount(idx)}
                                        </div>
                                        <p className="text-[9px] font-black leading-tight uppercase text-neutral-500 tracking-widest">
                                            Metrics Won
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <div className={`text-2xl font-black ${idx === 0 ? 'text-primary border-primary/20' : 'text-accent border-accent/20'}`}>
                                            {getScore(athlete)}
                                        </div>
                                        <p className="text-[9px] font-black uppercase text-neutral-500 tracking-widest leading-tight">
                                            Apex Score
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CompareModal;
