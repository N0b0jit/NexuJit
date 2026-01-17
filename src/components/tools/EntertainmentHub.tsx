'use client';

import { useState, useEffect, useRef } from 'react';
import { Smile, Quote, Lightbulb, Binary, Dog, Cat, Activity, Dices, RefreshCw, Image as ImageIcon } from 'lucide-react';

export default function EntertainmentHub({ defaultTab = 'jokes' }: { defaultTab?: string }) {
    const [activeTab, setActiveTab] = useState(defaultTab);

    const tabs = [
        { id: 'jokes', label: 'Jokes', icon: Smile },
        { id: 'quotes', label: 'Quotes', icon: Quote },
        { id: 'facts', label: 'Fun Facts', icon: Lightbulb },
        { id: 'numbers', label: 'Number Trivia', icon: Binary },
        { id: 'animals', label: 'Pets', icon: Dog },
        { id: 'memes', label: 'Memes', icon: ImageIcon },
        { id: 'activities', label: 'Bored Button', icon: Activity },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-wrap gap-2 justify-center bg-surface p-2 rounded-xl border border-border">
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

            <div className="bg-surface p-8 rounded-3xl border border-border shadow-lg min-h-[400px] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

                <div className="w-full max-w-2xl relative z-10">
                    {activeTab === 'jokes' && <JokeGenerator />}
                    {activeTab === 'quotes' && <QuoteGenerator />}
                    {activeTab === 'facts' && <FactGenerator />}
                    {activeTab === 'numbers' && <NumberTrivia />}
                    {activeTab === 'animals' && <AnimalViewer />}
                    {activeTab === 'memes' && <MediaMemeHub />}
                    {activeTab === 'activities' && <ActivitySuggester />}
                </div>
            </div>
        </div>
    );
}

// --- Sub Components ---

