'use client';

import { useState, useEffect } from 'react';
import { MapPin, Sun, Calendar, Info, Phone, Users, MonitorOff, ShieldCheck, Activity, Globe, Navigation, Wind, Droplets } from 'lucide-react';
import { Card, Badge, Button, Input, Select, Tabs } from '@/components/ui/Core';
import { motion, AnimatePresence } from 'framer-motion';

export default function GeographyTools({ defaultTab = 'ip-intel' }: { defaultTab?: string }) {
    const [activeTab, setActiveTab] = useState(defaultTab);

    const tabs = [
        { id: 'ip-intel', label: 'Network Intelligence', icon: MapPin },
        { id: 'emergency', label: 'Safety Protocals', icon: Phone },
        { id: 'population', label: 'Vital Signs', icon: Users },
        { id: 'sun', label: 'Daylight Logic', icon: Sun },
        { id: 'cities', label: 'City Nodes', icon: Info },
    ];

    return (
        <div className="space-y-12">
            <div className="flex justify-center">
                <Tabs tabs={tabs} activeTab={activeTab} setTab={setActiveTab} />
            </div>

            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="min-h-[600px]"
            >
                {activeTab === 'ip-intel' && <IpIntelligence />}
                {activeTab === 'emergency' && <EmergencyNumbers />}
                {activeTab === 'population' && <PopulationCounter />}
                {activeTab === 'sun' && <SunriseSunsetTool />}
                {activeTab === 'cities' && <CityFactsTool />}
            </motion.div>
        </div>
    );
}

// --- Sub-components ---

function IpIntelligence() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('https://ipwho.is/')
            .then(res => res.json())
            .then(setData)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-40 space-y-6">
            <Activity className="text-accent animate-spin" size={48} />
            <p className="text-sm font-black uppercase tracking-widest text-muted-fg animate-pulse">Syncing Network Telemetry...</p>
        </div>
    );

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
                <div className="space-y-1">
                    <Badge variant="accent">Connection Scan</Badge>
                    <h2 className="text-3xl font-black italic tracking-tighter">Hardware Identity</h2>
                </div>
                <div className="font-mono text-2xl font-black text-accent bg-accent/5 px-6 py-3 rounded-2xl border border-accent/10">
                    {data?.ip}
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <InfoCard label="ISP Infrastructure" value={data?.connection?.isp} sub={data?.connection?.asn} icon={Globe} />
                <InfoCard label="Point of Presence" value={`${data?.city}, ${data?.region}`} sub={data?.country} icon={MapPin} />
                <InfoCard label="Coordinate Set" value={`${data?.latitude}, ${data?.longitude}`} icon={Navigation} />
                <InfoCard label="Temporal Node" value={data?.timezone?.id} sub={data?.timezone?.current_time} icon={Sun} />
                <InfoCard label="Economy Sync" value={`${data?.currency?.name} (${data?.currency?.code})`} sub={data?.currency?.symbol} icon={Activity} />
                <InfoCard label="Logical Org" value={data?.connection?.org || 'N/A'} icon={ShieldCheck} />
            </div>

            <Card className="p-8 bg-muted/20 border-border/50">
                <div className="flex items-center gap-3 mb-6">
                    <ShieldCheck className="text-accent" size={24} />
                    <h3 className="font-black italic tracking-tight text-xl">Security Constraints</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <SecurityBadge label="Proxy Layer" status={data?.security?.proxy} />
                    <SecurityBadge label="VPN Tunnel" status={data?.security?.vpn} />
                    <SecurityBadge label="Tor Protocol" status={data?.security?.tor} />
                    <SecurityBadge label="Public Relay" status={data?.security?.relay} />
                </div>
            </Card>
        </div>
    );
}

