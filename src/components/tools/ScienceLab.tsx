'use client';

import { useState, useEffect } from 'react';
import { Rocket, BookOpen, Globe, Calendar, Search, MapPin } from 'lucide-react';

export default function ScienceLab({ defaultTab = 'apod' }: { defaultTab?: string }) {
    const [activeTab, setActiveTab] = useState(defaultTab);

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-wrap gap-2 justify-center bg-surface p-2 rounded-xl border border-border">
                <TabButton id="apod" label="Astronomy Picture" icon={Rocket} active={activeTab} set={setActiveTab} />
                <TabButton id="space" label="Space Track" icon={Rocket} active={activeTab} set={setActiveTab} />
                <TabButton id="holidays" label="Public Holidays" icon={Calendar} active={activeTab} set={setActiveTab} />
                <TabButton id="trivia" label="Trivia Quiz" icon={BookOpen} active={activeTab} set={setActiveTab} />
                <TabButton id="ip" label="IP Geolocation" icon={MapPin} active={activeTab} set={setActiveTab} />
            </div>

            <div className="min-h-[500px]">
                {activeTab === 'apod' && <NasaApod />}
                {activeTab === 'space' && <SpaceTracker />}
                {activeTab === 'holidays' && <HolidayFinder />}
                {activeTab === 'trivia' && <TriviaQuiz />}
                {activeTab === 'ip' && <IpGeo />}
            </div>
        </div>
    );
}