function JokeGenerator() {
    const [joke, setJoke] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const fetchJoke = async () => {
        setLoading(true);
        try {
            const res = await fetch('https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist&safe-mode');
            const data = await res.json();
            setJoke(data);
        } catch (e) {
            setJoke({ type: 'single', joke: 'Failed to fetch joke. Why did the web developer leave the restaurant? Because of the table layout.' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchJoke(); }, []);

    return (
        <div className="text-center space-y-6">
            <div className="space-y-4 min-h-[150px] flex flex-col justify-center">
                {loading ? (
                    <div className="animate-pulse text-xl font-bold opacity-50">Thinking of a funny one...</div>
                ) : joke?.type === 'twopart' ? (
                    <>
                        <p className="text-2xl font-bold">{joke.setup}</p>
                        <p className="text-xl text-primary font-black italic mt-4">{joke.delivery}</p>
                    </>
                ) : (
                    <p className="text-2xl font-bold">{joke?.joke}</p>
                )}
            </div>
            <button onClick={fetchJoke} disabled={loading} className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:scale-105 transition-transform flex items-center gap-2 mx-auto">
                <RefreshCw className={loading ? 'animate-spin' : ''} /> {loading ? 'Loading...' : 'Next Joke'}
            </button>
        </div>
    );
}

function QuoteGenerator() {
    const [quote, setQuote] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const fetchQuote = async () => {
        setLoading(true);
        try {
            // Using a reliable fallback list if API fails, as quotable often has downtime
            const res = await fetch('https://api.quotable.io/random');
            if (res.ok) {
                const data = await res.json();
                setQuote(data);
            } else {
                throw new Error('API Error');
            }
        } catch (e) {
            // Fallback quotes
            const fallbacks = [
                { content: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
                { content: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
                { content: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
                { content: "Stay hungry, stay foolish.", author: "Steve Jobs" },
                { content: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
                { content: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
                { content: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
                { content: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
                { content: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
                { content: "Don't count the days, make the days count.", author: "Muhammad Ali" }
            ];
            setQuote(fallbacks[Math.floor(Math.random() * fallbacks.length)]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchQuote(); }, []);

    return (
        <div className="text-center space-y-8">
            {loading ? (
                <div className="animate-pulse text-xl">Finding wisdom...</div>
            ) : (
                <blockquote className="space-y-4">
                    <p className="text-3xl font-serif font-bold leading-relaxed">"{quote?.content}"</p>
                    <footer className="text-lg text-primary font-bold">— {quote?.author}</footer>
                </blockquote>
            )}
            <button onClick={fetchQuote} disabled={loading} className="px-8 py-3 border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-colors mx-auto">
                New Quote
            </button>
        </div>
    );
}

function FactGenerator() {
    const [fact, setFact] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchFact = async () => {
        setLoading(true);
        try {
            const res = await fetch('https://uselessfacts.jsph.pl/random.json?language=en');
            const data = await res.json();
            setFact(data.text);
        } catch (e) {
            setFact("Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchFact(); }, []);

    return (
        <div className="text-center space-y-6">
            <h3 className="text-xs font-bold text-secondary uppercase">Did you know?</h3>
            <div className="min-h-[100px] flex items-center justify-center">
                {loading ? <div className="animate-pulse">Digging up facts...</div> : <p className="text-2xl font-bold">{fact}</p>}
            </div>
            <button onClick={fetchFact} className="px-8 py-3 bg-secondary/10 text-foreground font-bold rounded-xl hover:bg-secondary/20 transition-colors mx-auto">
                Learn Another
            </button>
        </div>
    );
}

function NumberTrivia() {
    const [number, setNumber] = useState(42);
    const [type, setType] = useState('math');
    const [fact, setFact] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchTrivia = async () => {
        setLoading(true);
        try {
            const res = await fetch(`https://numbersapi.com/${number}/${type}`);
            const text = await res.text();
            setFact(text);
        } catch (e) {
            setFact("Numbers API might be down or blocked by mixed content. 42 is the answer to life, the universe, and everything.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchTrivia(); }, [number, type]);

    return (
        <div className="text-center space-y-6 max-w-md mx-auto">
            <div className="flex gap-4 items-end">
                <div className="space-y-2 flex-1">
                    <label className="text-xs font-bold text-secondary">Number</label>
                    <input type="number" value={number} onChange={(e) => setNumber(parseInt(e.target.value) || 0)} className="w-full p-3 rounded-lg border border-border bg-background" />
                </div>
                <div className="space-y-2 flex-1">
                    <label className="text-xs font-bold text-secondary">Type</label>
                    <select value={type} onChange={(e) => setType(e.target.value)} className="w-full p-3 rounded-lg border border-border bg-background">
                        <option value="math">Math</option>
                        <option value="trivia">Trivia</option>
                        <option value="date">Date</option>
                        <option value="year">Year</option>
                    </select>
                </div>
            </div>

            <div className="p-6 bg-background rounded-xl border border-border min-h-[100px] flex items-center justify-center">
                {loading ? <div className="animate-pulse">Calculating...</div> : <p className="font-bold">{fact}</p>}
            </div>

            <button onClick={() => setNumber(Math.floor(Math.random() * 100))} className="text-sm text-primary font-bold hover:underline">
                Pick Random Number
            </button>
        </div>
    );
}

function AnimalViewer() {
    const [mode, setMode] = useState<'dog' | 'cat'>('dog');
    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchAnimal = async () => {
        setLoading(true);
        try {
            const url = mode === 'dog' ? 'https://api.thedogapi.com/v1/images/search' : 'https://api.thecatapi.com/v1/images/search';
            const res = await fetch(url);
            const data = await res.json();
            setImage(data[0].url);
        } catch (e) {
            setImage('');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAnimal(); }, [mode]);

    return (
        <div className="space-y-6 text-center">
            <div className="flex justify-center gap-4">
                <button onClick={() => setMode('dog')} className={`p-4 rounded-xl border-2 transition-all ${mode === 'dog' ? 'border-primary bg-primary/5' : 'border-transparent hover:bg-background'}`}>
                    <Dog size={32} className={mode === 'dog' ? 'text-primary' : 'text-secondary'} />
                </button>
                <button onClick={() => setMode('cat')} className={`p-4 rounded-xl border-2 transition-all ${mode === 'cat' ? 'border-primary bg-primary/5' : 'border-transparent hover:bg-background'}`}>
                    <Cat size={32} className={mode === 'cat' ? 'text-primary' : 'text-secondary'} />
                </button>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-lg border border-border bg-black aspect-video relative flex items-center justify-center">
                {loading && <div className="absolute inset-0 flex items-center justify-center bg-surface"><RefreshCw className="animate-spin" /></div>}
                {image && <img src={image} alt={mode} className="w-full h-full object-contain" onLoad={() => setLoading(false)} />}
            </div>

            <button onClick={fetchAnimal} className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                Next {mode === 'dog' ? 'Doggo' : 'Kitty'}
            </button>
        </div>
    );
}

function ActivitySuggester() {
    const [activity, setActivity] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const fetchActivity = async () => {
        setLoading(true);
        try {
            // BoredAPI is often down, using local fallback if needed, but trying first
            const res = await fetch('https://bored-api.appbrewery.com/random');
            if (res.ok) {
                const data = await res.json();
                setActivity(data);
            } else { throw new Error('API Error'); }
        } catch (e) {
            const localActivities = [
                { activity: "Learn how to fold a paper crane", type: "education", participants: 1 },
                { activity: "Write a letter to your future self", type: "social", participants: 1 },
                { activity: "Go for a walk without your phone", type: "relaxation", participants: 1 },
                { activity: "Bake a pie", type: "cooking", participants: 1 },
                { activity: "Start learning a new language on Duolingo", type: "education", participants: 1 },
                { activity: "Watch a documentary about the universe", type: "education", participants: 1 },
                { activity: "Try a 10-minute guided meditation", type: "relaxation", participants: 1 },
                { activity: "Organize your digital files/desktop", type: "busywork", participants: 1 },
                { activity: "Call an old friend you haven't spoken to in months", type: "social", participants: 2 },
                { activity: "Do 20 pushups right now", type: "recreational", participants: 1 }
            ];
            setActivity(localActivities[Math.floor(Math.random() * localActivities.length)]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchActivity(); }, []);

    return (
        <div className="text-center space-y-8">
            <h3 className="text-2xl font-bold">Bored? Try this:</h3>

            <div className="p-8 bg-background border border-border rounded-2xl shadow-sm space-y-4">
                <p className="text-3xl font-black text-primary">{activity?.activity}</p>
                <div className="flex justify-center gap-4 text-sm font-bold text-secondary uppercase">
                    <span className="bg-surface px-3 py-1 rounded-full border border-border">{activity?.type}</span>
                    <span className="bg-surface px-3 py-1 rounded-full border border-border">{activity?.participants} Person</span>
                </div>
            </div>

            <button onClick={fetchActivity} className="px-8 py-3 bg-secondary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity">
                Find Something Else
            </button>
        </div>
    );
}

function MediaMemeHub() {
    const [memes, setMemes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [gifs, setGifs] = useState<any[]>([]);

    const fetchMemes = async () => {
        setLoading(true);
        try {
            const res = await fetch('https://api.imgflip.com/get_memes');
            const data = await res.json();
            setMemes(data.data.memes.slice(0, 10));
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const searchGifs = async () => {
        if (!search) return;
        setLoading(true);
        try {
            const res = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&q=${search}&limit=10`);
            const data = await res.json();
            setGifs(data.data || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchMemes(); }, []);

    return (
        <div className="space-y-8">
            <div className="flex gap-2">
                <input
                    placeholder="Search GIFs..."
                    className="flex-1 p-3 bg-background border border-border rounded-xl font-bold"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && searchGifs()}
                />
                <button onClick={searchGifs} className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg">Search</button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {loading ? (
                    <div className="col-span-full text-center py-12 animate-pulse">Loading viral content...</div>
                ) : (
                    (gifs.length > 0 ? gifs : memes).map((item: any) => (
                        <div key={item.id} className="aspect-square rounded-lg overflow-hidden border border-border bg-black shadow-sm group relative">
                            <img
                                src={item.url || item.images?.fixed_height?.url}
                                alt="Reaction"
                                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                            />
                        </div>
                    ))
                )}
            </div>

            <p className="text-xs text-center text-secondary font-medium">
                {gifs.length > 0 ? 'Showing GIPHY results' : 'Trending Meme Templates'}
            </p>
        </div>
    );
}
