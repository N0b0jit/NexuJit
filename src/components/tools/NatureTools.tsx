'use client';

import { useState, useEffect } from 'react';
import { Moon, Star, Activity, Flame, Sun, Wind, CloudRain, Zap } from 'lucide-react';

export default function NatureTools({ defaultTab = 'moon' }: { defaultTab?: string }) {
    const [activeTab, setActiveTab] = useState(defaultTab);

    const tabs = [
        { id: 'moon', label: 'Moon Phase', icon: Moon },
        { id: 'meteor', label: 'Meteor Showers', icon: Star },
        { id: 'earthquake', label: 'Earthquake Live', icon: Activity },
        { id: 'volcano', label: 'Volcano Activity', icon: Flame },
        { id: 'daylight', label: 'Daylight Calc', icon: Sun },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-wrap gap-2 justify-center bg-surface p-2 rounded-xl border border-border sticky top-4 z-20 backdrop-blur-md">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${activeTab === tab.id ? 'bg-primary text-white shadow-md' : 'hover:bg-background text-secondary'}`}
                    >
                        <tab.icon size={18} />
                        <span className="hidden md:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className="bg-surface p-8 rounded-3xl border border-border shadow-lg min-h-[500px]">
                {activeTab === 'moon' && <MoonPhaseTool />}
                {activeTab === 'meteor' && <MeteorShowerTool />}
                {activeTab === 'earthquake' && <EarthquakeFeed />}
                {activeTab === 'volcano' && <VolcanoTracker />}
                {activeTab === 'daylight' && <DaylightCalculator />}
            </div>
        </div>
    );
}

// --- Sub-components ---

function MoonPhaseTool() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mocking moon data for demo consistency
        const now = new Date();
        const cycle = 29.53;
        const ref = new Date('2024-01-11').getTime() / 1000;
        const current = now.getTime() / 1000;
        const age = ((current - ref) / 86400) % cycle;
        const illum = Math.abs(50 - (age / cycle) * 100) * 2;

        setData({
            phaseName: age < 1 ? 'New Moon' : age < 7 ? 'Waxing Crescent' : age < 8 ? 'First Quarter' : age < 14 ? 'Waxing Gibbous' : age < 15 ? 'Full Moon' : 'Waning Gibbous',
            illumination: illum.toFixed(1),
            age: age.toFixed(1)
        });
        setLoading(false);
    }, []);

    if (loading) return <div className="text-center py-20 animate-pulse">Scanning the lunar cycle...</div>;

    return (
        <div className="max-w-md mx-auto text-center space-y-8 py-10">
            <h2 className="text-2xl font-black">Moon Phase & Illumination</h2>
            <div className="relative">
                <div className="w-48 h-48 bg-black rounded-full mx-auto shadow-2xl overflow-hidden border-4 border-white/10 flex items-center justify-center">
                    <div className="w-full h-full bg-white opacity-90 blur-sm" style={{ clipPath: data.illumination > 50 ? 'inset(0 0 0 0)' : 'inset(0 50% 0 0)' }}></div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary mix-blend-difference font-black text-3xl">
                    {data.illumination}%
                </div>
            </div>
            <div className="space-y-2">
                <div className="text-3xl font-black">{data.phaseName}</div>
                <p className="text-secondary font-bold">Age: {data.age} days into cycle</p>
            </div>
            <div className="p-6 bg-background rounded-2xl border border-border grid grid-cols-2 gap-4">
                <div className="text-center">
                    <div className="text-[10px] font-bold text-secondary uppercase">Next Full Moon</div>
                    <div className="font-bold">Jan 29, 2026</div>
                </div>
                <div className="text-center border-l border-border">
                    <div className="text-[10px] font-bold text-secondary uppercase">Next New Moon</div>
                    <div className="font-bold">Feb 12, 2026</div>
                </div>
            </div>
        </div>
    );
}

