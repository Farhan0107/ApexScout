import React, { useState, useEffect } from 'react';
import { Activity, Gauge, ArrowUp, Ruler, Target, Users, Zap, ShieldCheck } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const AthleteProfileForm = ({ initialData, onSubmit, onPreviewChange, loading }) => {
    const [formData, setFormData] = useState({
        sportType: '',
        rawMetrics: {
            speed: 0,
            verticalLeap: 0,
            wingspan: 0,
            pointsPerGame: 0,
            assists: 0,
            stamina: 0
        }
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                sportType: initialData.sportType || '',
                rawMetrics: initialData.rawMetrics || {
                    speed: 0,
                    verticalLeap: 0,
                    wingspan: 0,
                    pointsPerGame: 0,
                    assists: 0,
                    stamina: 0
                }
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('metrics.')) {
            const metricName = name.split('.')[1];
            const newVal = Number(value);
            const updatedMetrics = {
                ...formData.rawMetrics,
                [metricName]: newVal
            };

            setFormData({
                ...formData,
                rawMetrics: updatedMetrics
            });

            // Fire preview change for real-time visualization
            if (onPreviewChange) {
                onPreviewChange(updatedMetrics);
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const isVerified = initialData?.isVerified;

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">
                        Profile <span className="text-primary">Intelligence</span>
                    </h2>
                    <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mt-1">
                        Raw Performance Data Input
                    </p>
                </div>

                {isVerified && (
                    <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-2xl text-primary text-[10px] font-black uppercase tracking-widest">
                        <ShieldCheck size={14} />
                        Scout Verified
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-full">
                    <Input
                        label="Primary Sport Type"
                        name="sportType"
                        placeholder="e.g. Basketball, Track, Football"
                        icon={TrophyIcon}
                        value={formData.sportType}
                        onChange={handleChange}
                        required
                    />
                </div>

                <Input
                    label="Top Speed (km/h)"
                    name="metrics.speed"
                    type="number"
                    placeholder="0.0"
                    icon={Gauge}
                    value={formData.rawMetrics.speed}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="0.1"
                    required
                />

                <Input
                    label="Vertical Leap (in)"
                    name="metrics.verticalLeap"
                    type="number"
                    placeholder="0"
                    icon={ArrowUp}
                    value={formData.rawMetrics.verticalLeap}
                    onChange={handleChange}
                    min="0"
                    max="60"
                    required
                />

                <Input
                    label="Points Per Game"
                    name="metrics.pointsPerGame"
                    type="number"
                    placeholder="0.0"
                    icon={Target}
                    value={formData.rawMetrics.pointsPerGame}
                    onChange={handleChange}
                    min="0"
                    max="150"
                    step="0.1"
                    required
                />

                <Input
                    label="Assists"
                    name="metrics.assists"
                    type="number"
                    placeholder="0"
                    icon={Users}
                    value={formData.rawMetrics.assists}
                    onChange={handleChange}
                    min="0"
                    max="50"
                    required
                />

                <Input
                    label="Stamina Rating"
                    name="metrics.stamina"
                    type="number"
                    placeholder="0"
                    icon={Zap}
                    value={formData.rawMetrics.stamina}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    required
                />

                <Input
                    label="Wingspan (in)"
                    name="metrics.wingspan"
                    type="number"
                    placeholder="0"
                    icon={Ruler}
                    value={formData.rawMetrics.wingspan}
                    onChange={handleChange}
                    min="0"
                    max="120"
                    required
                />
            </div>

            <div className="pt-6 border-t border-white/5">
                <Button
                    type="submit"
                    loading={loading}
                    className="w-full md:w-auto min-w-[200px]"
                >
                    {initialData ? 'Sync Data' : 'Establish Profile'}
                </Button>
            </div>
        </form>
    );
};

const TrophyIcon = ({ size, className }) => (
    <Activity size={size} className={className} />
);

export default AthleteProfileForm;
