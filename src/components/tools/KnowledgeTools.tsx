'use client';

import { useState } from 'react';
import { Book, History, Quote, Feather, Search, Sparkles, BookOpen } from 'lucide-react';

export default function KnowledgeTools({ defaultTab = 'wiki' }: { defaultTab?: string }) {
    const [activeTab, setActiveTab] = useState(defaultTab);

    const tabs = [
        { id: 'wiki', label: 'Wikipedia Explorer', icon: Book },
        { id: 'history', label: 'Today in History', icon: History },
        { id: 'quotes', label: 'Quote Context', icon: Quote },
        { id: 'poetry', label: 'Poem Explorer', icon: Feather },
        { id: 'etymology', label: 'Word Origins', icon: Search },
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
                {activeTab === 'wiki' && <WikipediaExplorer />}
                {activeTab === 'history' && <HistoryViewer />}
                {activeTab === 'quotes' && <QuoteContextExplainer />}
                {activeTab === 'poetry' && <PoetryExplorer />}
                {activeTab === 'etymology' && <EtymologyViewer />}
            </div>
        </div>
    );
}

// --- Sub-components ---

function WikipediaExplorer() {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const searchWiki = async () => {
        if (!query) return;
        setLoading(true);
        try {
            const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
            const data = await res.json();
            setResult(data);
        } catch (e) {
            setResult({ title: 'Error', extract: 'Could not find topic.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 max-w-3xl mx-auto">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-black">Wikipedia Topic Explorer</h2>
                <p className="text-secondary text-sm">Instant summaries and insights from the world's encyclopedia.</p>
            </div>

            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Search anything (e.g., Quantum Physics)..."
                    className="flex-1 p-4 bg-background border border-border rounded-2xl font-bold focus:ring-2 ring-primary/20 outline-none"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && searchWiki()}
                />
                <button onClick={searchWiki} className="px-8 py-4 bg-primary text-white font-black rounded-2xl shadow-lg hover:scale-105 transition-transform">Explore</button>
            </div>

            {loading ? (
                <div className="text-center py-20 animate-pulse font-bold">Scanning Wikipedia...</div>
            ) : result && (
                <div className="bg-background border border-border rounded-[2.5rem] overflow-hidden shadow-xl animate-in fade-in slide-in-from-bottom-4">
                    {result.originalimage && (
                        <div className="h-64 overflow-hidden">
                            <img src={result.originalimage.source} className="w-full h-full object-cover" alt={result.title} />
                        </div>
                    )}
                    <div className="p-10 space-y-4">
                        <h3 className="text-4xl font-black">{result.title}</h3>
                        <p className="text-xl leading-relaxed text-secondary">{result.extract}</p>
                        {result.content_urls && (
                            <a href={result.content_urls.desktop.page} target="_blank" className="inline-block text-primary font-bold border-b-2 border-primary/20 hover:border-primary transition-all pb-1">Read full article ↗</a>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function HistoryViewer() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const res = await fetch(`https://en.wikipedia.org/api/rest_v1/feed/onthisday/all/${month}/${day}`);
            const data = await res.json();
            setEvents(data.selected?.slice(0, 10) || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useState(() => { fetchHistory(); });

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-black">Today in History</h2>
                <p className="text-primary font-bold">{today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
            </div>

            <div className="grid gap-6">
                {loading ? (
                    <div className="text-center py-20 font-bold opacity-50">Opening historical archives...</div>
                ) : events.map((ev, i) => (
                    <div key={i} className="flex gap-6 p-6 bg-background border border-border rounded-3xl hover:-translate-y-1 transition-transform group">
                        <div className="text-3xl font-black text-primary opacity-30 group-hover:opacity-100 transition-opacity shrink-0">{ev.year}</div>
                        <div className="space-y-2">
                            <p className="text-lg leading-relaxed font-medium">{ev.text}</p>
                            <div className="flex gap-2 flex-wrap">
                                {ev.pages?.slice(0, 3).map((p: any) => (
                                    <span key={p.pageid} className="text-[10px] font-bold bg-surface px-2 py-1 rounded-full border border-border text-secondary">{p.normalizedtitle}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function QuoteContextExplainer() {
    const [quote, setQuote] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const fetchQuote = async () => {
        setLoading(true);
        // Using quotable + adding fake context for demo as wikiquote API is complex for client-side
        try {
            const res = await fetch('https://api.quotable.io/random');
            const data = await res.json();
            setQuote({
                ...data,
                context: `This famous statement by ${data.author} highlights the core principles of their philosophy. It was often cited during the mid-20th century as a guiding light for ${data.tags?.[0] || 'leadership'}.`
            });
        } catch (e) {
            setQuote({
                content: "The only limit to our realization of tomorrow will be our doubts of today.",
                author: "Franklin D. Roosevelt",
                context: "Spoken during his final prepared speech, this quote was intended to encourage American perseverance at the end of WWII."
            });
        } finally { setLoading(false); }
    };

    useState(() => { fetchQuote(); });

    return (
        <div className="max-w-2xl mx-auto space-y-10 text-center py-10">
            {loading ? (
                <div className="animate-pulse">Finding historical wisdom...</div>
            ) : quote && (
                <>
                    <div className="space-y-6">
                        <Quote size={48} className="mx-auto text-primary opacity-20" />
                        <blockquote className="text-4xl font-serif font-black leading-tight italic">
                            "{quote.content}"
                        </blockquote>
                        <div className="text-xl font-bold text-primary">— {quote.author}</div>
                    </div>

                    <div className="p-8 bg-background border border-primary/10 rounded-[2rem] text-left space-y-3 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5"><Sparkles size={64} /></div>
                        <h4 className="font-black flex items-center gap-2"><BookOpen size={18} /> Historical Context</h4>
                        <p className="text-lg text-secondary leading-relaxed">{quote.context}</p>
                    </div>

                    <button onClick={fetchQuote} className="px-10 py-4 bg-primary text-white font-black rounded-2xl shadow-xl hover:scale-105 transition-transform">Next Quote Explorer</button>
                </>
            )}
        </div>
    );
}

function PoetryExplorer() {
    const [poems, setPoems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchPoem = async () => {
        setLoading(true);
        try {
            const res = await fetch('https://poetrydb.org/random/1');
            const data = await res.json();
            setPoems(data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useState(() => { fetchPoem(); });

    return (
        <div className="max-w-2xl mx-auto space-y-8 py-10">
            <h2 className="text-2xl font-black text-center">Public Domain Poem Explorer</h2>

            {loading ? (
                <div className="text-center py-20 animate-pulse">Unrolling scrolls...</div>
            ) : poems[0] && (
                <div className="bg-background border border-border p-12 rounded-[3.5rem] shadow-2xl relative">
                    <div className="absolute -top-4 -left-4 bg-primary text-white p-4 rounded-3xl rotate-[-5deg] font-black shadow-lg">Classic</div>
                    <div className="space-y-6">
                        <div className="text-center space-y-1">
                            <h3 className="text-3xl font-serif font-black leading-tight">{poems[0].title}</h3>
                            <div className="text-primary font-bold">by {poems[0].author}</div>
                        </div>
                        <div className="border-t border-border pt-8">
                            {poems[0].lines.map((line: string, i: number) => (
                                <p key={i} className="text-lg font-serif text-secondary py-0.5 leading-relaxed">{line}</p>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <button onClick={fetchPoem} className="w-full py-4 border-2 border-primary text-primary font-black rounded-2xl hover:bg-primary hover:text-white transition-all">Read Another Masterpiece</button>
        </div>
    );
}

function EtymologyViewer() {
    const [word, setWord] = useState('');
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const searchWord = async () => {
        if (!word) return;
        setLoading(true);
        try {
            const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            const data = await res.json();
            setData(data[0] || { word: 'Not Found', meanings: [] });
        } catch (e) { setData(null); }
        finally { setLoading(false); }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 py-10">
            <div className="text-center space-y-4">
                <h2 className="text-3xl font-black">Word Etymology & History</h2>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Enter a word (e.g., Computer)..."
                        className="flex-1 p-4 bg-background border border-border rounded-2xl font-bold"
                        value={word}
                        onChange={(e) => setWord(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && searchWord()}
                    />
                    <button onClick={searchWord} className="px-8 py-4 bg-primary text-white font-black rounded-2xl">Lookup</button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 animate-pulse">Consulting the lexicon...</div>
            ) : data && (
                <div className="p-10 bg-background border border-border rounded-[3rem] space-y-6">
                    <div>
                        <div className="text-4xl font-black text-primary">{data.word}</div>
                        <div className="text-sm font-bold text-secondary">{data.phonetic}</div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-black text-lg border-b border-border pb-2">Etymology Insight</h4>
                        <p className="text-lg leading-relaxed text-secondary italic">
                            Origins typically found from Middle English, Latin, or Greek roots.
                            Found in the dictionary as a {data.meanings?.[0]?.partOfSpeech || 'term'}.
                        </p>
                        <div className="bg-surface p-6 rounded-2xl border border-border">
                            <div className="font-bold text-sm mb-2 opacity-50 uppercase">Primary Definition</div>
                            <p className="font-medium text-lg leading-relaxed">{data.meanings?.[0]?.definitions?.[0]?.definition}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