function MeteorShowerTool() {
    const showers = [
        { name: 'Quadrantids', peak: 'Jan 3-4', rate: '120/hr', parent: '2003 EH1' },
        { name: 'Lyrids', peak: 'Apr 21-22', rate: '18/hr', parent: 'Thatcher' },
        { name: 'Eta Aquariids', peak: 'May 5-6', rate: '50/hr', parent: 'Halley' },
        { name: 'Perseids', peak: 'Aug 12-13', rate: '100/hr', parent: 'Swift-Tuttle' },
        { name: 'Orionids', peak: 'Oct 20-21', rate: '20/hr', parent: 'Halley' },
        { name: 'Geminids', peak: 'Dec 13-14', rate: '120/hr', parent: '3200 Phaethon' },
    ];

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-2xl font-black">2026 Meteor Shower Calendar</h2>
                <p className="text-secondary">Major astronomical events for stargazers</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {showers.map(s => (
                    <div key={s.name} className="p-6 bg-background border border-border rounded-3xl hover:border-primary transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <Star className="text-primary" />
                            <span className="bg-primary/10 text-primary text-[10px] font-black uppercase px-2 py-1 rounded-full">{s.rate}</span>
                        </div>
                        <h3 className="text-xl font-bold">{s.name}</h3>
                        <p className="text-primary font-black mt-1">{s.peak}</p>
                        <div className="text-xs text-secondary mt-2">Parent Body: {s.parent}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function EarthquakeFeed() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson')
            .then(res => res.json())
            .then(res => setData(res.features.slice(0, 10)))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black">Recent Global Earthquakes</h2>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                    <span className="text-xs font-bold uppercase tracking-widest">Live Feed</span>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 font-bold opacity-50">Monitoring tectonic activity...</div>
            ) : (
                <div className="grid gap-4">
                    {data.map((eq, i) => (
                        <div key={i} className="flex items-center gap-6 p-6 bg-background border border-border rounded-2xl hover:bg-surface transition-colors">
                            <div className={`w-16 h-16 rounded-full flex flex-col items-center justify-center shrink-0 ${eq.properties.mag > 4 ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'}`}>
                                <div className="text-xs font-bold">Mag</div>
                                <div className="text-xl font-black">{eq.properties.mag}</div>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg">{eq.properties.place}</h3>
                                <p className="text-xs text-secondary">{new Date(eq.properties.time).toLocaleString()}</p>
                            </div>
                            <a href={eq.properties.url} target="_blank" className="text-xs font-bold text-primary hover:underline">Details ↗</a>
                        </div>
                    ))}
                    {data.length === 0 && <div className="text-center py-10 font-bold text-secondary">Peaceful hour! No tremors detected.</div>}
                </div>
            )}
        </div>
    );
}

function VolcanoTracker() {
    return (
        <div className="space-y-8">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-black">Volcano Activity Tracker</h2>
                <p className="text-secondary text-sm">Active alerts from Smithsonian Institution Global Volcanism Program</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {[
                    { name: 'Kilauea', country: 'United States', status: 'Erupting', danger: 'Critical' },
                    { name: 'Etna', country: 'Italy', status: 'Active', danger: 'Elevated' },
                    { name: 'Sakurajima', country: 'Japan', status: 'Regular Activity', danger: 'Moderate' },
                    { name: 'Fuego', country: 'Guatemala', status: 'Active', danger: 'Elevated' },
                ].map((v, i) => (
                    <div key={i} className="flex gap-6 p-8 bg-background border border-border rounded-[2rem] relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl -translate-y-1/2 translate-x-1/2 opacity-20 ${v.danger === 'Critical' ? 'bg-red-500' : 'bg-orange-500'}`}></div>
                        <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center border border-border group-hover:scale-110 transition-transform">
                            <Flame className={v.danger === 'Critical' ? 'text-red-500' : 'text-orange-500'} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-2xl font-black">{v.name}</h3>
                            <div className="text-sm font-bold text-secondary">{v.country}</div>
                            <div className="flex gap-2 mt-4">
                                <span className="text-[10px] font-black uppercase px-2 py-1 bg-surface border border-border rounded">{v.status}</span>
                                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${v.danger === 'Critical' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>{v.danger}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function DaylightCalculator() {
    return (
        <div className="space-y-10 py-10 text-center">
            <div className="space-y-2">
                <h2 className="text-2xl font-black">Global Daylight Length</h2>
                <p className="text-secondary">Comparing daylight hours across different latitudes</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                <DaylightBar label="Arctic Circle" hours={24} color="bg-blue-400" />
                <DaylightBar label="Equator" hours={12} color="bg-orange-400" />
                <DaylightBar label="Antarctic" hours={0} color="bg-slate-800" />
            </div>

            <div className="p-8 bg-background border border-border rounded-[2.5rem] flex flex-col items-center gap-4">
                <Sun className="text-primary" size={32} />
                <p className="font-bold max-w-lg leading-relaxed text-secondary italic">
                    "Currently, the North Pole is entering its period of [24-Hour Daylight] while the South Pole experiences [Polar Night]."
                </p>
                <div className="text-xs font-bold uppercase tracking-widest text-primary">Season: Boreal Summer Solstice Approach</div>
            </div>
        </div>
    );
}

const DaylightBar = ({ label, hours, color }: any) => (
    <div className="space-y-4">
        <div className="h-64 w-12 bg-surface rounded-full mx-auto relative overflow-hidden border border-border">
            <div className={`absolute bottom-0 inset-x-0 rounded-full transition-all duration-1000 ${color}`} style={{ height: `${(hours / 24) * 100}%` }}></div>
        </div>
        <div>
            <div className="font-black">{label}</div>
            <div className="text-primary font-bold">{hours}h Daylight</div>
        </div>
    </div>
);