const TabButton = ({ id, label, icon: Icon, active, set }: any) => (
    <button
        onClick={() => set(id)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${active === id ? 'bg-primary text-white shadow-md' : 'hover:bg-background text-secondary'}`}
    >
        <Icon size={18} />
        <span className="hidden md:inline">{label}</span>
    </button>
);

function NasaApod() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // DEMO_KEY is rate limited, but works for limited testing.
        fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY')
            .then(res => res.json())
            .then(setData)
            .catch(() => setData(null))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="text-center p-12 font-bold animate-pulse">Contacting NASA...</div>;
    if (!data) return <div className="text-center p-12 text-red-500 font-bold">Failed to load APOD (Rate Limit Exceeded). Try again later.</div>;

    return (
        <div className="bg-surface rounded-3xl overflow-hidden border border-border shadow-xl">
            <div className="relative h-[400px] bg-black">
                {data.media_type === 'image' ? (
                    <img src={data.url} alt={data.title} className="w-full h-full object-contain" />
                ) : (
                    <iframe src={data.url} className="w-full h-full border-0" />
                )}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                    <h2 className="text-3xl font-black">{data.title}</h2>
                    <p className="opacity-80">{data.date}</p>
                </div>
            </div>
            <div className="p-8 space-y-4">
                <p className="leading-relaxed text-secondary">{data.explanation}</p>
                {data.copyright && <p className="text-sm font-bold text-secondary">© {data.copyright}</p>}
            </div>
        </div>
    );
}

function HolidayFinder() {
    const [country, setCountry] = useState('US');
    const [year, setYear] = useState(new Date().getFullYear());
    const [holidays, setHolidays] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchHolidays = async () => {
        setLoading(true);
        try {
            const res = await fetch(`https://date.nager.at/api/v3/publicholidays/${year}/${country}`);
            if (res.ok) {
                const data = await res.json();
                setHolidays(data);
            } else {
                setHolidays([]);
            }
        } catch (e) {
            setHolidays([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchHolidays(); }, [country, year]);

    return (
        <div className="bg-surface p-8 rounded-3xl border border-border shadow-lg space-y-6">
            <div className="flex gap-4">
                <select value={country} onChange={(e) => setCountry(e.target.value)} className="flex-1 p-3 bg-background border border-border rounded-lg font-bold">
                    <option value="US">United States</option>
                    <option value="GB">United Kingdom</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="IN">India</option>
                    <option value="JP">Japan</option>
                </select>
                <input type="number" value={year} onChange={(e) => setYear(parseInt(e.target.value))} className="w-24 p-3 bg-background border border-border rounded-lg font-bold" />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    <div className="col-span-full text-center py-12 font-bold opacity-50">Loading Holidays...</div>
                ) : holidays.length > 0 ? (
                    holidays.map((h, i) => (
                        <div key={i} className="p-4 bg-background border border-border rounded-xl flex flex-col gap-1">
                            <div className="text-sm font-bold text-primary">{h.date}</div>
                            <div className="font-bold">{h.name}</div> #
                            <div className="text-xs text-secondary">{h.localName}</div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12">No holidays found.</div>
                )}
            </div>
        </div>
    );
}

function TriviaQuiz() {
    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [score, setScore] = useState<number | null>(null);

    const fetchQuiz = async () => {
        setLoading(true);
        setAnswers({});
        setScore(null);
        try {
            const res = await fetch('https://opentdb.com/api.php?amount=5&type=multiple');
            const data = await res.json();
            const formatted = data.results.map((q: any) => ({
                ...q,
                options: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5)
            }));
            setQuestions(formatted);
        } catch (e) {
            setQuestions([]);
        } finally {
            setLoading(false);
        }
    };

    const checkAnswers = () => {
        let sc = 0;
        questions.forEach((q, i) => {
            if (answers[i] === q.correct_answer) sc++;
        });
        setScore(sc);
    };

    return (
        <div className="bg-surface p-8 rounded-3xl border border-border shadow-lg space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Trivia Challenge</h2>
                <button onClick={fetchQuiz} className="px-4 py-2 bg-primary text-white font-bold rounded-lg text-sm">New Quiz</button>
            </div>

            {loading ? (
                <div className="text-center py-12 animate-pulse font-bold">Loading Questions...</div>
            ) : questions.length === 0 ? (
                <div className="text-center py-12"><button onClick={fetchQuiz} className="text-primary font-bold underline">Start Quiz</button></div>
            ) : (
                <div className="space-y-8">
                    {questions.map((q, i) => (
                        <div key={i} className="space-y-3">
                            <p className="font-bold text-lg" dangerouslySetInnerHTML={{ __html: q.question }} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {q.options.map((opt: string) => (
                                    <button
                                        key={opt}
                                        onClick={() => setAnswers(prev => ({ ...prev, [i]: opt }))}
                                        className={`p-3 rounded-lg text-left text-sm font-medium border-2 transition-all ${score !== null
                                            ? opt === q.correct_answer
                                                ? 'border-green-500 bg-green-500/10'
                                                : answers[i] === opt ? 'border-red-500 bg-red-500/10' : 'border-border opacity-50'
                                            : answers[i] === opt ? 'border-primary bg-primary/5' : 'border-border hover:bg-background'
                                            }`}
                                        dangerouslySetInnerHTML={{ __html: opt }}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}

                    {score === null ? (
                        <button onClick={checkAnswers} disabled={Object.keys(answers).length < 5} className="w-full py-4 bg-primary text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed">
                            Submit Answers
                        </button>
                    ) : (
                        <div className="p-6 bg-background rounded-xl text-center border border-border">
                            <div className="text-xs uppercase font-bold text-secondary">Final Score</div>
                            <div className="text-4xl font-black text-primary">{score} / 5</div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function IpGeo() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Using ipwho.is as it is free, supports HTTPS/CORS, and requires no key
        fetch('https://ipwho.is/')
            .then(res => res.json())
            .then(setData)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="bg-surface p-8 rounded-3xl border border-border shadow-lg text-center space-y-6">
            <h2 className="text-2xl font-bold">Your Digital Footprint</h2>
            {loading ? (
                <div className="animate-pulse">Locating...</div>
            ) : data ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 text-left">
                    <InfoBox label="IP Address" value={data.ip} />
                    <InfoBox label="Location" value={`${data.city}, ${data.region_code}`} />
                    <InfoBox label="Country" value={`${data.country} ${data.flag.emoji}`} />
                    <InfoBox label="ISP" value={data.connection?.isp} />
                    <InfoBox label="Timezone" value={data.timezone?.id} />
                    <InfoBox label="Coordinates" value={`${data.latitude}, ${data.longitude}`} />
                </div>
            ) : (
                <div className="text-red-500 font-bold">Failed to load IP data.</div>
            )}
        </div>
    );
}

function SpaceTracker() {
    const [iss, setIss] = useState<any>(null);
    const [launches, setLaunches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [issRes, launchRes] = await Promise.all([
                fetch('https://api.wheretheiss.at/v1/satellites/25544'),
                fetch('https://lldev.thespacedevs.com/2.2.0/launch/upcoming/?limit=5')
            ]);
            const issData = await issRes.json();
            const launchData = await launchRes.json();
            setIss(issData);
            setLaunches(launchData.results || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-8">
            <div className="bg-surface p-8 rounded-3xl border border-border shadow-lg">
                <h3 className="text-2xl font-black mb-6 flex items-center gap-2"><Globe className="text-primary" /> ISS Live Position</h3>
                {loading && !iss ? (
                    <div className="animate-pulse">Tracking Satellite...</div>
                ) : iss ? (
                    <div className="grid gap-4 md:grid-cols-3">
                        <InfoBox label="Latitude" value={iss.latitude.toFixed(4)} />
                        <InfoBox label="Longitude" value={iss.longitude.toFixed(4)} />
                        <InfoBox label="Altitude" value={`${iss.altitude.toFixed(2)} km`} />
                        <InfoBox label="Velocity" value={`${iss.velocity.toFixed(2)} km/h`} />
                        <InfoBox label="Visibility" value={iss.visibility} />
                        <InfoBox label="Timestamp" value={new Date(iss.timestamp * 1000).toLocaleTimeString()} />
                    </div>
                ) : (
                    <div className="text-red-500">Failed to track ISS.</div>
                )}
            </div>

            <div className="bg-surface p-8 rounded-3xl border border-border shadow-lg">
                <h3 className="text-2xl font-black mb-6 flex items-center gap-2"><Rocket className="text-primary" /> Upcoming Space Launches</h3>
                <div className="space-y-4">
                    {launches.map((l: any) => (
                        <div key={l.id} className="p-4 bg-background border border-border rounded-xl flex justify-between items-center flex-wrap gap-4">
                            <div>
                                <div className="font-bold text-lg">{l.name}</div>
                                <div className="text-sm text-secondary">{l.launch_service_provider?.name} • {l.pad?.location?.name}</div>
                            </div>
                            <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-bold text-sm">
                                {new Date(l.net).toLocaleString()}
                            </div>
                        </div>
                    ))}
                    {launches.length === 0 && !loading && <div className="text-secondary">No upcoming launch data available.</div>}
                </div>
            </div>
        </div>
    );
}

const InfoBox = ({ label, value }: any) => (
    <div className="p-4 bg-background border border-border rounded-xl">
        <div className="text-xs font-bold text-secondary uppercase mb-1">{label}</div>
        <div className="font-mono font-bold truncate" title={value}>{value}</div>
    </div>
);
