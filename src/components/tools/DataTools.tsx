'use client';

import { useState } from 'react';
import { Database, User, Globe, Coins, Languages, Download, RefreshCw, BarChart } from 'lucide-react';

export default function DataTools({ defaultTab = 'csv' }: { defaultTab?: string }) {
    const [activeTab, setActiveTab] = useState(defaultTab);

    const tabs = [
        { id: 'csv', label: 'CSV Generator', icon: Database },
        { id: 'profile', label: 'Fake Profile', icon: User },
        { id: 'country', label: 'Country Compare', icon: Globe },
        { id: 'currency', label: 'Currency Explorer', icon: Coins },
        { id: 'language', label: 'Languages', icon: Languages },
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
                {activeTab === 'csv' && <CsvGenerator />}
                {activeTab === 'profile' && <FakeProfileGenerator />}
                {activeTab === 'country' && <CountryComparison />}
                {activeTab === 'currency' && <CurrencyExplorer />}
                {activeTab === 'language' && <LanguageViewer />}
            </div>
        </div>
    );
}

// --- Sub-components ---

function CsvGenerator() {
    const [rows, setRows] = useState(10);
    const [data, setData] = useState('');

    const generate = () => {
        const header = "ID,Name,Email,Company,Country\n";
        let content = header;
        const names = ["James", "Mary", "Robert", "Patricia", "John", "Jennifer"];
        const countries = ["USA", "UK", "Canada", "Germany", "France"];

        for (let i = 1; i <= rows; i++) {
            const name = names[Math.floor(Math.random() * names.length)];
            content += `${i},${name},${name.toLowerCase()}@example.com,Global Corp,${countries[Math.floor(Math.random() * countries.length)]}\n`;
        }
        setData(content);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-black">CSV Random Data Generator</h2>
            <div className="flex gap-4">
                <input
                    type="number"
                    value={rows}
                    onChange={(e) => setRows(parseInt(e.target.value))}
                    max={100}
                    className="p-3 bg-background border border-border rounded-xl font-bold w-32"
                />
                <button onClick={generate} className="flex-1 py-3 bg-primary text-white font-black rounded-xl">Generate Demo Data</button>
            </div>

            {data && (
                <div className="space-y-4">
                    <pre className="p-6 bg-background border border-border rounded-2xl font-mono text-sm overflow-x-auto h-64">{data}</pre>
                    <button onClick={() => {
                        const blob = new Blob([data], { type: 'text/csv' });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'data.csv';
                        a.click();
                    }} className="w-full py-3 bg-secondary text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-2">
                        <Download size={18} /> Download CSV
                    </button>
                </div>
            )}
        </div>
    );
}

function FakeProfileGenerator() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const fetchUser = async () => {
        setLoading(true);
        try {
            const res = await fetch('https://randomuser.me/api/');
            const data = await res.json();
            setUser(data.results[0]);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useState(() => { fetchUser(); });

    return (
        <div className="max-w-xl mx-auto text-center space-y-8">
            <h2 className="text-2xl font-black">Fake Profile Generator</h2>

            {loading ? (
                <div className="py-20 animate-pulse font-bold">Assembling identity...</div>
            ) : user && (
                <div className="p-10 bg-background border border-border rounded-[3.5rem] shadow-xl space-y-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform"><User size={128} /></div>

                    <img src={user.picture.large} className="w-32 h-32 rounded-full mx-auto border-4 border-primary shadow-lg" alt="Profile" />

                    <div>
                        <div className="text-3xl font-black">{user.name.first} {user.name.last}</div>
                        <div className="text-secondary font-medium italic">{user.email}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-left">
                        <div className="p-4 bg-surface rounded-2xl border border-border">
                            <div className="text-[10px] font-bold uppercase opacity-50">Location</div>
                            <div className="font-bold">{user.location.city}, {user.location.country}</div>
                        </div>
                        <div className="p-4 bg-surface rounded-2xl border border-border">
                            <div className="text-[10px] font-bold uppercase opacity-50">Username</div>
                            <div className="font-bold">{user.login.username}</div>
                        </div>
                    </div>

                    <p className="text-xs text-secondary font-bold font-mono py-2">UUID: {user.login.uuid}</p>
                </div>
            )}

            <button onClick={fetchUser} className="px-10 py-4 bg-primary text-white font-black rounded-2xl shadow-lg hover:scale-105 transition-transform flex items-center gap-2 mx-auto">
                <RefreshCw /> New Identity
            </button>
        </div>
    );
}

function CountryComparison() {
    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-black text-center">Country Comparison Tool</h2>
            <div className="grid gap-6 md:grid-cols-2">
                <ComparisonBox country="USA" pop="331M" area="9.8M km²" currency="USD" gdp="$23T" />
                <ComparisonBox country="China" pop="1.4B" area="9.6M km²" currency="CNY" gdp="$17T" />
            </div>

            <div className="p-6 bg-background rounded-2xl border border-border text-center">
                <BarChart className="mx-auto text-primary opacity-20 mb-4" size={48} />
                <p className="text-secondary font-medium">Detailed demographic visualizations across 195 nations would be explored here.</p>
            </div>
        </div>
    );
}

