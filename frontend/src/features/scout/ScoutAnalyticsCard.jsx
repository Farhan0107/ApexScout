import { ArrowUpRight, TrendingUp, Info } from 'lucide-react';
import CountUp from 'react-countup';

const ScoutAnalyticsCard = ({ title, value, subtext, icon: Icon, color = 'primary', trend }) => {
    return (
        <div className="bg-surface border border-white/5 rounded-[32px] p-6 relative overflow-hidden group hover:border-white/10 transition-all duration-500">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                <Icon size={80} />
            </div>

            <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl bg-${color}/10 border border-${color}/20 flex items-center justify-center text-${color}`}>
                    <Icon size={18} />
                </div>
                {trend && (
                    <div className="flex items-center gap-1 text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20 uppercase tracking-widest">
                        <TrendingUp size={10} />
                        {trend}
                    </div>
                )}
            </div>

            <div>
                <div className="text-3xl font-black text-white tabular-nums mb-1 tracking-tighter italic">
                    <CountUp
                        end={value || 0}
                        duration={1.5}
                        decimals={title.includes('Rating') ? 1 : 0}
                        key={value} // Forces redraw on change
                    />
                </div>
                <div className="text-[10px] font-black uppercase text-neutral-500 tracking-[0.2em]">
                    {title}
                </div>
                {subtext && (
                    <div className="flex items-center gap-1.5 mt-4 pt-4 border-t border-white/5">
                        <Info size={10} className="text-neutral-700" />
                        <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest">{subtext}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScoutAnalyticsCard;
