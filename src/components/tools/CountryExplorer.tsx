'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Users, Globe, Flag, Info, ExternalLink, Coins } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Country {
    name: { common: string; official: string };
    flags: { svg: string; alt: string };
    coatOfArms: { svg: string };
    capital: string[];
    region: string;
    subregion: string;
    population: number;
    languages: { [key: string]: string };
    currencies: { [key: string]: { name: string; symbol: string } };
    borders: string[];
    maps: { googleMaps: string };
    timezones: string[];
    area: number;
}

export default function CountryExplorer() {
    const [query, setQuery] = useState('');
    const [country, setCountry] = useState<Country | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);

    const fetchCountry = async (searchName: string) => {
        if (!searchName.trim()) return;
        setLoading(true);
        setError('');
        setCountry(null);
        setSuggestions([]);

        try {
            const res = await fetch(`https://restcountries.com/v3.1/name/${searchName}?fullText=true`);
            if (!res.ok) {
                // Try partial search if full text fails
                const partialRes = await fetch(`https://restcountries.com/v3.1/name/${searchName}`);
                if (!partialRes.ok) throw new Error('Country not found');
                const data = await partialRes.json();
                setCountry(data[0]);
            } else {
                const data = await res.json();
                setCountry(data[0]);
            }
        } catch (err) {
            setError('Could not find country. Please check the spelling.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchCountry(query);
    };

    const formatNumber = (num: number) => new Intl.NumberFormat().format(num);

    return (
        <div className="country-explorer max-w-5xl mx-auto space-y-10">
            {/* Hero Search Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-purple-500/10 p-8 rounded-3xl border border-white/20 shadow-xl backdrop-blur-md">
                <div className="absolute top-0 right-0 p-12 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
                <div className="relative z-10 text-center space-y-6">
                    <h2 className="text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                        Explore the World
                    </h2>
                    <p className="text-secondary text-lg max-w-2xl mx-auto">
                        Discover detailed information about any country, including population, language, currency, and more.
                    </p>

                    <form onSubmit={handleSearch} className="relative max-w-xl mx-auto flex gap-2 pt-4">
                        <div className="relative flex-1 group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-xl opacity-30 group-hover:opacity-70 transition duration-500 blur"></div>
                            <div className="relative flex items-center bg-surface rounded-xl overflow-hidden">
                                <Search className="absolute left-4 text-secondary group-focus-within:text-primary transition-colors" size={24} />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Enter country name (e.g., Japan)..."
                                    className="w-full pl-12 pr-4 py-4 bg-transparent outline-none text-lg font-medium placeholder:text-secondary/50"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover disabled:opacity-50 transition-all shadow-lg hover:shadow-primary/30 active:scale-95"
                        >
                            {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Explore'}
                        </button>
                    </form>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-full text-sm font-medium border border-red-500/20"
                        >
                            <Info size={16} /> {error}
                        </motion.div>
                    )}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {country && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -40 }}
                        transition={{ duration: 0.5, type: "spring" }}
                        className="country-details grid grid-cols-1 lg:grid-cols-12 gap-8"
                    >
                        {/* Left Column: Visuals */}
                        <div className="lg:col-span-5 space-y-6">
                            <motion.div
                                className="flag-card bg-surface p-6 rounded-3xl border border-white/10 shadow-2xl text-center relative overflow-hidden group"
                                whileHover={{ y: -5 }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 pointer-events-none" />
                                <img
                                    src={country.flags.svg}
                                    alt={country.flags.alt || `Flag of ${country.name.common}`}
                                    className="w-full h-auto max-h-64 object-contain drop-shadow-2xl rounded-lg transform group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="mt-6 space-y-1 relative z-10">
                                    <h1 className="text-4xl font-black text-foreground">{country.name.common}</h1>
                                    <p className="text-lg text-secondary font-medium">{country.name.official}</p>
                                </div>
                            </motion.div>

                            {country.coatOfArms.svg && (
                                <motion.div
                                    className="coat-card bg-surface/50 backdrop-blur-sm p-8 rounded-3xl border border-white/10 shadow-lg flex flex-col items-center justify-center relative overflow-hidden"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-secondary mb-6">Coat of Arms</h3>
                                    <img
                                        src={country.coatOfArms.svg}
                                        alt="Coat of Arms"
                                        className="w-32 h-32 object-contain opacity-90 drop-shadow-xl"
                                    />
                                </motion.div>
                            )}
                        </div>

                        {/* Right Column: Info */}
                        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoCard
                                icon={<MapPin size={24} />}
                                label="Capital"
                                value={country.capital?.join(', ') || 'N/A'}
                                color="text-rose-500"
                                bg="bg-rose-500/10"
                            />
                            <InfoCard
                                icon={<Globe size={24} />}
                                label="Region"
                                value={`${country.region} (${country.subregion})`}
                                color="text-blue-500"
                                bg="bg-blue-500/10"
                            />
                            <InfoCard
                                icon={<Users size={24} />}
                                label="Population"
                                value={formatNumber(country.population)}
                                color="text-green-500"
                                bg="bg-green-500/10"
                            />
                            <InfoCard
                                icon={<Flag size={24} />}
                                label="Area"
                                value={`${formatNumber(country.area)} km²`}
                                color="text-orange-500"
                                bg="bg-orange-500/10"
                            />

                            <div className="md:col-span-2 bg-surface p-6 rounded-2xl border border-border shadow-sm">
                                <h4 className="text-sm font-bold text-secondary mb-4 uppercase tracking-wider flex items-center gap-2">
                                    <Info size={16} /> Languages
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {Object.values(country.languages || {}).map((lang) => (
                                        <span key={lang} className="px-4 py-2 bg-primary/10 text-primary font-bold rounded-xl border border-primary/20">
                                            {lang}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="md:col-span-2 bg-surface p-6 rounded-2xl border border-border shadow-sm">
                                <h4 className="text-sm font-bold text-secondary mb-4 uppercase tracking-wider flex items-center gap-2">
                                    <Coins size={16} /> Currencies
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {Object.entries(country.currencies || {}).map(([code, details]) => (
                                        <div key={code} className="flex justify-between items-center p-3 bg-background rounded-xl border border-border">
                                            <span className="font-semibold text-foreground">{details.name}</span>
                                            <span className="font-black text-primary px-3 py-1 bg-primary/10 rounded-lg">{details.symbol} {code}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="md:col-span-2 mt-2">
                                <a
                                    href={country.maps.googleMaps}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-3 w-full py-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white font-bold rounded-xl hover:shadow-lg hover:scale-[1.01] transition-all group"
                                >
                                    <Globe size={20} className="group-hover:rotate-12 transition-transform" /> View on Google Maps <ExternalLink size={16} className="opacity-50" />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function InfoCard({ icon, label, value, color = 'text-primary', bg = 'bg-primary/5' }: { icon: any, label: string, value: string, color?: string, bg?: string }) {
    return (
        <div className="flex items-center gap-4 bg-surface p-4 rounded-xl border border-border shadow-sm hover:border-primary/30 transition-colors group">
            <div className={`p-4 ${bg} ${color} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                {icon}
            </div>
            <div>
                <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-0.5">{label}</p>
                <p className="text-xl font-bold text-foreground">{value}</p>
            </div>
        </div>
    );
}
