import React from 'react';
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

const RadarChartCard = ({ metrics, label = 'Performance Metrics' }) => {
    if (!metrics) {
        return (
            <div className="h-full flex items-center justify-center text-neutral-600 font-bold uppercase tracking-widest text-xs italic">
                No Data to Visualize
            </div>
        );
    }

    const data = {
        labels: ['Speed', 'Vertical', 'Points', 'Assists', 'Stamina', 'Wingspan'],
        datasets: [
            {
                label: label,
                data: [
                    metrics.speed || 0,
                    metrics.verticalLeap || 0,
                    metrics.pointsPerGame || 0,
                    metrics.assists || 0,
                    metrics.stamina || 0,
                    metrics.wingspan || 0,
                ],
                backgroundColor: 'rgba(226, 255, 102, 0.2)',
                borderColor: '#E2FF66',
                borderWidth: 3,
                pointBackgroundColor: '#E2FF66',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#E2FF66',
                tension: 0.1,
            },
        ],
    };

    const options = {
        scales: {
            r: {
                angleLines: {
                    color: 'rgba(255, 255, 255, 0.05)',
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                },
                pointLabels: {
                    color: '#888',
                    font: {
                        family: 'Inter',
                        size: 11,
                        weight: '800',
                    },
                },
                ticks: {
                    display: false,
                    max: 100,
                    stepSize: 20,
                },
                suggestedMin: 0,
                suggestedMax: 100,
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: '#1C1C21',
                titleFont: { family: 'Inter', size: 12, weight: 'bold' },
                bodyFont: { family: 'Inter', size: 12 },
                padding: 12,
                cornerRadius: 12,
                displayColors: false,
            },
        },
        maintainAspectRatio: false,
    };

    return (
        <div className="w-full h-[400px] relative flex items-center justify-center">
            {/* Soft background pulse element behind the radar */}
            <div className="absolute inset-0 z-0 flex items-center justify-center">
                <div className="w-[300px] h-[300px] rounded-full bg-primary/10 blur-3xl animate-pulse-slow max-w-full mix-blend-screen opacity-50" />
            </div>

            <div className="absolute inset-0 z-10">
                <Radar data={data} options={options} />
            </div>
        </div>
    );
};

export default RadarChartCard;