function EmergencyNumbers() {
    const [search, setSearch] = useState('');
    const countries = [
        { name: 'United States', police: '911', ambulance: '911', fire: '911' },
        { name: 'United Kingdom', police: '999', ambulance: '999', fire: '999' },
        { name: 'Canada', police: '911', ambulance: '911', fire: '911' },
        { name: 'Australia', police: '000', ambulance: '000', fire: '000' },
        { name: 'Germany', police: '110', ambulance: '112', fire: '112' },
        { name: 'France', police: '17', ambulance: '15', fire: '18' },
        { name: 'India', police: '100', ambulance: '102', fire: '101' },
        { name: 'Japan', police: '110', ambulance: '119', fire: '119' },
    ];

    const filtered = countries.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-1">
                    <Badge variant="accent">Global Safety</Badge>
                    <h2 className="text-3xl font-black italic tracking-tighter">Emergency Dispatch</h2>
                </div>
                <Input
                    placeholder="Search Jurisdiction..."
                    className="max-w-xs"
                    value={search}
                    onChange={(e: any) => setSearch(e.target.value)}
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filtered.map(c => (
                    <Card key={c.name} className="p-6 transition-slow hover:border-accent">
                        <h3 className="font-black italic text-lg border-b border-border pb-3 mb-4">{c.name}</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <EmergencyBox label="POL" value={c.police} color="blue" />
                            <EmergencyBox label="AMB" value={c.ambulance} color="red" />
                            <EmergencyBox label="FIRE" value={c.fire} color="orange" />
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

function PopulationCounter() {
    const [pop, setPop] = useState(8100124560);

    useEffect(() => {
        const interval = setInterval(() => {
            setPop(prev => prev + (Math.random() < 0.4 ? 1 : 0));
        }, 300);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center py-12 space-y-16">
            <div className="text-center space-y-3">
                <Badge variant="accent">Living Organisms</Badge>
                <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter">Global Vital Signs</h2>
                <p className="text-muted-fg font-medium">Real-time planetary demographic estimation</p>
            </div>

            <div className="relative group">
                <div className="absolute inset-0 bg-accent/20 blur-[100px] -z-10 rounded-full animate-pulse" />
                <div className="text-5xl md:text-8xl font-black text-accent font-display bg-bg border-4 border-accent p-12 md:p-20 rounded-[3rem] shadow-2xl tracking-tighter italic">
                    {pop.toLocaleString()}
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-5xl">
                <TrendCard label="Birth Cycles Today" value="≈ 385K" icon={Droplets} color="blue" />
                <TrendCard label="Exit Cycles Today" value="≈ 160K" icon={Wind} color="red" />
                <TrendCard label="Net Acceleration" value="+ 225K" icon={Activity} color="green" />
                <TrendCard label="Annual Vector" value="≈ 0.9%" icon={Navigation} color="indigo" />
            </div>
        </div>
    );
}

function SunriseSunsetTool() {
    const [lat, setLat] = useState('40.7128');
    const [lng, setLng] = useState('-74.0060');
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const fetchSun = () => {
        setLoading(true);
        fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&date=today&formatted=0`)
            .then(res => res.json())
            .then(data => setData(data.results))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchSun(); }, []);

    return (
        <div className="space-y-10">
            <div className="space-y-1">
                <Badge variant="accent">Solar Telemetry</Badge>
                <h2 className="text-3xl font-black italic tracking-tighter">Luminance Chronology</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                <div className="md:col-span-4 space-y-2">
                    <label className="text-[10px] font-black uppercase text-muted-fg ml-1 tracking-widest">Latitude Vector</label>
                    <Input value={lat} onChange={(e: any) => setLat(e.target.value)} className="font-mono" />
                </div>
                <div className="md:col-span-4 space-y-2">
                    <label className="text-[10px] font-black uppercase text-muted-fg ml-1 tracking-widest">Longitude Vector</label>
                    <Input value={lng} onChange={(e: any) => setLng(e.target.value)} className="font-mono" />
                </div>
                <div className="md:col-span-4">
                    <Button variant="primary" onClick={fetchSun} className="w-full py-3.5 shadow-xl">Process Coordinates</Button>
                </div>
            </div>

            {loading ? (
                <div className="py-20 flex justify-center"><Activity className="animate-spin text-accent" /></div>
            ) : data && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <SunCard label="Luminance Initial" time={new Date(data.sunrise).toLocaleTimeString()} icon="🌅" />
                    <SunCard label="Luminance Final" time={new Date(data.sunset).toLocaleTimeString()} icon="🌇" />
                    <SunCard label="Daylight Span" time={data.day_length} icon="⏱️" />
                    <SunCard label="Solar Peak" time={new Date(data.solar_noon).toLocaleTimeString()} icon="☀️" />
                </div>
            )}
        </div>
    );
}

function CityFactsTool() {
    const [city, setCity] = useState('');
    const [fact, setFact] = useState<any>(null);

    const getFact = () => {
        const facts: any = {
            'new york': { name: 'New York', country: 'USA', fact: 'The subway system contains 472 distinct architectural nodes.', pop: '8.8M', icon: '🏙️' },
            'london': { name: 'London', country: 'UK', fact: 'Over 300 linguistic protocols are active within city limits.', pop: '8.9M', icon: '💂' },
            'tokyo': { name: 'Tokyo', country: 'Japan', fact: 'The highest population density node in the planetary database.', pop: '37M', icon: '🍣' }
        };
        setFact(facts[city.toLowerCase()] || { name: city || 'Unknown', country: '-', fact: 'No historical intelligence found in the local cache. Try New York, London, or Tokyo.', pop: '-', icon: '❓' });
    };

    return (
        <div className="space-y-12 max-w-2xl mx-auto">
            <div className="text-center space-y-2">
                <Badge variant="accent">Node Intelligence</Badge>
                <h2 className="text-3xl font-black italic tracking-tighter">Urban Analytics</h2>
            </div>

            <div className="flex gap-4">
                <Input
                    placeholder="Enter City Index (e.g. Tokyo)..."
                    className="flex-1 font-bold italic"
                    value={city}
                    onChange={(e: any) => setCity(e.target.value)}
                />
                <Button onClick={getFact} className="px-8 shadow-lg">Scan Node</Button>
            </div>

            <AnimatePresence mode="wait">
                {fact && (
                    <motion.div
                        key={fact.name}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-10 bg-muted/30 border border-border rounded-3xl space-y-6 text-center shadow-xl"
                    >
                        <div className="text-6xl mb-4 grayscale hover:grayscale-0 transition-slow inline-block">{fact.icon}</div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-black italic tracking-tight">{fact.name}</h3>
                            <Badge variant="accent">{fact.country}</Badge>
                        </div>
                        <p className="text-lg font-medium leading-relaxed italic text-muted-fg max-w-sm mx-auto">{fact.fact}</p>
                        <div className="pt-6 border-t border-border/50 text-xs font-black uppercase text-accent tracking-[0.2em]">Population: {fact.pop}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// --- Helpers ---

const InfoCard = ({ label, value, sub, icon: Icon }: any) => (
    <Card className="p-6 transition-slow bg-bg/50">
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-accent/10 rounded-lg text-accent"><Icon size={16} strokeWidth={3} /></div>
            <div className="text-[10px] font-black uppercase text-muted-fg tracking-widest">{label}</div>
        </div>
        <div className="text-xl font-black italic tracking-tight truncate text-fg">{value || 'N/A'}</div>
        {sub && <div className="text-[10px] text-accent font-black mt-2 uppercase tracking-tighter opacity-70">{sub}</div>}
    </Card>
);

const SecurityBadge = ({ label, status }: any) => (
    <div className={`p-4 rounded-xl border-2 transition-fast flex flex-col items-center gap-2 ${status ? 'border-red-500/20 bg-red-500/5 text-red-500' : 'border-green-500/20 bg-green-500/5 text-green-500'}`}>
        <span className="text-[9px] font-black uppercase tracking-widest opacity-60 text-center">{label}</span>
        <span className="font-bold text-sm">{status ? 'COMPROMISED' : 'SECURE'}</span>
    </div>
);

const EmergencyBox = ({ label, value, color }: any) => {
    const colors: any = {
        blue: 'text-blue-500 border-blue-500/20 bg-blue-500/5',
        red: 'text-red-500 border-red-500/20 bg-red-500/5',
        orange: 'text-orange-500 border-orange-500/20 bg-orange-500/5',
    };
    return (
        <div className={`p-3 rounded-lg border text-center ${colors[color]}`}>
            <div className="text-[8px] font-black mb-1 opacity-60 uppercase">{label}</div>
            <div className="text-lg font-black">{value}</div>
        </div>
    );
};

const TrendCard = ({ label, value, icon: Icon, color }: any) => {
    const colors: any = {
        green: 'text-green-500 border-green-500/20 bg-green-500/5',
        red: 'text-red-500 border-red-500/20 bg-red-500/5',
        blue: 'text-blue-500 border-blue-500/20 bg-blue-500/5',
        indigo: 'text-indigo-500 border-indigo-500/20 bg-indigo-500/5',
    };
    return (
        <Card className={`p-6 text-center space-y-2 border-2 ${colors[color]} bg-bg/50`}>
            <div className="flex justify-center"><Icon size={20} className="opacity-40" /></div>
            <div className="text-[10px] font-black uppercase tracking-widest">{label}</div>
            <div className="text-2xl font-black italic tracking-tighter text-fg">{value}</div>
        </Card>
    );
};

const SunCard = ({ label, time, icon }: any) => (
    <Card className="p-8 text-center space-y-4 bg-muted/20 border-border/50">
        <div className="text-4xl filter drop-shadow-lg">{icon}</div>
        <div className="space-y-1">
            <div className="text-[10px] font-black text-muted-fg uppercase tracking-widest">{label}</div>
            <div className="text-xl font-black italic tracking-tighter text-fg">{time}</div>
        </div>
    </Card>
);