function CurrencyExplorer() {
    const currencies = [
        { code: 'USD', name: 'US Dollar', symbol: '$', region: 'Americas' },
        { code: 'EUR', name: 'Euro', symbol: '€', region: 'Europe' },
        { code: 'JPY', name: 'Yen', symbol: '¥', region: 'Asia' },
        { code: 'GBP', name: 'Pound', symbol: '£', region: 'Europe' },
        { code: 'BTC', name: 'Bitcoin', symbol: '₿', region: 'Digital' },
    ];

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-black">World Currency Explorer</h2>
            <div className="grid gap-4 md:grid-cols-3">
                {currencies.map(c => (
                    <div key={c.code} className="p-8 bg-background border border-border rounded-3xl text-center space-y-2 hover:border-primary transition-all">
                        <div className="text-5xl font-black text-primary opacity-20">{c.symbol}</div>
                        <div className="text-xl font-black">{c.code}</div>
                        <div className="font-bold text-secondary text-sm">{c.name}</div>
                        <div className="text-[10px] uppercase font-black bg-surface px-2 py-0.5 rounded border border-border inline-block">{c.region}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function LanguageViewer() {
    return (
        <div className="space-y-8 text-center py-10">
            <h2 className="text-2xl font-black">Global Language Distributions</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <LangStats lang="English" speakers="1.5B" countries="67" />
                <LangStats lang="Mandarin" speakers="1.1B" countries="3" />
                <LangStats lang="Hindi" speakers="610M" countries="1" />
                <LangStats lang="Spanish" speakers="550M" countries="21" />
            </div>
            <div className="p-6 bg-background rounded-2xl border border-border max-w-xl mx-auto">
                <p className="text-sm text-secondary italic">"There are approximately 7,168 living languages in the world today, though 40% are considered endangered."</p>
            </div>
        </div>
    );
}

const ComparisonBox = ({ country, pop, area, currency, gdp }: any) => (
    <div className="p-8 bg-background border border-border rounded-[2.5rem] space-y-6">
        <h3 className="text-3xl font-black">{country}</h3>
        <div className="grid grid-cols-2 gap-4">
            <StatLine label="Population" value={pop} />
            <StatLine label="Total Area" value={area} />
            <StatLine label="Currency" value={currency} />
            <StatLine label="GDP" value={gdp} />
        </div>
    </div>
);

const StatLine = ({ label, value }: any) => (
    <div className="space-y-1">
        <div className="text-[10px] font-bold text-secondary uppercase italic">{label}</div>
        <div className="font-black text-lg">{value}</div>
    </div>
);

const LangStats = ({ lang, speakers, countries }: any) => (
    <div className="p-6 bg-background border border-border rounded-2xl hover:bg-surface transition-colors">
        <div className="text-xl font-black text-primary">{lang}</div>
        <div className="text-2xl font-black mt-2">{speakers}</div>
        <div className="text-[10px] font-bold text-secondary uppercase">Spoken in {countries} countries</div>
    </div>
);
